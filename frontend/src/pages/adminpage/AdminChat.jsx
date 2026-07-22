import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FaPaperPlane } from "react-icons/fa";

const AdminChat = () => {
  const {
    chatThreads,
    selectedChatUserId,
    setSelectedChatUserId,
    getLatestThreads,
    getChatThreadByUser,
    markThreadRead,
    sendAdminMessage,
  } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const threads = getLatestThreads();
  const activeThread = selectedChatUserId
    ? getChatThreadByUser(selectedChatUserId)
    : null;

  const unreadTotal = threads.reduce(
    (sum, thread) => sum + (thread.unreadCount || 0),
    0,
  );

  const unreadThreads = threads.filter(
    (thread) => (thread.unreadCount || 0) > 0,
  );
  const readThreads = threads.filter((thread) => !(thread.unreadCount || 0));

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

  const handleSelectThread = (userId) => {
    setSelectedChatUserId(userId);
    markThreadRead(userId);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chat Requests</h2>
        <div className="space-y-3">
          {unreadTotal > 0 && (
            <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">
              You have {unreadTotal} unread message{unreadTotal > 1 ? "s" : ""}.
            </div>
          )}

          {unreadThreads.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700">
                Unread Chats
              </div>
              {unreadThreads.map((thread) => (
                <button
                  key={thread.userId}
                  type="button"
                  onClick={() => handleSelectThread(thread.userId)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    selectedChatUserId === thread.userId
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {thread.userName || "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {thread.userEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {thread.unreadCount > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold uppercase text-white">
                          {thread.unreadCount} new
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {thread.messages.length} messages
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {thread.messages[thread.messages.length - 1]?.text}
                  </p>
                </button>
              ))}
            </div>
          )}

          {readThreads.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="text-sm font-semibold text-gray-700">
                Read Chats
              </div>
              {readThreads.map((thread) => (
                <button
                  key={thread.userId}
                  type="button"
                  onClick={() => handleSelectThread(thread.userId)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    selectedChatUserId === thread.userId
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {thread.userName || "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {thread.userEmail}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {thread.messages.length} messages
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {thread.messages[thread.messages.length - 1]?.text}
                  </p>
                </button>
              ))}
            </div>
          )}

          {threads.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
              No customer chat requests yet.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Chat</h1>
            <p className="text-gray-600">
              View customer requests and reply directly from the admin panel.
            </p>
          </div>
          {activeThread && (
            <div className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900">
              {activeThread.userName || "Customer"}
            </div>
          )}
        </div>

        <div className="flex min-h-[60vh] flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl p-4">
            {activeThread?.messages?.length > 0 ? (
              activeThread.messages.map((message) => (
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
                      <span>
                        {message.from === "admin" ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <p className="text-sm leading-6">{message.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-white p-8 text-center text-gray-500">
                {selectedChatUserId
                  ? "This chat thread has no messages yet."
                  : "Select a customer from the left to open their live chat."}
              </div>
            )}
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
              placeholder={
                selectedChatUserId
                  ? "Type your reply to the customer"
                  : "Select a customer thread before replying"
              }
              disabled={!selectedChatUserId}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim() || !selectedChatUserId}
              className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Reply"}
              <FaPaperPlane className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
