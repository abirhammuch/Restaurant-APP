import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import FoodCard from "./FoodCard";
import More from "./More";
import Less from "./Less";

const Cart = () => {
  const { orders, currency, navigate,popularFood,foods } = useContext(AppContext);


  const [more , setMore] = useState(false)
  const [slicedFood, setSlicedFood] = useState([])

  useEffect(() => {
    setSlicedFood(popularFood.slice(0,4))

  },[foods,more,popularFood])
  return (
    <div>
      <div className="mx-10 md:mx-20 mt-9 md:grid md:grid-cols-[3fr_1fr]    gap-9">
      <div>
        <div className="flex justify-between items-center border-b  border-gray-500">
          <p className="pb-9 text-2xl font-bold">Review Order</p>
          <p className="mb-9 bg-gray-200 px-6  py-3 rounded-2xl font-bold">
            3 items
          </p>
        </div>
        {orders.map((order, index) => (
          <div
            key={index}
            className="mt-9 border px-9 py-4 rounded-2xl border-gray-300 shadow-2xl "
          >
            <div className="flex justify-between">
              <div className="flex gap-5 items-center">
                <div>
                  <img src={order.image[0]} className="w-20 rounded-md" />
                </div>
                <div>
                  <p className="text-lg font-bold">{order.name}</p>
                  <p className="text-sm mt-2 mb-2 text-gray-700">
                    Medium rate, no onioons
                  </p>

                  <div className="flex justify-end  w-full items-center ">
                    <div className="flex gap-5 bg-gray-100 px-3 py-2 rounded-2xl">
                      <p className="text-lg cursor-pointer hover:bg-gray-300 px-3 rounded-2xl">
                        -
                      </p>
                      <p className="text-lg cursor-pointer hover:bg-gray-300 px-3 rounded-2xl">
                        1
                      </p>
                      <p className="text-lg cursor-pointer hover:bg-gray-300 px-3 rounded-2xl">
                        +
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 items-center">
                <p className="text-amber-500 font-bold">
                  {currency}
                  {order.price}
                </p>
                <div className="flex gap-4 cursor-pointer">
                  <img src={assets.remove_icon} />
                  <p>Remove</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="border border-dashed lg:flex  py-6 mt-6 rounded-2xl items-center justify-between px-9 pr-18">
          <div className="flex  items-center mb-4  ">
            <div className="flex ">
              <img src={assets.coin_icon} className="mr-4" />
            </div>
            <div className="">
              <p className="text-lg font-bold">Have a promo code?</p>
              <p className="text-gray-700 text-sm ">
                Apply it now to get amaizing discounts on your meal.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div>
              <input
                type="text"
                placeholder="Promo Code"
                className="px-3 py-2"
              />
            </div>
            <div>
              <p className="bg-amber-600 hover:bg-amber-700 text-white  px-3 py-2 rounded-md cursor-pointer">
                Apply
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" shadow p-9 rounded-2xl max-h-[600px] mt-20">
        <p className="text-2xl font-bold">Order Summery</p>
        <div>
          <div className="flex justify-between mt-4">
            <p className="text-sm">Subtotal</p>
            <p className="font-bold text-sm">
              {currency}
              {500.0}
            </p>
          </div>
          <div className="flex justify-between mt-4 mb-4">
            <p className="text-sm">Delivery Fee</p>
            <p className="text-green-600 font-bold text-sm">
              {currency}
              {3.5}
            </p>
          </div>
          <div className="flex justify-between mt-4 mb-4">
            <p className="text-sm">Service Tax(8%)</p>
            <p className="font-bold text-sm">
              {currency}
              {5.0}
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
            {70000.0}
          </p>
        </div>

        <div className="bg-gray-100 px-3 py-2 rounded-lg flex gap-3 items-center mt-7 mb-6">
          <div className="bg-green-600 borde w-2 rounded-sm h-2"></div>
          <p className="text-sm">
            We estimate your food will be ready in 25-35 minutes
          </p>
        </div>

        <div onClick={()=> navigate('/checkout')} className="flex  items-center gap-4 bg-amber-600 justify-center py-2 rounded-2xl text-white mb-4 cursor-pointer hover:bg-amber-700">
          <p >Go to Checkoout</p>
          <FaArrowRight />
        </div>

        <div
          onClick={() => navigate("/menu")}
          className="flex gap-4  justify-center items-center mt-3 cursor-pointer"
        >
          <FaArrowLeft />
          <p>Back to Menu</p>
        </div>
      </div>

     
    </div>
     <div className="mt-9  md:mx-20 border-t border-gray-300 shadow-2xl px-2 py-9 rounded-2xl">
        <div className="flex gap-3 items-center mt-9 ">
          <p className="text-md font-bold">Complete Your Meal</p>
          <p className="text-amber-700 bg-amber-50 px-3 py-1 rounded-2xl text-sm">Recomended</p>
        </div>
        <div onClick={() =>setMore((prev) => !prev)} className="">
          
       
        {more ? <Less text={'Less'} /> : <More text={'More'} /> 
        }
        </div>
        {
          popularFood && 

          
             <div >
             
                  <FoodCard food={ more ? popularFood : slicedFood}/>
              
               
            </div>
          
          
        }
      </div>
    </div>
  );
};

export default Cart;
