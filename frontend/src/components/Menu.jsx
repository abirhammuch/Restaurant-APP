import React, { useContext } from "react";
import Food from "./FoodCard";
import { AppContext } from "../context/AppContext";
import Search from "./Search";

const Menu = () => {
  const { foods, showSearch } = useContext(AppContext);

  console.log(foods);
  return (
    <div>
      <Food food={foods} />
    </div>
  );
};

export default Menu;
