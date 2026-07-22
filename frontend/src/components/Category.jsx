import { AppContext } from "../context/AppContext";
import Less from "./Less";
import More from "./More";
import Title from "./Title";

import React, { useContext, useState } from "react";

const Category = () => {
  const { allCategory = [], navigate, language } = useContext(AppContext);
  const [more, setMore] = useState(false);

  const handleCategoryClick = (category) => {
    const categorySlug = (category.name_en || category.name || category.name_am)
      .trim()
      .toLowerCase();
    const path = `/menu/${categorySlug}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryLabel = (category) =>
    language === "am"
      ? category.name_am || category.name_en || category.name
      : category.name_en || category.name;

  const getCategoryImage = (category) =>
    category?.image || category?.images?.[0] || "";
  const visibleCategories = more ? allCategory : allCategory.slice(0, 6);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Title text={"Explore Categories"} />
        {more ? (
          <Less text={"View Less"} onClick={() => setMore(false)} />
        ) : (
          <More text={"View More"} onClick={() => setMore(true)} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleCategories.map((category, index) => {
          const imageSrc = getCategoryImage(category);

          return (
            <div
              key={category?._id || category?.name || index}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex w-full items-center justify-center overflow-hidden rounded-xl bg-amber-50 p-2">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={getCategoryLabel(category)}
                      className="h-28 w-full rounded-lg object-cover transition duration-300 group-hover:scale-105 sm:h-32"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 text-lg font-semibold text-amber-700 sm:h-32">
                      {getCategoryLabel(category)?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {getCategoryLabel(category)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
