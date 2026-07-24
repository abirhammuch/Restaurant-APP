import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaHourglass } from "react-icons/fa";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, t } = useContext(AppContext);
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [orderDetails, setOrderDetails] = useState(null);

  const tx_ref = searchParams.get("tx_ref");
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (tx_ref) {
          // Verify payment with Chapa
          const response = await axios.get(
            `${backendUrl}/api/chapa/verify?tx_ref=${tx_ref}`,
          );

          if (response.data.success) {
            setPaymentStatus("success");
            setOrderDetails(response.data.data);
            toast.success("Payment verified successfully!");
          } else {
            setPaymentStatus("failed");
            toast.error("Payment verification failed");
          }
        } else if (status === "completed" && orderId) {
          // Payment completed (from return_url)
          setPaymentStatus("success");
        } else {
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("failed");
        toast.error("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [tx_ref, orderId, status, backendUrl]);

  const handleContinue = () => {
    if (paymentStatus === "success") {
      navigate("/orders");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {paymentStatus === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <FaHourglass className="text-4xl text-amber-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {paymentStatus === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully.
            </p>
            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Amount:</strong> {orderDetails.amount}{" "}
                  {orderDetails.currency}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Reference:</strong> {orderDetails.reference}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    {orderDetails.status}
                  </span>
                </p>
              </div>
            )}
            <button
              onClick={handleContinue}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              View Order
            </button>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <FaTimesCircle className="text-5xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed!
            </h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try
              again.
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
