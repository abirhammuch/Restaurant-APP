import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";
import axios from "axios";

const FoodCard = ({ food }) => {
  const [ratings, setRatings] = useState({});
  const {
    formatPrice,
    navigate,
    setFoodDetail,
    addToCart,
    backendUrl,
    language,
    getLocalizedFoodName,
    getLocalizedFoodDescription,
    getLocalizedCategoryLabel,
    getCategoryByKey,
  } = useContext(AppContext);

  //  Fetch rating for a single food
  const fetchRating = async (foodId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/rating/food/${foodId}`,
      );
      if (response.data.success) {
        return response.data.stats?.averageRating || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching rating:", error);
      return 0;
    }
  };

  // ✅ Fetch ratings for all foods
  const fetchAllRatings = async () => {
    if (!food || food.length === 0) return;

    const ratingPromises = food.map(async (item) => {
      const avgRating = await fetchRating(item._id);
      return { [item._id]: avgRating };
    });

    const results = await Promise.all(ratingPromises);
    const ratingMap = Object.assign({}, ...results);
    setRatings(ratingMap);
  };

  // ✅ Fetch ratings when food changes
  useEffect(() => {
    fetchAllRatings();
  }, [food]);

  // ✅ Navigate to food detail - FIXED
  const foodDetail = (item) => {
    const categoryObj = getCategoryByKey(item.category);
    const categoryPath = categoryObj
      ? categoryObj.name_en ||
        categoryObj.name ||
        categoryObj.name_am ||
        categoryObj._id
      : item.category;

    setFoodDetail(item);

    const path = `/menu/${encodeURIComponent(
      categoryPath?.toString().trim().toLowerCase(),
    )}/${item._id}`;
    navigate(path);
  };

  // ✅ Handle add to cart with stop propagation
  const handleAddToCart = (itemId, e) => {
    e.stopPropagation();
    addToCart(itemId);
  };

  // ✅ Render stars based on rating
  const renderStars = (rating) => {
    if (!rating || rating === 0)
      return <span className="text-gray-400">No ratings</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("⭐");
    }
    while (stars.length < 5) {
      stars.push("☆");
    }
    return stars.join(" ");
  };

  return (
    <div className="grid grid-cols-1 gap-5 px-2 py-4 sm:grid-cols-2 sm:px-4 sm:py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {food && food.length > 0 ? (
        food.map((item, index) => {
          const avgRating = ratings[item._id] || item.averageRating || 0;

          return (
            <div
              key={index}
              className="attract-card relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)] cursor-pointer"
              onClick={() => foodDetail(item)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-52">
                <img
                  src={
                    item.images?.[0] || item.image?.[0] || assets.upload_area
                  }
                  alt={getLocalizedFoodName(item) || "Food"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = assets.upload_area;
                  }}
                />

                {/* Category Badge */}
                <p className="absolute top-3 left-3 bg-white px-3 py-1 rounded-2xl text-xs font-medium shadow-md">
                  {getLocalizedCategoryLabel(item.category) || "Uncategorized"}
                </p>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-amber-500 px-3 py-1 rounded-2xl text-white text-xs font-medium shadow-md flex items-center gap-1">
                  <span>{avgRating > 0 ? avgRating.toFixed(1) : "0"}</span>
                  <span>★</span>
                </div>

                {/* Popular Badge */}
                {item.popular && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-2xl text-xs font-medium">
                    🔥 Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
                <div className="space-y-1">
                  <p className="truncate text-lg font-bold text-slate-800">
                    {getLocalizedFoodName(item)}
                  </p>
                  <p className="line-clamp-2 flex-1 text-sm leading-6 text-gray-600">
                    {getLocalizedFoodDescription(item) ||
                      "No description available"}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <p className="text-lg font-bold text-amber-500">
                    {formatPrice(item.price || 0)}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(item._id, e)}
                    className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">
          No food items available
        </div>
      )}
    </div>
  );
};

export default FoodCard;
