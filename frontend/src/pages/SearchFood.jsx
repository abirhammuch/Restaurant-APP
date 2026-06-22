import React, { useContext } from "react";
import Food from "../components/FoodCard";
import { AppContext } from "../context/AppContext";

const SearchFood = () => {
  const { foods, navigate, setSearchedFood, searchedQuery, searchedFood } =
    useContext(AppContext);

  return (
    <div>
      <Food food={searchedFood} />
    </div>
  );
};

export default SearchFood;
