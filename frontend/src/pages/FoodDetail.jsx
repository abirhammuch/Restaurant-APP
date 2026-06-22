import React, { useContext, useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets/assets";
import Title from "../components/Title";
import { FaArrowLeft } from "react-icons/fa";

import More from "../components/More";
import CustomerComent from "../components/CustomerComent";
import Less from "../components/Less";

const FoodDetail = () => {
  const { foods, currency, navigate, foodDetail, setFoodDetail, popularFood, setPopularFood } =
    useContext(AppContext);
  const { id } = useParams();

  const [thumbnel, setThumbnel] = useState([]);

  const [perfectMatch, setPerfectMatch] = useState([]);
  const [more, setMore] = useState(false)
  const [showComment, setShowComment] = useState(false)

  const [toglePopular, setToglePopular] = useState(true);
  const category = useParams();

  useEffect(() => {
    const food = foods.filter((food) => food._id === id);
    setFoodDetail(food);
    setThumbnel();
  }, [foods, id],more);

  useEffect(() => {
    if (more) {
     const filteredFood= foods.filter((food) => food.category === category.category)
       setPerfectMatch(filteredFood)
       setPopularFood(foods.filter((food) => food.popular))
    }
    else{
         
       const filteredFood= foods.filter((food) => food.category === category.category)
       const filteredPopularFood = popularFood.slice(0,4)
       
       setPerfectMatch(filteredFood.slice(0,4))
       setPopularFood(filteredPopularFood)
      
       
       
       
       
    
    }
   

  }, [ more]);
 
  


  



  return (
    <div className="mb-9">
      <div className="m">
        <div
          onClick={() => navigate("/menu")}
          className="md:px-4 text-sm ml-9 mt-6 cursor-pointer text-amber-500 hover:text-amber-600 flex gap-3 "
        >
          
          <FaArrowLeft />
          <p>Back to Menu </p>
        </div>
      </div>

      <div className=" flex flex-col md:flex-row justify-around items-center ml-6 gap-3 mt-9 ">
        {/* left  */}
        <div>
          {foodDetail.map((item, index) => (
            <div key={index} className="flex flex-col">
              <img
                src={thumbnel ? thumbnel : item.image[0]}
                className="w-full rounded-2xl"
              />

              <div className="flex gap-3 mb-9">
                {item.image.map((image, index) => (
                  <div key={index} className="mt-6 border-amber-400">
                    <img
                      src={image}
                      onClick={() => setThumbnel(image)}
                      className="w-30 rounded-sm bg-gray-200 "
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {
            showComment && 
            <div>
                <CustomerComent  customername={"Alex"} comment={"It is very delicious food"}/>
            </div>
          }
        </div>

        {/* right  */}

        <div >
          {/* star */}
          <div className="flex items-center gap-0.5" onClick={() => setShowComment((prev) => !prev)}>
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-3.5 w-3"
                  src={i < 5 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p>(122)</p>
          </div>

          <p className="text-lg font-bold">Ethiopian Doro wot</p>

          {foodDetail.map((item, index) => (
            <div key={index}>
              <p>
                {currency}
                {item.price}
              </p>
            </div>
          ))}
          <p className="text-lg py-4">THE EXPERIANCE</p>
          <p className="text-sm pb-5 text-gray-700 ">
            Experiance culinary excelence with our Ethiopian Dorowot, it good
            cultural food
          </p>

          <p className="text-md">INGREDIENTS & ALLERGENS</p>
          <div className="flex gap-3 mt-3 mb-5">
            <div className="border px-5 py-2 rounded-2xl border-gray-400 font-bold text-sm bg-amber-100 ">
              Chikken
            </div>
            <div className="border px-5 py-2 rounded-2xl border-gray-400 font-bold text-sm bg-amber-100 ">
              Salt
            </div>
            <div className="border px-5 py-2 rounded-2xl border-gray-400 font-bold text-sm bg-amber-100 ">
              Water
            </div>
            <div className="border px-5 py-2 rounded-2xl border-gray-400 font-bold text-sm bg-amber-100 ">
              Oil
            </div>
          </div>

          <div className="border px-5 py-5 bg-gray-100 border-gray-300 rounded-2xl mt-9">
            <div className="flex gap-4 justify-between ">
              <p className="text-md  px-3"> Select Quantity</p>
              <div className="flex gap-8 border px-5 py-1 rounded-2xl  border-gray-500">
                <p className="font-bold text-md cursor-pointer">-</p>
                <p className="font-bold text-md">1</p>
                <p className="font-bold text-md cursor-pointer">+</p>
              </div>
            </div>

            <div className="grid grid-cols-[3fr_1fr]  rounded-2xl mt-3 gap-7 items-center mt-5">
              <button className="bg-amber-500 px-8 py-3 rounded-2xl text-white cursor-pointer ">
                Add to order
              </button>
              <p className=" flex justify-center border px-2 py-1 rounded-2xl border-gray-400 items-center cursor-pointer ">
                Share
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* popular section */}

      <div className="md
      :px-10 px-2 border-t border-gray-400 mt-12">
        <div className="mt-9">
          <div className="flex gap-9 mb-9">
            <p
              onClick={() => setToglePopular(true)}
              className="text-lg  pb-4 bg-amber-400 hover:bg-amber-500 cursor-pointer rounded-2xl px-3 py-1 text-white flex justify-center items-center"
            >
              Popular Right Now
            </p>
            <p
              onClick={() => setToglePopular(false)}
              className="text-lg  pb-4 bg-amber-400 hover:bg-amber-500 cursor-pointer rounded-2xl px-3 py-1 text-white justify-center items-center "
            >
              Perfect Match
            </p>
          </div>
            
              <div>

                     {toglePopular ? (
            <div>
              <p className="text-2xl mb-3">Popular Right Now</p>
              <p className="text-sm text-gray-600">
                Customer Who ordered this also loved these items.
              </p>

               <div onClick={() => setMore((prev) => !prev)}  >
                {
                  more ?  <Less text={'Less'} />:  <More text={'More'} />
                }
               </div>
              <div>
                <FoodCard food={popularFood} />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-2xl   mb-3">Perfect Match</p>
              <p className="text-sm text-gray-600">
                Peerfect match with your selection.
              </p>

             <div onClick={() => setMore((prev) => !prev)} >
               <More text={more ? "LESS" : "View All"} />
               </div>
              <div>
                <FoodCard food={perfectMatch} />
              </div>
            </div>
          )}

                </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
