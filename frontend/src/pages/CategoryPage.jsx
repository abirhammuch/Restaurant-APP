import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import FoodCard from "../components/FoodCard";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { foods } = useContext(AppContext);
  const { category } = useParams();

  const [filterdCategory, setFilteredCategory] = useState([]);

  useEffect(() => {
    const filtered = foods.filter(
      (food) => food.category.toLowerCase() === category.toLowerCase(),
    );
    setFilteredCategory(filtered);
  }, [foods]);

  return (
    <div>
      <div>
        <FoodCard food={filterdCategory} />
      </div>
    </div>
  );
};

export default CategoryPage;
