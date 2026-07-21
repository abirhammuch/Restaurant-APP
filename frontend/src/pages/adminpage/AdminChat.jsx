import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FaPaperPlane } from "react-icons/fa";

const AdminChat = () => {
  const { chatMessages, sendAdminMessage } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendAdminMessage = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsSending(true);
    sendAdminMessage(trimmed);
    setInput("");

    setTimeout(() => {
      setIsSending(false);
    }, 300);
  };

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Chat</h1>
      <p className="text-gray-600 mb-6">
        View customer requests and reply directly from the admin panel.
      </p>

      <div className="flex min-h-[60vh] flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl p-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-3xl p-4 shadow-sm ${
                  message.from === "admin"
                    ? "bg-amber-100 text-gray-900"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
                  <span>{message.from === "admin" ? "Admin" : "Customer"}</span>
                </div>
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSendAdminMessage}
          className="mt-4 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm"
        >
          <textarea
            rows="3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-3xl border border-gray-300 bg-gray-50 p-4 text-sm focus:outline-none focus:border-amber-400"
            placeholder="Type your reply to the customer"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Reply"}
            <FaPaperPlane className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChat;
