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
    orders,
    currency,
    navigate,
    popularFood,
    foods,
    removeFromCart,
    updateCartItem,
    delivery_fee
  } = useContext(AppContext);

  const [more, setMore] = useState(false);
  const [slicedFood, setSlicedFood] = useState([]);

  useEffect(() => {
    setSlicedFood(popularFood.slice(0, 4));
  }, [foods, more, popularFood]);

  //  Handle quantity update
  const handleQuantityUpdate = async (foodId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateCartItem(foodId, newQuantity);
  };

  //  Handle remove item
  const handleRemoveItem = async (foodId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(foodId);
    }
  };

  return (
    <div>
      <div className="mx-10 md:mx-20 mt-9 md:grid md:grid-cols-[3fr_1fr] gap-9">
        <div>
          <div className="flex justify-between items-center border-b border-gray-500">
            <p className="pb-9 text-2xl font-bold">Review Order</p>
            <p className="mb-9 bg-gray-200 px-6 py-3 rounded-2xl font-bold">
              <span className="text-orange-600">{cartCount}</span> items
            </p>
          </div>

          {cart.items && cart.items.length > 0 ? (
            cart.items.map((order, index) => (
              <div
                key={index}
                className="mt-9 border px-9 py-4 rounded-2xl border-gray-300 shadow-2xl"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5 items-center">
                    <div>
                      <img src={order.image} className="w-20 rounded-md" alt={order.name} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold">{order.name}</p>
                        <p className="text-orange-600 font-bold">x{order.quantity}</p>
                      </div>
                      <p className="text-sm mt-2 mb-2 text-gray-700">
                        ${order.price} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-5 bg-gray-100 px-3 py-2 rounded-2xl">
                        <button
                          className="text-lg cursor-pointer hover:bg-gray-300 px-3 rounded-2xl transition-colors disabled:opacity-50"
                          onClick={() => handleQuantityUpdate(order.foodId, order.quantity, -1)}
                          disabled={order.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="text-lg font-semibold min-w-[20px] text-center">
                          {order.quantity}
                        </p>
                        <button
                          className="text-lg cursor-pointer hover:bg-gray-300 px-3 rounded-2xl transition-colors"
                          onClick={() => handleQuantityUpdate(order.foodId, order.quantity, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 items-center">
                    <p className="text-amber-500 font-bold">
                      {currency}
                      {order.totalPrice || order.price * order.quantity}
                    </p>
                    <div
                      onClick={() => handleRemoveItem(order.foodId)}
                      className="flex gap-4 cursor-pointer hover:text-red-500 transition-colors"
                    >
                      <img src={assets.remove_icon} alt="remove" />
                      <p>Remove</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={() => navigate("/menu")}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Start Shopping
              </button>
            </div>
          )}

          {/* Promo Code */}
          <div className="border border-dashed lg:flex py-6 mt-6 rounded-2xl items-center justify-between px-9 pr-18">
            <div className="flex items-center mb-4">
              <div className="flex">
                <img src={assets.coin_icon} className="mr-4" alt="coin" />
              </div>
              <div>
                <p className="text-lg font-bold">Have a promo code?</p>
                <p className="text-gray-700 text-sm">
                  Apply it now to get amazing discounts on your meal.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div>
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <p className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md cursor-pointer">
                  Apply
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="shadow p-9 rounded-2xl max-h-[600px] mt-20">
          <p className="text-2xl font-bold">Order Summary</p>
          <div>
            <div className="flex justify-between mt-4">
              <p className="text-sm">Subtotal</p>
              <p className="font-bold text-sm">
                {currency}
                {cart.subtotal || 0}
              </p>
            </div>
            <div className="flex justify-between mt-4 mb-4">
              <p className="text-sm">Delivery Fee</p>
              <p className="text-green-600 font-bold text-sm">
                {currency}
                {cart.subtotal < 50 ? 0 : delivery_fee}
              </p>
            </div>
            <div className="flex justify-between mt-4 mb-4">
              <p className="text-sm">Service Tax (8%)</p>
              <p className="font-bold text-sm">
                {currency}
                {((cart.subtotal || 0) * tax/100).toFixed(2)}
              </p>
            </div>
          </div>

          <hr className="text-gray-400" />
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-2xl font-bold">Total Amount</p>
              <p className="text-sm text-gray-600">VAT INCLUDED</p>
            </div>
            <p className="text-amber-600 font-bold text-2xl">
              {currency}
              {((cart.subtotal || 0) + (cart.subtotal < 50 ? 0 : delivery_fee) + ((cart.subtotal || 0) * tax/100)).toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-100 px-3 py-2 rounded-lg flex gap-3 items-center mt-7 mb-6">
            <div className="bg-green-600 w-2 rounded-sm h-2"></div>
            <p className="text-sm">
              We estimate your food will be ready in 25-35 minutes
            </p>
          </div>

          <div
            onClick={() => navigate("/checkout")}
            className="flex items-center gap-4 bg-amber-600 justify-center py-2 rounded-2xl text-white mb-4 cursor-pointer hover:bg-amber-700"
          >
            <p>Go to Checkout</p>
            <FaArrowRight />
          </div>

          <div
            onClick={() => navigate("/menu")}
            className="flex gap-4 justify-center items-center mt-3 cursor-pointer hover:text-orange-500 transition-colors"
          >
            <FaArrowLeft />
            <p>Back to Menu</p>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="mt-9 md:mx-20 border-t border-gray-300 shadow-2xl px-2 py-9 rounded-2xl">
        <div className="flex gap-3 items-center mt-9">
          <p className="text-md font-bold">Complete Your Meal</p>
          <p className="text-amber-700 bg-amber-50 px-3 py-1 rounded-2xl text-sm">
            Recommended
          </p>
        </div>
        <div onClick={() => setMore((prev) => !prev)} className="cursor-pointer">
          {more ? <Less text={"Less"} /> : <More text={"More"} />}
        </div>
        {popularFood && (
          <div>
            <FoodCard food={more ? popularFood : slicedFood} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;