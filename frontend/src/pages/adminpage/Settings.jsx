import React from "react";

const Settings = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure your restaurant preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Restaurant Info</p>
          <p className="mt-2 text-sm text-gray-600">
            Update your name, contact details, and opening hours.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Notifications</p>
          <p className="mt-2 text-sm text-gray-600">
            Manage alerts for new orders and customer messages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
