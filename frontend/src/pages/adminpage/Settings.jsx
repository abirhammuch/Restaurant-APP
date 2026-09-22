import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Settings = () => {
  const { backendUrl, admintoken } = useContext(AppContext);
  const [settings, setSettings] = useState({
    deliveryFee: 10,
    taxRate: 8,
    freeDeliveryThreshold: 500,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/settings/admin`, {
          headers: { admintoken },
        });
        if (response.data.success) setSettings(response.data.settings);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load settings");
      }
    };

    if (admintoken) loadSettings();
  }, [admintoken, backendUrl]);

  const updateField = (field) => (event) => {
    setSettings((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/settings/admin`,
        settings,
        { headers: { admintoken } },
      );
      if (response.data.success) {
        setSettings(response.data.settings);
        toast.success("Payment settings saved");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure your restaurant preferences.</p>
      </div>

      <form
        onSubmit={saveSettings}
        className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5">
          <p className="font-semibold">Payment and delivery</p>
          <p className="mt-1 text-sm text-gray-600">
            All prices and payments use Ethiopian Birr (ETB / ብር).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Delivery fee (ብር)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.deliveryFee}
              onChange={updateField("deliveryFee")}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Service tax (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={settings.taxRate}
              onChange={updateField("taxRate")}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Free delivery from (ብር)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.freeDeliveryThreshold}
              onChange={updateField("freeDeliveryThreshold")}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 rounded-md bg-amber-600 px-5 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save payment settings"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
