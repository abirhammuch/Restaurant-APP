import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";

const Search = () => {
  const {
    foods,
    navigate,
    setSearchedFood,
    searchedQuery,
    searchedFood,
    setSearchedQuery,
    getLocalizedFoodName,
    t,
  } = useContext(AppContext);

  useEffect(() => {
    if (searchedQuery.length > 0) {
      const query = searchedQuery.toLowerCase();
      setSearchedFood(
        foods.filter((food) =>
          getLocalizedFoodName(food)?.toLowerCase().includes(query),
        ),
      );
    } else {
      setSearchedFood(foods);
    }
  }, [foods, searchedQuery, getLocalizedFoodName, setSearchedFood]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center my-8 sm:my-12 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <input
          onChange={(e) => setSearchedQuery(e.target.value)}
          type="text"
          className="w-full px-9 py-3 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder={t("searchFoodPlaceholder")}
        />
        <img
          className="absolute top-3.5 left-3 h-4 w-4"
          src={assets.search_icon}
          alt=""
        />
      </div>

      <button
        onClick={() => navigate("/menu/search")}
        className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-3 rounded-md px-4 cursor-pointer transition-colors duration-300"
      >
        Find Food
      </button>
    </div>
  );
};

export default Search;
