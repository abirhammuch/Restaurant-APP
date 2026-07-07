

// components/RatingModal.jsx
import React, { useState, useContext } from 'react';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const RatingModal = ({ item, onClose, onSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('usertoken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/rating/add`,
        {
          foodId: item.foodId,
          orderId: item.orderId,
          rating,
          comment
        },
        {
          headers: {
            usertoken: getToken()
          }
        }
      );

      if (response.data.success) {
        toast.success('Thank you for your rating!');
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Rating error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Rate Your Order</h2>
        
        {/* Item Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
            onError={(e) => e.target.src = '/placeholder.png'}
          />
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-4xl focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                {star <= (hover || rating) ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mb-4">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Tap to rate'}
          </p>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this dish..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="3"
              maxLength="500"
            />
            <p className="text-xs text-gray-400 text-right">
              {comment.length}/500
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;