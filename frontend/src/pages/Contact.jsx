import React, { useState } from "react";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaComments,
} from "react-icons/fa";

const Contact = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "admin",
      text: "Hello! This live chat is for assigning a waiter. Send your request and the admin will respond shortly.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setStatus({ type: "", message: "" });

    setTimeout(() => {
      const adminReply = {
        id: Date.now() + 1,
        from: "admin",
        text: "Admin received your request. A waiter will be assigned shortly. Please wait for confirmation here.",
      };
      setMessages((prev) => [...prev, adminReply]);
      setIsSending(false);
      setStatus({
        type: "success",
        message: "Your request was sent to admin.",
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      {/* Status Message */}
      {status.message && (
        <div
          className={`mb-6 p-4 rounded-lg text-center ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center gap-3">
            <FaComments className="text-orange-500 text-2xl" />
            <div>
              <h2 className="text-2xl font-semibold">Live Chat</h2>
              <p className="text-sm text-gray-600">
                Ask the admin to assign a waiter to your table or order.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-[60vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-3 max-w-[90%] ${
                  message.from === "admin"
                    ? "bg-white self-start text-gray-800 shadow-sm"
                    : "bg-amber-100 self-end text-gray-900"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                  {message.from}
                </p>
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
            <label className="block text-gray-700 mb-2">Your request</label>
            <textarea
              rows="4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary"
              placeholder="Ask the admin to assign a waiter to your table or order"
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Send request"}
            </button>
          </form>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-gray-700">
            This live chat connects you to the admin so they can assign a waiter
            promptly.
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaPhone className="text-primary text-xl text-orange-500" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">+2 (51) 973-769-266</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-primary text-xl text-orange-500" />
              <div>
                <p className="font-semibold">Direct live support</p>
                <p className="text-gray-600">
                  Use the live chat on this page to request a waiter.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-primary text-xl text-orange-500" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-600">
                  Poly Street, Bahir Dar City, Ethiopia
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-primary text-xl text-orange-500" />
              <div>
                <p className="font-semibold">Business Hours</p>
                <p className="text-gray-600">Monday - Friday: 9am - 8pm</p>
                <p className="text-gray-600">Saturday: 10am - 6pm</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
