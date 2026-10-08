import orderModel from "../models/orderModel.js";

const getDeliveryOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const status = req.query.status || "active";
    const allowedFilters = {
      active: ["ready", "delivering"],
      ready: ["ready"],
      delivering: ["delivering"],
      delivered: ["delivered"],
    };

    if (!allowedFilters[status]) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery order filter",
      });
    }

    const query = {
      serviceType: "delivery",
      paymentStatus: "paid",
      orderStatus: { $in: allowedFilters[status] },
    };
    const total = await orderModel.countDocuments(query);
    const orders = await orderModel
      .find(query)
      .select(
        "items total deliveryFee deliveryDistanceKm deliveryAddress orderStatus createdAt estimatedDeliveryTime note",
      )
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to load courier orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load delivery orders",
    });
  }
};

const updateDeliveryOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["delivering", "delivered"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Delivery staff can only start or complete a delivery",
      });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      serviceType: "delivery",
      paymentStatus: "paid",
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Paid delivery order not found",
      });
    }

    const canStartDelivery =
      status === "delivering" &&
      ["ready", "delivering"].includes(order.orderStatus);
    const canCompleteDelivery =
      status === "delivered" &&
      ["delivering", "delivered"].includes(order.orderStatus);
    if (!canStartDelivery && !canCompleteDelivery) {
      return res.status(409).json({
        success: false,
        message:
          status === "delivering"
            ? "This order is not ready for delivery yet"
            : "Start the delivery before marking it delivered",
      });
    }

    order.orderStatus = status;
    await order.save();
    return res.json({
      success: true,
      message: "Delivery status updated",
      order,
    });
  } catch (error) {
    console.error("Failed to update courier order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
};

export { getDeliveryOrders, updateDeliveryOrderStatus };
