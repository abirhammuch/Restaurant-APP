import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";
import Food from "./FoodCard";

const Search = () => {
  const {
    foods,
    navigate,
    setSearchedFood,
    searchedQuery,
    searchedFood,
    setSearchedQuery,
  } = useContext(AppContext);

  useEffect(() => {
    if (searchedQuery.length > 0) {
      setSearchedFood(
        foods.filter((food) =>
          food.name.toLowerCase().includes(searchedQuery.toLowerCase()),
        ),
      );
    } else {
      setSearchedFood(foods);
    }
  }, [foods, searchedQuery]);

  return (
    <div className=" hidden  sm:flex gap-4 justify-center my-12">
      <div className="relative ">
        <input
          onChange={(e) => setSearchedQuery(e.target.value)}
          type="text"
          className=" px-9 py-2 bg-white rounded-[6px] w- md:w-90"
          placeholder="Search Food (e.g Pizza ... )"
        />
        <img
          className="absolute top-3 left-2"
          src={assets.search_icon}
          alt=""
        />
      </div>

      <button
        onClick={() => navigate("/menu/search")}
        className="bg-amber-600 text-white text-sm py-2 rounded-sm px-3 cursor-pointer"
      >
        Find Food
      </button>
    </div>
  );
};

export default Search;
