import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import FoodCard from "./FoodCard";
import More from "./More";
import Less from "./Less";

const Cart = () => {
  const {
    tax,
    cartCount,
    cart,
    currency,
    formatPrice,
    navigate,
    popularFood,
    foods,
    removeFromCart,
    updateCartItem,
  } = useContext(AppContext);

  const [more, setMore] = useState(false);
  const [slicedFood, setSlicedFood] = useState([]);

  useEffect(() => {
    setSlicedFood(popularFood.slice(0, 4));
  }, [foods, more, popularFood]);

  const subtotal = cart.subtotal || 0;
  const deliveryUsd = subtotal < 50 ? 0 : 10;
  const serviceTaxUsd = Number(((subtotal * tax) / 100).toFixed(2));
  const totalAmountUsd = Number(
    (subtotal + deliveryUsd + serviceTaxUsd).toFixed(2),
  );

  const handleQuantityUpdate = async (foodId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateCartItem(foodId, newQuantity);
  };

  const handleRemoveItem = async (foodId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(foodId);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#fffaf2_0%,_#ffffff_100%)] px-3 py-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="mx-auto max-w-7xl space-y-6 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-8 lg:items-start">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-orange-100 bg-white/90 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">Review Order</p>
                <p className="mt-1 text-sm text-gray-600">
                  Your tasty picks are ready for checkout.
                </p>
              </div>
              <p className="inline-flex w-fit items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                <span className="mr-1 text-base">{cartCount}</span> items
              </p>
            </div>

            {cart.items && cart.items.length > 0 ? (
              <div className="mt-5 space-y-4">
                {cart.items.map((order, index) => (
                  <div
                    key={index}
                    className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-6">
                      <div className="flex flex-1 gap-4">
                        <img
                          src={order.image}
                          className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24"
                          alt={order.name}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-bold text-gray-900">
                              {order.name}
                            </p>
                            <p className="rounded-full bg-orange-100 px-2.5 py-1 text-sm font-semibold text-orange-700">
                              x{order.quantity}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            ${order.price} each
                          </p>

                          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gray-100 px-3 py-2 w-fit">
                            <button
                              className="rounded-xl px-3 py-1 text-lg font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() =>
                                handleQuantityUpdate(
                                  order.foodId,
                                  order.quantity,
                                  -1,
                                )
                              }
                              disabled={order.quantity <= 1}
                            >
                              -
                            </button>
                            <p className="min-w-[20px] text-center text-lg font-semibold text-gray-900">
                              {order.quantity}
                            </p>
                            <button
                              className="rounded-xl px-3 py-1 text-lg font-semibold text-gray-700 transition hover:bg-gray-200"
                              onClick={() =>
                                handleQuantityUpdate(
                                  order.foodId,
                                  order.quantity,
                                  1,
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                        <p className="text-lg font-bold text-amber-600">
                          {formatPrice(
                            order.totalPrice || order.price * order.quantity,
                          )}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(order.foodId)}
                          className="flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <img
                            src={assets.remove_icon}
                            alt="remove"
                            className="h-4 w-4"
                          />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Your cart is empty
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Add a few favorites and come back here.
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="mt-5 rounded-full bg-orange-500 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-600"
                >
                  Start Shopping
                </button>
              </div>
            )}

            <div className="mt-6 rounded-[24px] border border-dashed border-orange-200 bg-orange-50/80 p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={assets.coin_icon}
                    className="mt-1 h-6 w-6"
                    alt="coin"
                  />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      Have a promo code?
                    </p>
                    <p className="text-sm text-gray-600">
                      Apply it now to get amazing discounts on your meal.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 sm:w-48"
                  />
                  <button className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-6">
          <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] sm:p-6">
            <p className="text-2xl font-bold text-gray-900">Order Summary</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Delivery Fee</p>
                <p className="font-semibold text-green-600">
                  {formatPrice(deliveryUsd)}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Service Tax (8%)</p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(serviceTaxUsd)}
                </p>
              </div>
            </div>

            <hr className="my-5 border-gray-200" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-gray-900">Total Amount</p>
                <p className="mt-1 text-sm text-gray-500">VAT INCLUDED</p>
              </div>
              <p className="text-xl font-bold text-amber-600">
                {formatPrice(totalAmount)}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-100 px-3 py-3 text-sm text-gray-700">
              <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
              <p>We estimate your food will be ready in 25-35 minutes.</p>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              <span>Go to Checkout</span>
              <FaArrowRight />
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
            >
              <FaArrowLeft />
              <span>Back to Menu</span>
            </button>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-8 max-w-7xl rounded-[28px] border border-gray-100 bg-white/90 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.14)] sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg font-bold text-gray-900">Complete Your Meal</p>
          <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            Recommended
          </p>
        </div>
        <div
          onClick={() => setMore((prev) => !prev)}
          className="mt-3 flex justify-end cursor-pointer"
        >
          {more ? <Less text={"Less"} /> : <More text={"More"} />}
        </div>
        {popularFood && (
          <div className="mt-4">
            <FoodCard food={more ? popularFood : slicedFood} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
