import settingModel from "../models/settingModel.js";

const defaultSettings = {
  currency: "ETB",
  deliveryFee: 10,
  taxRate: 8,
  freeDeliveryThreshold: 500,
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
    taxRate: Number(settings.taxRate ?? defaultSettings.taxRate),
    freeDeliveryThreshold: Number(
      settings.freeDeliveryThreshold ?? defaultSettings.freeDeliveryThreshold,
    ),
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
    const deliveryFee = Number(req.body.deliveryFee);
    const taxRate = Number(req.body.taxRate);
    const freeDeliveryThreshold = Number(req.body.freeDeliveryThreshold);

    if (
      ![deliveryFee, taxRate, freeDeliveryThreshold].every(Number.isFinite) ||
      deliveryFee < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      freeDeliveryThreshold < 0
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
          taxRate,
          freeDeliveryThreshold,
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
