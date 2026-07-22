import React, { useContext, useEffect, useState } from "react";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const Contact = () => {
  const {
    currentUser,
    getChatThreadByUser,
    getGuestId,
    sendCustomerMessage,
    fetchCustomerThread,
  } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const chatUserId = currentUser?.id || getGuestId();
  const currentThread = getChatThreadByUser(chatUserId);

  useEffect(() => {
    const loadThread = async () => {
      if (!chatUserId) return;
      await fetchCustomerThread();
    };

    loadThread();
    const interval = setInterval(loadThread, 5000);
    return () => clearInterval(interval);
  }, [chatUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsSending(true);
    setStatus({ type: "", message: "" });
    const result = await sendCustomerMessage(trimmed);
    setInput("");

    if (result.success) {
      setStatus({
        type: "success",
        message: "Your request was sent to admin.",
      });
      await fetchCustomerThread();
    } else {
      setStatus({
        type: "error",
        message: "Unable to send your message. Please try again.",
      });
    }

    setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    setIsSending(false);
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
                Ask the anything you want or call a waiter to your table or
                order.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-[60vh]">
            {currentThread?.messages?.length > 0 ? (
              currentThread.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.from === "admin" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3 max-w-[90%] ${
                      message.from === "admin"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "bg-amber-100 text-gray-900"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {message.from === "admin" ? "Admin" : "Customer"}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {message.from === "admin" ? "Support" : "You"}
                      </span>
                    </div>
                    <p className="text-sm leading-6">{message.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No messages yet. Send a waiter request and the admin will reply
                here.
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="mt-4">
            <label className="block text-gray-700 mb-2">Customer message</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                rows="4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-h-[140px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary"
                placeholder="Type your waiter request here"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-3 text-white hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full min-w-[120px]"
              >
                {isSending ? "Sending..." : "Send"}
                <FaPaperPlane className="ml-2" />
              </button>
            </div>
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
