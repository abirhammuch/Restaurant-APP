// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const couponRules = {
  PROMO10: 0.1,
  SAVE20: 0.2,
  WELCOME5: 0.05,
};

// ✅ Create Order - Matches your model
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, deliveryAddress, paymentMethod, note, couponCode, table } =
      req.body;

    console.log("=== CREATE ORDER ===");
    console.log("User ID:", userId);
    console.log("Items:", items?.length || 0);
    console.log("Payment Method:", paymentMethod);
    console.log("Table:", table);
    console.log("Note:", note);
    console.log("Delivery Address:", deliveryAddress);

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    // Get user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate and process items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await foodModel.findById(item.foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item ${item.foodId} not found`,
        });
      }

      const totalPrice = food.price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
        totalPrice: totalPrice,
        image: food.images?.[0] || "",
      });
    }

    // Calculate delivery fee, tax, and total
    const deliveryFee = subtotal > 500 ? 0 : 10;
    const taxRate = 8;
    const tax = (subtotal * taxRate) / 100;
    const normalizedCouponCode =
      couponCode?.toString().trim().toUpperCase() || "";
    const discountRate = normalizedCouponCode
      ? couponRules[normalizedCouponCode] || 0
      : 0;

    if (couponCode && !discountRate) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    const discount = Number((subtotal * discountRate).toFixed(2));
    const total = subtotal + deliveryFee + tax - discount;

    //  Create order with your model fields
    const order = new orderModel({
      userId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      deliveryAddress: {
        name: deliveryAddress?.name || user.name || "",
        email: deliveryAddress?.email || user.email || "",
        branch: deliveryAddress?.branch || "Restaurant",
        zipCode: deliveryAddress?.zipCode || "",
        country: deliveryAddress?.country || "Ethiopia",
        phone: deliveryAddress?.phone || user.phone || "",
      },
      paymentMethod: paymentMethod || "cash",
      paymentStatus: "pending",
      orderStatus: "pending",
      note: note || "",
      couponCode: couponCode || "",
      table: table || deliveryAddress?.table || "",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
    });

    await order.save();

    // ✅ Clear user's cart after order
    user.cartData = {};
    user.markModified("cartData");
    await user.save();

    // ✅ Populate user info for response
    const populatedOrder = await orderModel
      .findById(order._id)
      .populate("userId", "name email phone");

    res.json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single Order
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await orderModel
      .findOne({ _id: orderId, userId })
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const cancellableStatuses = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivering",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Valid statuses: " + validStatuses.join(", "),
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { "items.name": { $regex: search, $options: "i" } },
        { "deliveryAddress.name": { $regex: search, $options: "i" } },
        { "deliveryAddress.phone": { $regex: search, $options: "i" } },
        { table: { $regex: search, $options: "i" } },
      ];
    }

    const total = await orderModel.countDocuments(query);
    const orders = await orderModel
      .find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Admin: Get Order Stats
const getOrderStats = async (req, res) => {
  try {
    const statusStats = await orderModel.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue = await orderModel.aggregate([
      {
        $match: { orderStatus: { $ne: "cancelled" } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersToday = await orderModel.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const ordersThisMonth = await orderModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const avgOrderValue = await orderModel.aggregate([
      {
        $match: { orderStatus: { $ne: "cancelled" } },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$total" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        statusBreakdown: statusStats,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersToday,
        ordersThisMonth,
        averageOrderValue: avgOrderValue[0]?.average || 0,
        totalOrders: await orderModel.countDocuments(),
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Admin: Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const deletableStatuses = ["cancelled", "delivered"];
    if (!deletableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete order with status: ${order.orderStatus}. Only cancelled or delivered orders can be deleted.`,
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Admin: Get Order Analytics
const getOrderAnalytics = async (req, res) => {
  try {
    const { type = "daily", days = 30 } = req.query;

    let groupFormat;
    if (type === "daily") {
      groupFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (type === "monthly") {
      groupFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "daily" or "monthly"',
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: groupFormat,
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.json({
      success: true,
      analytics,
      type,
      days: parseInt(days),
    });
  } catch (error) {
    console.error("Get order analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
  deleteOrder,
  getOrderAnalytics,
};
