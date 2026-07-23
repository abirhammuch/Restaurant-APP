import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import Less from "./Less";
import More from "./More";
import Title from "./Title";

import React, { useContext, useState } from "react";

const categoryListVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const categoryItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const Category = () => {
  const {
    allCategory = [],
    navigate,
    getLocalizedCategoryName,
  } = useContext(AppContext);
  const [more, setMore] = useState(false);

  const handleCategoryClick = (category) => {
    const categoryKey =
      category?.name_en || category?.name || category?.name_am || category?._id;
    const path = `/menu/${encodeURIComponent(
      categoryKey?.toString().trim().toLowerCase(),
    )}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryImage = (category) =>
    category?.image || category?.images?.[0] || "";
  const visibleCategories = more ? allCategory : allCategory.slice(0, 6);

  return (
    <motion.div
      className="px-4 py-8 sm:px-6 lg:px-20"
      variants={categoryListVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <Title text={"Explore Categories"} />
        {more ? (
          <Less text={"View Less"} onClick={() => setMore(false)} />
        ) : (
          <More text={"View More"} onClick={() => setMore(true)} />
        )}
      </div>

      <motion.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        variants={categoryListVariants}
      >
        {visibleCategories.map((category, index) => {
          const imageSrc = getCategoryImage(category);

          return (
            <motion.div
              key={category?._id || category?.name || index}
              onClick={() => handleCategoryClick(category)}
              variants={categoryItemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:shadow-lg"
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex w-full items-center justify-center overflow-hidden rounded-xl bg-amber-50 p-2">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={getLocalizedCategoryName(category)}
                      className="h-28 w-full rounded-lg object-cover transition duration-300 group-hover:scale-105 sm:h-32"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg bg-linear-to-br from-amber-100 to-orange-200 text-lg font-semibold text-amber-700 sm:h-32">
                      {getLocalizedCategoryName(category)
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {getLocalizedCategoryName(category)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Category;
