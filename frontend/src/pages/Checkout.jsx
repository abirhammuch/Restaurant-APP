import React, { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { FaLightbulb } from "react-icons/fa";

import { FaUser } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";

const Checkout = () => {
  const { orders, currency, navigate } = useContext(AppContext);
  return (
    <div>
      <div
        onClick={() => navigate("/cart")}
        className="flex gap-3 mt-9 px-5 cursor-pointer "
      >
        <FaArrowLeft />
        <p>Back to Cart</p>
      </div>
      <div className="">
        <div>
          {/* customer info */}
          <form className="lg:grid grid-cols-[2fr_1fr] px-5 mt-5 mx-9 gap-9 ">
            <div className="">
              <p className="text-2xl font-bold">Checkout</p>
              <p className="text-gray-600">
                Complete your order details below to enjoy your meal.
              </p>
              <div className=" gap-3 mt-9">
                <div className="flex gap-3 items-center mb-4">
                  <FaUser />
                  <p>Customer Information</p>
                </div>

                <div className="md:flex  gap-4">
                  <div className="flex flex-col gap-2 ">
                    <p className="font-medium">Full Name</p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600 "
                        required
                      />
                      <FaUser className="text-gray-500 absolute top-3 left-2" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ">
                    <p className="font-medium">Phone Number</p>
                    <div className="relative">
                      <input
                        type="phone"
                        placeholder="09 11 22 33 44"
                        className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600 "
                        required
                      />
                      <FaPhone className="text-gray-500 absolute top-3 left-2" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2  mt-5">
                  <p className="font-medium">Email Address</p>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="example@gmaul.com"
                      className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600  "
                      required
                    />
                    <MdEmail className="text-gray-500 absolute top-3 left-2" />
                  </div>
                </div>

                <hr className="mt-5 text-gray-300" />
                <div className="mt-4">
                  <p className="font-medium  text-lg">Dining Details</p>
                  <div className="sm:flex gap-5 items-center justify-between">
                    <div>
                      <p className="mb-2 mt-2">Table Number</p>
                      <input
                        type="text"
                        placeholder="# e.g 12"
                        className="px-2 py-1"
                        required
                      />
                      <p className="text-sm text-gray-700">
                        Found on the corner of your table or QR stand
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 mt-2">Payment Method</p>
                      <div className="sm:flex justify-center items-center gap-9">
                        <div className=" border px-5 flex justify-center items-center gap-3 py-1 rounded-md border-amber-600 mb-4 sm:mb-0">
                          <FaCreditCard className="text-amber-600 " />
                          <p className="text-amber-600">Card</p>
                        </div>
                        <div className=" border px-5 flex justify-center items-center gap-3 py-1 rounded-md ">
                          <div className="border px-1 py-1 rounded-2xl"></div>
                          <p>Cash</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-5 text-gray-300" />
                <p className="font-medium  text-lg mt-4">Special Requist</p>
                <p className="mb-2 mt-2 text-sm">Order Notes (Optional)</p>
                <div>
                  <textarea
                    type="textarea"
                    placeholder="e.g. No onions, extra napkins or allergen info"
                    className=" w-full px-3 py-3 "
                  />
                </div>
                <div></div>
              </div>
            </div>

            {/* order summary */}
            <div>
              <div className="shadow-2xl px-9 py-8 rounded-2xl">
                <div className="flex  items-center justify-between mb-9">
                  <p className="text-2xl font-bold">Order summery</p>
                  <p className=" border px-3 py-1 rounded-md border-gray-300 ">
                    3 Items
                  </p>
                </div>

                {orders &&
                  orders.map((order, index) => (
                    <div>
                      <div
                        key={index}
                        className="flex  w-full  justify-between  border-b  border-gray-400 items-center "
                      >
                        <div className="flex  gap-3 ">
                          <div>
                            <img
                              src={order.image[0]}
                              className="w-20 rounded-md"
                            />
                          </div>
                          <div>
                            <p className="text-sm mt-4">{order.name}</p>
                            <p className="mb-7 text-sm">Qty: 1</p>
                          </div>
                        </div>

                        <p>
                          {currency}
                          {order.price}
                        </p>
                      </div>
                    </div>
                  ))}

                <div className="mt-15 ">
                  <div className="flex justify-between mb-2">
                    <p className="text-md">Subtotal</p>
                    <p>
                      {currency}
                      {9000.999}
                    </p>
                  </div>

                  <div className="flex justify-between mb-2">
                    <p className="text-md">Tax(8%)</p>
                    <p>
                      {currency}
                      {40.999}
                    </p>
                  </div>

                  <div className="flex justify-between mb-5">
                    <p className="text-md">Service Fee</p>
                    <p>
                      {currency}
                      {20.999}
                    </p>
                  </div>
                  <hr className="text-gray-400" />

                  <div className="flex justify-between mt-4">
                    <p className="font-bold text-lg">Total</p>
                    <p className="font-bold text-lg text-amber-700">
                      {currency}
                      {2918000.99}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="text-center bg-amber-600 w-full py-3 text-white text-lg rounded-2xl cursor-pointer hover:bg-amber-700 mt-4"
                  >
                    Place Order
                  </button>
                  <p className="text-sm mt-2 text-gray-600">
                    {" "}
                    By placing this order, you agree to our Terms of service and
                    Privecy Policy
                  </p>
                </div>
              </div>

              <div className="flex  gap-5 mt-5 border px-3 py-4 rounded-2xl border-dashed border-gray-300">
                <div className=" ">
                  <div className="border px-2 py-2 rounded-2xl border-amber-400 bg-amber-100">
                    <FaLightbulb className="text-amber-600 " />
                  </div>
                </div>
                <div>
                  <p className="font-bold">Need help with your order?</p>
                  <p className="text-sm text-gray-600">
                    Our concierge team is available for any questions about
                    allergens or ingredients.
                  </p>
                  <p className="font-bold text-amber-600 mt-3 cursor-pointer">
                    Call Service Representative
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Checkout;
