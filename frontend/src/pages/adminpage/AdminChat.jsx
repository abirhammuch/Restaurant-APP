import React from "react";

const AdminChat = () => {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Chat</h1>
      <p className="text-gray-600 mb-6">
        Use this screen to view and respond to customer chat requests.
      </p>
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
        <p className="text-lg font-semibold">Live chat is not yet connected.</p>
        <p className="mt-2">
          Once chat integration is enabled, customer requests will appear here
          for review.
        </p>
      </div>
    </div>
  );
};

export default AdminChat;
