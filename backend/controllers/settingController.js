import settingModel from "../models/settingModel.js";

const defaultSettings = {
  currency: "ETB",
  deliveryFee: 10,
  taxRate: 8,
  freeDeliveryThreshold: 500,
  telebirrAccountName: "Tanna Cafe",
  telebirrAccountNumber: "",
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
    telebirrAccountName:
      settings.telebirrAccountName || defaultSettings.telebirrAccountName,
    telebirrAccountNumber: settings.telebirrAccountNumber || "",
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
    const telebirrAccountName = req.body.telebirrAccountName?.toString().trim();
    const telebirrAccountNumber = req.body.telebirrAccountNumber
      ?.toString()
      .trim();

    if (
      ![deliveryFee, taxRate, freeDeliveryThreshold].every(Number.isFinite) ||
      deliveryFee < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      freeDeliveryThreshold < 0 ||
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
