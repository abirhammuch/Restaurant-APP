import settingModel from "../models/settingModel.js";

const defaultSettings = {
  currency: "ETB",
  deliveryFee: 10,
  deliveryFeePerKm: 10,
  restaurantAddress: "Tana, Bahir Dar, Ethiopia",
  taxRate: 8,
  freeDeliveryThreshold: 500,
  telebirrAccountName: "marshal",
  telebirrAccountNumber: "0973769266",
};

const getSettings = async () => {
  const settings = await settingModel.findOneAndUpdate(
    { key: "restaurant" },
    { $setOnInsert: { key: "restaurant", ...defaultSettings } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return {
    currency: "ETB",
    deliveryFee: Number(settings.deliveryFee ?? defaultSettings.deliveryFee),
    deliveryFeePerKm: Number(
      settings.deliveryFeePerKm ?? defaultSettings.deliveryFeePerKm,
    ),
    restaurantAddress:
      settings.restaurantAddress || defaultSettings.restaurantAddress,
    taxRate: Number(settings.taxRate ?? defaultSettings.taxRate),
    freeDeliveryThreshold: Number(
      settings.freeDeliveryThreshold ?? defaultSettings.freeDeliveryThreshold,
    ),
    telebirrAccountName:
      settings.telebirrAccountName || defaultSettings.telebirrAccountName,
    telebirrAccountNumber:
      settings.telebirrAccountNumber || defaultSettings.telebirrAccountNumber,
  };
};

export const getPublicSettings = async (req, res) => {
  try {
    res.json({ success: true, settings: await getSettings() });
  } catch (error) {
    console.error("Failed to load restaurant settings:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to load settings" });
  }
};

export const getAdminSettings = getPublicSettings;

export const updateSettings = async (req, res) => {
  try {
    const deliveryFeePerKm = Number(
      req.body.deliveryFeePerKm ?? req.body.deliveryFee,
    );
    const deliveryFee = Number(
      req.body.deliveryFee ?? req.body.deliveryFeePerKm,
    );
    const taxRate = Number(req.body.taxRate);
    const freeDeliveryThreshold = Number(req.body.freeDeliveryThreshold);
    const restaurantAddress =
      req.body.restaurantAddress?.toString().trim() ||
      defaultSettings.restaurantAddress;
    const telebirrAccountName = req.body.telebirrAccountName?.toString().trim();
    const telebirrAccountNumber = req.body.telebirrAccountNumber
      ?.toString()
      .trim();

    if (
      ![deliveryFeePerKm, taxRate, freeDeliveryThreshold].every(
        Number.isFinite,
      ) ||
      deliveryFeePerKm < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      freeDeliveryThreshold < 0 ||
      !restaurantAddress ||
      !telebirrAccountName
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter valid non-negative fees and a tax rate from 0 to 100.",
      });
    }

    await settingModel.findOneAndUpdate(
      { key: "restaurant" },
      {
        $set: {
          currency: "ETB",
          deliveryFee,
          deliveryFeePerKm,
          restaurantAddress,
          taxRate,
          freeDeliveryThreshold,
          telebirrAccountName,
          telebirrAccountNumber,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, settings: await getSettings() });
  } catch (error) {
    console.error("Failed to update restaurant settings:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update settings" });
  }
};

export { getSettings };
