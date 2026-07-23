import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import { AppContext } from "../context/AppContext";

import Food from "./FoodCard";
import More from "./More";
import Less from "./Less";

const popularVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const Popular = () => {
  const { foods, popularFood, setPopularFood } = useContext(AppContext);

  const [more, setMore] = useState(false);
  const [slicedPopularFood, setSlicedPopularFood] = useState([]);

  useEffect(() => {
    setSlicedPopularFood(popularFood.slice(0, 4));
  }, [more, popularFood]);

  return (
    <motion.div
      className="mt-8 rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8"
      variants={popularVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        variants={headerVariants}
      >
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
      </motion.div>

      <Food food={more ? popularFood : slicedPopularFood} />
    </motion.div>
  );
};

export default Popular;
