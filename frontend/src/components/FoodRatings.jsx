
// components/FoodRatings.jsx
import React, { useEffect, useState, useContext } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const FoodRatings = ({ foodId }) => {
  const { backendUrl } = useContext(AppContext);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRatings();
  }, [foodId, page]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/rating/food/${foodId}?page=${page}&limit=5`
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
        setStats(response.data.stats);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Fetch ratings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-gray-300 text-sm" />);
    }
    return stars;
  };

  if (loading) return <div className="text-center py-4">Loading reviews...</div>;

  return (
    <div className="mt-4">
      {/* Summary */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          {renderStars(stats.averageRating)}
        </div>
        <div>
          <span className="font-bold">{stats.averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({stats.totalReviews} reviews)</span>
        </div>
      </div>

      {/* Individual Ratings */}
      {ratings.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          {ratings.map((rating) => (
            <div key={rating._id} className="border-b py-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {renderStars(rating.rating)}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{rating.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                by {rating.userId?.name || 'Anonymous'}
              </p>
              {rating.adminResponse && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-bold text-gray-600">Admin Response:</p>
                  <p className="text-sm text-gray-600">{rating.adminResponse}</p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodRatings;