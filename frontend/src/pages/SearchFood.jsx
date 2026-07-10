import React, { useContext, useEffect } from "react";
import Food from "../components/FoodCard";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";

const SearchFood = () => {
  const {
    foods,
    setSearchedFood,
    searchedQuery,
    searchedFood,
    setSearchedQuery,
  } = useContext(AppContext);

  useEffect(() => {
    if (searchedQuery?.trim().length > 0) {
      const query = searchedQuery.trim().toLowerCase();
      setSearchedFood(
        foods.filter((food) => food.name?.toLowerCase().includes(query)),
      );
    } else {
      setSearchedFood(foods);
    }
  }, [foods, searchedQuery, setSearchedFood]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <input
            value={searchedQuery}
            onChange={(e) => setSearchedQuery(e.target.value)}
            type="text"
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-amber-500"
            placeholder="Search food, drinks, or snacks"
          />
          <img
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            src={assets.search_icon}
            alt="search"
          />
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {searchedQuery?.trim()
            ? `Showing ${searchedFood?.length || 0} result${(searchedFood?.length || 0) === 1 ? "" : "s"}`
            : "Type a dish name to search for food"}
        </p>
      </div>

      {searchedFood?.length > 0 ? (
        <div className="mt-6">
          <Food food={searchedFood} />
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 text-center text-gray-600">
          No food found for this search.
        </div>
      )}
    </div>
  );
};

export default SearchFood;
