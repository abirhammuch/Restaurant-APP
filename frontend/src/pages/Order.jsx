import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  FaChevronDown,
  FaChevronRight,
  FaArrowRight,
  FaPlus,
  FaExpand,
} from "react-icons/fa";

const Order = () => {
  const { userOrder, navigate } = useContext(AppContext);

  return (
    <div>
      <div className="flex gap-3 items-center justify-center mt-9 font-bold text-3xl">
        <p>Total Orders</p>
        <p className="text-orange-600">3</p>
      </div>

      {/* order card */}
      <div className="border m-9 rounded-2xl border-gray-200 shadow-2xl shadow-black pb-9">
        <div>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] mx-9 border-b border-gray-400 px-4 py-4 mt-9">
            <p className="text-2xl font-bold">OrderId</p>
            <p className="text-2xl font-bold">order status</p>
            <p className="text-2xl font-bold">payment Status</p>
            <p className="text-2xl font-bold">View Details</p>
          </div>
          {userOrder &&
            userOrder.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_1fr] mx-9 border-b border-gray-400 px-4 py-4 mt-4"
              >
                <p className="text-md font-bold">{order._id}</p>
                <p
                  className={`text-md font-bold ${order.orderStatus === "pending" ? "" : ""}`}
                >
                  {order.orderStatus}
                </p>
                <p className="text-md font-bold">{order.paymentStatus}</p>
                <div
                  onClick={() => {
                    navigate(`/orders/${order._id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex gap-2 items-center"
                >
                  <p className="cursor-pointer  font-bold hover:text-orange-600">
                    View Detail
                  </p>
                  <FaChevronRight className="text-orange-600" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
