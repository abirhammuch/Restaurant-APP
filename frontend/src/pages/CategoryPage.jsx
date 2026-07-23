import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import FoodCard from "../components/FoodCard";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { foods, doesFoodBelongToCategory } = useContext(AppContext);
  const { category } = useParams();

  const [filterdCategory, setFilteredCategory] = useState([]);

  useEffect(() => {
    const filtered = foods.filter((food) =>
      doesFoodBelongToCategory(food, category),
    );
    setFilteredCategory(filtered);
  }, [foods, category, doesFoodBelongToCategory]);

  return (
    <div>
      <div>
        <FoodCard food={filterdCategory} />
      </div>
    </div>
  );
};

export default CategoryPage;
