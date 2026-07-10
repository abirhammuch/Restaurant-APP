import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaChevronRight } from "react-icons/fa";

const Order = () => {
  const { userOrder, navigate } = useContext(AppContext);

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "preparing":
      case "confirmed":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPaymentClasses = (status) => {
    return status?.toLowerCase() === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fffaf2_0%,_#ffffff_100%)] px-3 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-orange-100 bg-white/90 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.16)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                Your Orders
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Total Orders{" "}
                <span className="text-orange-600">
                  {userOrder?.length || 0}
                </span>
              </h1>
            </div>
            <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
              Track every order in one place
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 md:grid">
              <p>Order ID</p>
              <p>Order Status</p>
              <p>Payment Status</p>
              <p className="text-right">Details</p>
            </div>

            {userOrder && userOrder.length > 0 ? (
              userOrder.map((order, index) => (
                <div
                  key={index}
                  className="border-b border-slate-200 px-4 py-4 last:border-b-0 md:grid md:grid-cols-[1.2fr_1fr_1fr_0.8fr] md:items-center md:gap-4"
                >
                  <div className="mb-3 md:mb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Order ID
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {order._id}
                    </p>
                  </div>

                  <div className="mb-3 md:mb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Order Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mb-3 md:mb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Payment Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPaymentClasses(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <button
                      onClick={() => {
                        navigate(`/orders/${order._id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                    >
                      <span>View Detail</span>
                      <FaChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-slate-500">
                <p className="text-lg font-semibold text-slate-700">
                  No orders yet
                </p>
                <p className="mt-2">
                  Your recent orders will appear here once you place one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
