// controllers/chapaController.js
import axios from "axios";
import orderModel from "../models/orderModel.js";

const CHAPA_API_URL = "https://api.chapa.co/v1";
const getChapaSecretKey = () => process.env.CHAPA_SECRET_KEY?.trim();

const getBackendBaseUrl = (req) => {
  if (process.env.BACKEND_URL)
    return process.env.BACKEND_URL.replace(/\/+$/, "");
  const forwardedProto = req.headers["x-forwarded-proto"];
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (forwardedProto && host) return `${forwardedProto}://${host}`;
  if (req.protocol && host) return `${req.protocol}://${host}`;
  return "http://localhost:3000";
};

const getFrontendBaseUrl = (req) => {
  if (process.env.FRONTEND_URL)
    return process.env.FRONTEND_URL.replace(/\/+$/, "");
  if (req.headers.origin) return req.headers.origin.replace(/\/+$/, "");
  return "http://localhost:5173";
};

// ✅ Initialize Chapa Payment
const initiateChapaPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const backendBaseUrl = getBackendBaseUrl(req);
    const frontendBaseUrl = getFrontendBaseUrl(req);

    // Check if API key is configured
    const chapaSecretKey = getChapaSecretKey();
    if (!chapaSecretKey) {
      console.error("❌ CHAPA_SECRET_KEY not configured");
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured. Contact support.",
      });
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Prepare Chapa payment payload
    const txRef = `order_${orderId}_${Date.now()}`; // Generate once, use everywhere
    const chapaPayload = {
      amount: order.total,
      currency: "ETB", // Ethiopian Birr
      email: order.deliveryAddress.email,
      first_name: order.deliveryAddress.name.split(" ")[0] || "Customer",
      last_name: order.deliveryAddress.name.split(" ")[1] || "",
      phone_number: order.deliveryAddress.phone,
      tx_ref: txRef, // Unique transaction reference
      callback_url: `${backendBaseUrl}/api/chapa/webhook`,
      return_url: `${frontendBaseUrl}/payment-status?tx_ref=${txRef}`,
      "customization[title]": "Digital Menu Order Payment",
      "customization[description]": `Payment for Order #${orderId}`,
      meta: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
    };

    console.log("📢 Initiating Chapa payment:", {
      orderId,
      amount: order.total,
      tx_ref: chapaPayload.tx_ref,
    });

    // Call Chapa API
    const chapaResponse = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      chapaPayload,
      {
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (chapaResponse.data.status === "success") {
      // Update order with Chapa transaction reference
      order.paymentGateway = "chapa";
      order.transactionId = chapaResponse.data.data.tx_ref;
      await order.save();

      console.log(
        "✅ Chapa payment initialized:",
        chapaResponse.data.data.tx_ref,
      );

      res.json({
        success: true,
        message: "Payment initialization successful",
        data: {
          checkout_url: chapaResponse.data.data.checkout_url,
          tx_ref: chapaResponse.data.data.tx_ref,
        },
      });
    } else {
      console.error(
        "❌ Chapa returned non-success status:",
        chapaResponse.data,
      );
      res.status(400).json({
        success: false,
        message: chapaResponse.data.message || "Failed to initialize payment",
      });
    }
  } catch (error) {
    console.error("❌ Chapa initialization error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to initialize payment. Please try again.",
    });
  }
};

// ✅ Verify Chapa Payment
const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required",
      });
    }

    const chapaSecretKey = getChapaSecretKey();
    if (!chapaSecretKey) {
      console.error("❌ CHAPA_SECRET_KEY not configured for verification");
      return res.status(500).json({
        success: false,
        message: "Payment verification not available",
      });
    }

    console.log("📢 Verifying Chapa payment:", tx_ref);

    // Verify with Chapa API
    const verifyResponse = await axios.get(
      `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
        },
      },
    );

    if (verifyResponse.data.status === "success") {
      const transactionData = verifyResponse.data.data;

      if (transactionData.status === "success") {
        // Extract orderId from tx_ref (format: order_ORDERID_TIMESTAMP)
        const orderIdMatch = transactionData.tx_ref.match(/order_([^_]+)_/);
        const orderId = orderIdMatch ? orderIdMatch[1] : null;

        if (orderId) {
          // Update order status
          const order = await orderModel.findById(orderId);
          if (order) {
            order.paymentStatus = "paid";
            order.paymentGateway = "chapa";
            order.transactionId = transactionData.tx_ref;
            order.transactionDetails = {
              amount: transactionData.amount,
              currency: transactionData.currency,
              status: transactionData.status,
              verifiedAt: new Date(),
            };
            await order.save();
            console.log("✅ Order updated to paid:", orderId);
          }
        }

        res.json({
          success: true,
          message: "Payment verified successfully",
          data: {
            status: transactionData.status,
            amount: transactionData.amount,
            currency: transactionData.currency,
            reference: transactionData.reference,
          },
        });
      } else {
        console.warn("⚠️ Transaction not successful:", transactionData.status);
        res.status(400).json({
          success: false,
          message: "Payment was not successful",
          data: transactionData,
        });
      }
    } else {
      console.error("❌ Verification failed:", verifyResponse.data);
      res.status(400).json({
        success: false,
        message: "Failed to verify payment",
      });
    }
  } catch (error) {
    console.error("❌ Chapa verification error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to verify payment",
    });
  }
};

// ✅ Webhook Handler for Chapa
const chapaWebhook = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    console.log("🔔 CHAPA WEBHOOK RECEIVED");
    console.log("   TX Ref:", tx_ref);
    console.log("   Status:", status);

    if (status === "success") {
      // Extract orderId from tx_ref (format: order_ORDERID_TIMESTAMP)
      const orderIdMatch = tx_ref.match(/order_([^_]+)_/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;

      if (orderId) {
        const order = await orderModel.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          order.paymentGateway = "chapa";
          order.transactionId = tx_ref;
          await order.save();

          console.log("✅ Webhook: Order marked as paid:", orderId);
        } else {
          console.warn("⚠️ Webhook: Order not found:", orderId);
        }
      } else {
        console.warn(
          "⚠️ Webhook: Could not extract orderId from tx_ref:",
          tx_ref,
        );
      }
    } else {
      console.warn("⚠️ Webhook: Payment not successful:", status);
    }

    // Always return success to Chapa (they don't care about our response)
    res.json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    // Still return success to Chapa
    res.json({
      success: true,
      message: "Webhook processed with error",
    });
  }
};

// ✅ Get Payment Status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      paymentGateway: order.paymentGateway,
      transactionId: order.transactionId,
    });
  } catch (error) {
    console.error("❌ Get payment status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
    });
  }
};

export {
  initiateChapaPayment,
  verifyChapaPayment,
  chapaWebhook,
  getPaymentStatus,
};
