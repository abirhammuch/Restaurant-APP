import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaCopy } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TelebirrPayment = () => {
  const { orderId } = useParams();
  const {
    backendUrl,
    navigate,
    formatPrice,
    restaurantSettings,
    getUserOrder,
  } = useContext(AppContext);
  const [order, setOrder] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
          headers: { usertoken: localStorage.getItem("usertoken") },
        });
        if (response.data.success) {
          setOrder(response.data.order);
          setTransactionId(response.data.order.transactionId || "");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load your order",
        );
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [backendUrl, orderId]);

  const copyAccountNumber = async () => {
    if (!restaurantSettings.telebirrAccountNumber) return;
    await navigator.clipboard.writeText(
      restaurantSettings.telebirrAccountNumber,
    );
    toast.success("Telebirr account copied");
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Enter the Telebirr transaction ID");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.put(
        `${backendUrl}/api/order/telebirr/${orderId}`,
        { transactionId },
        { headers: { usertoken: localStorage.getItem("usertoken") } },
      );
      if (response.data.success) {
        setOrder(response.data.order);
        await getUserOrder();
        toast.success("Transaction submitted. We will verify it shortly.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to submit transaction",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        Loading payment details...
      </div>
    );
  if (!order)
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        Order not found.
      </div>
    );

  const submitted = Boolean(order.transactionId);

  return (
    <main className="min-h-screen bg-orange-50 px-5 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-10">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-amber-700"
        >
          <FaArrowLeft /> Back to orders
        </button>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Telebirr payment
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Complete your payment
        </h1>
        <p className="mt-2 text-gray-600">
          Send the exact amount, then enter the transaction ID so the cafe can
          verify it.
        </p>

        <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-gray-600">Pay to</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {restaurantSettings.telebirrAccountName}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3">
            <span className="font-mono text-lg">
              {restaurantSettings.telebirrAccountNumber ||
                "Account not configured"}
            </span>
            <button
              type="button"
              onClick={copyAccountNumber}
              disabled={!restaurantSettings.telebirrAccountNumber}
              title="Copy account number"
              className="rounded p-2 text-amber-700 hover:bg-amber-100 disabled:opacity-40"
            >
              <FaCopy />
            </button>
          </div>
          <div className="mt-5 flex justify-between border-t border-amber-200 pt-4 font-bold">
            <span>Order total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {submitted ? (
          <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <div className="flex items-center gap-2 font-bold">
              <FaCheck /> Transaction submitted for review
            </div>
            <p className="mt-2 text-sm">
              Transaction ID:{" "}
              <span className="font-mono">{order.transactionId}</span>
            </p>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="mt-5 rounded-lg bg-amber-600 px-5 py-2 font-semibold text-white hover:bg-amber-700"
            >
              View my orders
            </button>
          </div>
        ) : (
          <form onSubmit={submitPayment} className="mt-7">
            <label
              htmlFor="transaction-id"
              className="font-semibold text-gray-900"
            >
              Telebirr transaction ID
            </label>
            <input
              id="transaction-id"
              value={transactionId}
              onChange={(event) => setTransactionId(event.target.value)}
              placeholder="Enter the full transaction ID"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-lg bg-amber-600 py-3 font-bold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit transaction ID"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default TelebirrPayment;
