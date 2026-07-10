// components/CustomerComent.jsx
import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const CustomerComent = ({
  customername,
  rating,
  comment,
  date,
  adminResponse,
}) => {
  const renderStars = (value) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < value) {
        stars.push(<FaStar key={i} className="text-amber-500 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-gray-800">
          {customername || "Anonymous"}
        </p>
        <div className="flex gap-0.5">{renderStars(rating || 0)}</div>
        <span className="ml-2 text-xs text-gray-400">
          {date && new Date(date).toLocaleDateString()}
        </span>
      </div>

      {comment && <p className="mt-2 text-sm text-gray-700">{comment}</p>}

      {adminResponse && (
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="flex items-center gap-1 text-xs font-bold text-blue-600">
            <span>👤</span> Admin Response:
          </p>
          <p className="mt-1 text-sm text-gray-700">{adminResponse}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerComent;
