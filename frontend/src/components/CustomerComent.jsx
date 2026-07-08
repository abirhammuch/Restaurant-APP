// components/CustomerComent.jsx
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const CustomerComent = ({ customername, rating, comment, date, adminResponse }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center gap-2">
        <p className="font-bold text-sm">{customername || 'Anonymous'}</p>
        <div className="flex gap-0.5">
          {renderStars(rating || 0)}
        </div>
        <span className="text-xs text-gray-400 ml-2">
          {date && new Date(date).toLocaleDateString()}
        </span>
      </div>
      
      {comment && (
        <p className="text-sm text-gray-700 mt-1">{comment}</p>
      )}
      
      {/* ✅ Admin Response - Visible to everyone */}
      {adminResponse && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
            <span>👤</span> Admin Response:
          </p>
          <p className="text-sm text-gray-700 mt-1">{adminResponse}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerComent;