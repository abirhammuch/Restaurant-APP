import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { AppContext } from "../context/AppContext";

import Food from "./FoodCard";
import More from "./More";
import Less from "./Less";

const Popular = () => {
  const { foods, popularFood, setPopularFood } = useContext(AppContext);

  const [more, setMore] = useState(false);
  const [slicedPopularFood, setSlicedPopularFood] = useState([]);

  useEffect(() => {
    setSlicedPopularFood(popularFood.slice(0, 4));
  }, [more, popularFood]);

  return (
    <div className="mt-8 rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Title text="Popular Right Now" />
          <p className="mt-2 text-center text-sm text-gray-600 sm:text-left">
            Discover the dishes that are winning hearts across the city today.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMore((prev) => !prev)}
            className="rounded-full border border-amber-200 bg-white px-3 py-2 shadow-sm transition hover:border-amber-400 hover:bg-amber-50"
          >
            {more ? <Less text="Less" /> : <More text="More" />}
          </button>
        </div>
      </div>

      <Food food={more ? popularFood : slicedPopularFood} animateCards={true} />
    </div>
  );
};

export default Popular;
