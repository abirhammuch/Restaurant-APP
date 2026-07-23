import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLocation } from "react-router-dom";

import { FaLightbulb } from "react-icons/fa";

import { FaUser } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const {
    orders,
    currency,
    formatPrice,
    navigate,
    cart,
    cartCount,
    delivery_fee,
    tax,
    setLoading,
    backendUrl,
    clearCart,
    getUserOrder,
    getLocalizedFoodName,
    t,
  } = useContext(AppContext);
  const location = useLocation();
  const [method, setMethod] = useState("cash");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const qrTable = searchParams.get("table");
    if (qrTable) {
      setTable(qrTable);
    }
  }, [location.search]);

  const getToken = () => localStorage.getItem("usertoken");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!method.trim()) {
      toast.error(t("selectPaymentMethod"));
      return;
    }

    if (!name.trim()) {
      toast.error(t("pleaseEnterYourFullName"));
      return;
    }

    if (!email.trim()) {
      toast.error(t("pleaseEnterYourEmail"));
      return;
    }
    if (!phone.trim()) {
      toast.error(t("pleaseEnterYourPhone"));
      return;
    }
    if (!table.trim()) {
      toast.error(t("pleaseEnterTableNumber"));
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      toast.error(t("cartEmpty"));
      return;
    }
    setLoading(true);

    try {
      // prepare order data
      const orderData = {
        items: cart.items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          table: table,
          phone: phone,
          name: name,
          email: email,
        },
        paymentMethod: method,
        note: note || "",
        couponCode: "",
      };

      const response = await axios.post(
        backendUrl + "/api/order/create",
        orderData,
        {
          headers: {
            usertoken: getToken(),
          },
        },
      );
      console.log("order response ", response.data);
      if (response.data.success) {
        toast.success(t("orderPlaced"));

        // ✅ Refresh the user orders list immediately
        await getUserOrder();

        // ✅ Clear cart
        await clearCart();

        // ✅ Navigate to order confirmation or orders page
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Failed to place order.....");
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate totals
  const subtotal = cart.subtotal || 0;
  const taxAmount = (subtotal * (tax || 8)) / 100;
  const deliveryFee = (cart.subtotal < 50 ? 0 : delivery_fee) || 0;
  const total = subtotal + taxAmount + deliveryFee;

  return (
    <div>
      <div
        onClick={() => navigate("/cart")}
        className="flex gap-3 mt-9 px-5 cursor-pointer "
      >
        <FaArrowLeft />
        <p>{t("backToCart")}</p>
      </div>
      <div className="">
        <div>
          {/* customer info */}
          <form
            onSubmit={onSubmitHandler}
            className="lg:grid grid-cols-[2fr_1fr] px-5 mt-5 mx-9 gap-9 "
          >
            <div className="">
              <p className="text-2xl font-bold">{t("checkoutTitle")}</p>
              <p className="text-gray-600">{t("completeOrderDetails")}</p>
              <div className=" gap-3 mt-9">
                <div className="flex gap-3 items-center mb-4">
                  <FaUser />
                  <p>{t("customerInformation")}</p>
                </div>

                <div className="md:flex  gap-4">
                  <div className="flex flex-col gap-2 ">
                    <p className="font-medium">{t("fullName")}</p>
                    <div className="relative">
                      <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder={t("enterYourName")}
                        className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600 "
                        required
                      />
                      <FaUser className="text-gray-500 absolute top-3 left-2" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ">
                    <p className="font-medium">{t("phoneNumber")}</p>
                    <div className="relative">
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        type="phone"
                        placeholder={t("enterYourPhone")}
                        className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600 "
                        required
                      />
                      <FaPhone className="text-gray-500 absolute top-3 left-2" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2  mt-5">
                  <p className="font-medium">{t("emailAddress")}</p>
                  <div className="relative">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="email"
                      placeholder={t("emailAddress")}
                      className="border border-gray-300 rounded-md py-2 px-9 focus:outline-none focus:ring-2 focus:ring-amber-600  "
                      required
                    />
                    <MdEmail className="text-gray-500 absolute top-3 left-2" />
                  </div>
                </div>

                <hr className="mt-5 text-gray-300" />
                <div className="mt-4">
                  <p className="font-medium  text-lg">{t("diningDetails")}</p>
                  <div className="sm:flex gap-5 items-center justify-between">
                    <div>
                      <p className="mb-2 mt-2">{t("tableNumber")}</p>
                      <input
                        onChange={(e) => setTable(e.target.value)}
                        value={table}
                        type="text"
                        placeholder={t("tableNumberPlaceholder")}
                        className="px-2 py-1"
                        required
                      />
                      <p className="text-sm text-gray-700">{t("tableHint")}</p>
                    </div>

                    <div>
                      <p className="mb-2 mt-2">{t("paymentMethod")}</p>
                      <div className="sm:flex justify-center items-center gap-9">
                        <div
                          onClick={() => setMethod("telebirr")}
                          value={method}
                          className={`border px-5 flex justify-center items-center gap-3 py-1 rounded-md  mb-4 sm:mb-0 cursor-pointer
                         ${method === "telebirr" ? "border-amber-600" : ""} `}
                        >
                          <p
                            className={`${method === "telebirr" ? "text-amber-600" : ""}`}
                          >
                            {t("telebirr")}
                          </p>
                        </div>
                        <div
                          onClick={() => setMethod("cash")}
                          value={method}
                          className={`border px-5 flex justify-center items-center gap-3 py-1 rounded-md  mb-4 sm:mb-0 cursor-pointer
                         ${method === "cash" ? "border-amber-600" : ""} `}
                        >
                          <p
                            className={`${method === "cash" ? "text-amber-600" : ""}`}
                          >
                            {t("cash")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-5 text-gray-300" />
                <p className="font-medium  text-lg mt-4">
                  {t("specialRequest")}
                </p>
                <p className="mb-2 mt-2 text-sm">{t("orderNotesOptional")}</p>
                <div>
                  <textarea
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    type="textarea"
                    placeholder={t("orderNotesPlaceholder")}
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
                  <p className="text-2xl font-bold">{t("orderSummary")}</p>
                  <p className=" border px-3 py-1 rounded-md border-gray-300 ">
                    <span className="text-orange-600 font-bold">
                      {" "}
                      {cartCount}
                    </span>{" "}
                    {t("itemsLabel")}
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
                            <p className="text-sm mt-4">
                              {getLocalizedFoodName(order)}
                            </p>
                            <p className="mb-7 text-sm">Qty: 1</p>
                          </div>
                        </div>

                        <p>{formatPrice(order.price)}</p>
                      </div>
                    </div>
                  ))}

                <div className="mt-15 ">
                  <div className="flex justify-between mb-2">
                    <p className="text-md">{t("subtotal")}</p>
                    <p>{formatPrice(cart.subtotal || 0)}</p>
                  </div>

                  <div className="flex justify-between mb-2">
                    <p className="text-md">{t("tax")}</p>
                    <p>{formatPrice(((cart.subtotal || 0) * tax) / 100)}</p>
                  </div>

                  <div className="flex justify-between mb-5">
                    <p className="text-md">{t("deliveryFee")}</p>
                    <p>{formatPrice(cart.subtotal < 50 ? 0 : 10)}</p>
                  </div>
                  <hr className="text-gray-400" />

                  <div className="flex justify-between mt-4">
                    <p className="font-bold text-lg">{t("total")}</p>
                    <p className="font-bold text-lg text-amber-700">
                      {formatPrice(
                        (cart.subtotal || 0) +
                          (cart.subtotal < 50 ? 0 : 10) +
                          ((cart.subtotal || 0) * tax) / 100,
                      )}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="text-center bg-amber-600 w-full py-3 text-white text-lg rounded-2xl cursor-pointer hover:bg-amber-700 mt-4"
                  >
                    {t("placeOrder")}
                  </button>
                  <p className="text-sm mt-2 text-gray-600">
                    {t("orderTerms")}
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
                  <p className="font-bold">{t("needHelp")}</p>
                  <p className="text-sm text-gray-600">{t("allergensInfo")}</p>
                  <p className="font-bold text-amber-600 mt-3 cursor-pointer">
                    {t("callServiceRepresentative")}
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
