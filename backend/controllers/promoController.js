import promoModel from "../models/promoModel.js";
import userModel from "../models/userModel.js";

// ✅ Create promo
export const createPromo = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxRedemptions,
      maxUsers,
      totalDiscountBudget,
      expiresAt,
      active,
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: "Promo code and discount value are required",
      });
    }

    const existingPromo = await promoModel.findOne({
      code: code.trim().toUpperCase(),
    });
    if (existingPromo) {
      return res.status(400).json({
        success: false,
        message: "Promo code already exists",
      });
    }

    const promo = new promoModel({
      code: code.trim().toUpperCase(),
      description: description || "",
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      maxRedemptions: Number(maxRedemptions) || 0,
      maxUsers: Number(maxUsers) || 0,
      totalDiscountBudget: Number(totalDiscountBudget) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: active !== false,
    });

    await promo.save();

    res.json({
      success: true,
      message: "Promo created successfully",
      promo,
    });
  } catch (error) {
    console.error("Create promo error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ List promos
export const getPromos = async (req, res) => {
  try {
    const promos = await promoModel.find().sort({ createdAt: -1 });
    res.json({ success: true, promos });
  } catch (error) {
    console.error("Get promos error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update promo
export const updatePromo = async (req, res) => {
  try {
    const { promoId, ...updates } = req.body;
    if (!promoId) {
      return res
        .status(400)
        .json({ success: false, message: "Promo ID is required" });
    }

    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase();
    }

    const promo = await promoModel.findById(promoId);
    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    }

    Object.assign(promo, updates);
    await promo.save();

    res.json({ success: true, message: "Promo updated successfully", promo });
  } catch (error) {
    console.error("Update promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete promo
export const deletePromo = async (req, res) => {
  try {
    const { promoId } = req.body;
    if (!promoId) {
      return res
        .status(400)
        .json({ success: false, message: "Promo ID is required" });
    }

    const promo = await promoModel.findByIdAndDelete(promoId);
    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    }

    res.json({ success: true, message: "Promo deleted successfully" });
  } catch (error) {
    console.error("Delete promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Validate promo for checkout
export const validatePromo = async (req, res) => {
  try {
    const { couponCode, userId, subtotal } = req.body;
    if (!couponCode) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code is required" });
    }

    const normalized = couponCode.trim().toUpperCase();
    const promo = await promoModel.findOne({ code: normalized, active: true });
    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid promo code" });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code has expired" });
    }

    if (promo.maxRedemptions && promo.redemptionCount >= promo.maxRedemptions) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Promo code redemption limit reached",
        });
    }

    if (promo.maxUsers && promo.usedUsers.length >= promo.maxUsers) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code user limit reached" });
    }

    if (userId && promo.usedUsers.includes(userId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Promo code already used by this user",
        });
    }

    const discountAmount =
      promo.discountType === "fixed"
        ? promo.discountValue
        : (subtotal * promo.discountValue) / 100;

    if (
      promo.totalDiscountBudget &&
      promo.totalDiscountUsed + discountAmount > promo.totalDiscountBudget
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code budget exceeded" });
    }

    res.json({
      success: true,
      promo,
      discount: Number(discountAmount.toFixed(2)),
    });
  } catch (error) {
    console.error("Validate promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
