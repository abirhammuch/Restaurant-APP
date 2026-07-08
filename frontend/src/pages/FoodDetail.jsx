import React, { useContext, useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets/assets";
import { FaArrowLeft, FaStar, FaRegStar } from "react-icons/fa";
import More from "../components/More";
import CustomerComent from "../components/CustomerComent";
import Less from "../components/Less";
import axios from "axios";
import { toast } from "react-toastify";

const FoodDetail = () => {
  const {
    foods,
    currency,
    navigate,
    foodDetail,
    setFoodDetail,
    popularFood,
    setPopularFood,
    addToCart,
    backendUrl
  } = useContext(AppContext);
  const { id, category } = useParams();

  const [thumbnel, setThumbnel] = useState("");
  const [perfectMatch, setPerfectMatch] = useState([]);
  const [more, setMore] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [toglePopular, setToglePopular] = useState(true);
  const [updatequantity, setUpdatequantity] = useState(1);
  const [currentFood, setCurrentFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getToken = () => localStorage.getItem("usertoken");

  // ✅ Fetch food detail when id changes
  useEffect(() => {
    if (foods && foods.length > 0 && id) {
      const food = foods.find((food) => food._id === id);
      if (food) {
        setCurrentFood(food);
        setFoodDetail([food]);
        setThumbnel(food.images?.[0] || food.image?.[0] || "");
        fetchRatings(food._id);
        checkUserRating(food._id);
      }
    }
    setLoading(false);
  }, [foods, id]);

  // ✅ Fetch ratings for this food
  const fetchRatings = async (foodId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/rating/food/${foodId}`);
      if (response.data.success) {
        setRatings(response.data.ratings || []);
        setRatingStats(response.data.stats || { averageRating: 0, totalReviews: 0 });
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // ✅ Check if user has already rated this food
  const checkUserRating = async (foodId) => {
    try {
      const ordersResponse = await axios.get(`${backendUrl}/api/order/my-orders`, {
        headers: { usertoken: getToken() }
      });
      
      if (ordersResponse.data.success) {
        const orders = ordersResponse.data.orders || [];
        const hasPurchased = orders.some(order => 
          order.orderStatus === 'delivered' && 
          order.items.some(item => item.foodId === foodId)
        );
        
        if (hasPurchased) {
          const ratingResponse = await axios.get(
            `${backendUrl}/api/rating/check?foodId=${foodId}&orderId=${orders.find(o => 
              o.orderStatus === 'delivered' && 
              o.items.some(i => i.foodId === foodId)
            )?._id}`,
            { headers: { usertoken: getToken() } }
          );
          
          if (ratingResponse.data.success && ratingResponse.data.isRated) {
            setUserRating(ratingResponse.data.rating);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  // ✅ Update perfect match when more changes
  useEffect(() => {
    if (foods && foods.length > 0 && category) {
      const filteredFoods = foods.filter(
        (food) => food.category === category
      );
      
      if (more) {
        setPerfectMatch(filteredFoods);
      } else {
        setPerfectMatch(filteredFoods.slice(0, 4));
      }
    }
  }, [more, foods, category]);

  // ✅ Handle add to cart
  const handleAddToCart = async (foodId) => {
    const result = await addToCart(foodId, updatequantity);
    if (result?.success) {
      setUpdatequantity(1);
    }
  };

  // ✅ Handle rating submit
  const handleRatingSubmit = async () => {
    if (ratingValue === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const ordersResponse = await axios.get(`${backendUrl}/api/order/my-orders`, {
        headers: { usertoken: getToken() }
      });

      if (!ordersResponse.data.success) {
        toast.error('Please login to rate');
        setSubmitting(false);
        return;
      }

      const orders = ordersResponse.data.orders || [];
      const deliveredOrder = orders.find(order => 
        order.orderStatus === 'delivered' && 
        order.items.some(item => item.foodId === id)
      );

      if (!deliveredOrder) {
        toast.error('You can only rate items you have purchased and received');
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/rating/add`,
        {
          foodId: id,
          orderId: deliveredOrder._id,
          rating: ratingValue,
          comment: commentText
        },
        {
          headers: { usertoken: getToken() }
        }
      );

      if (response.data.success) {
        toast.success('Thank you for your rating!');
        setShowRatingModal(false);
        setRatingValue(0);
        setCommentText('');
        fetchRatings(id);
        checkUserRating(id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Rating error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Render stars for display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 text-sm opacity-50" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-gray-300 text-sm" />);
    }
    return stars;
  };

  // ✅ Render rating stars for selection
  const renderRatingStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="text-3xl focus:outline-none transition-transform hover:scale-110"
        onClick={() => setRatingValue(star)}
        onMouseEnter={() => setHover(star)}
        onMouseLeave={() => setHover(0)}
      >
        {star <= (hover || ratingValue) ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!currentFood) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-gray-600">Food not found</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="mb-9">
      {/* Back Button */}
      <div
        onClick={() => navigate("/menu")}
        className="md:px-4 text-sm ml-9 mt-6 cursor-pointer text-amber-500 hover:text-amber-600 flex gap-3 items-center"
      >
        <FaArrowLeft />
        <p>Back to Menu</p>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-start ml-6 gap-3 mt-9">
        {/* Left - Images */}
        <div className="md:w-1/2">
          <div className="flex flex-col">
            <img
              src={thumbnel || currentFood.images?.[0] || assets.upload_area}
              alt={currentFood.name}
              className="w-full rounded-2xl max-h-[400px] object-cover"
              onError={(e) => {
                e.target.src = assets.upload_area;
              }}
            />
          </div>
          
          {/* Comments Section */}
          <div className="mt-6">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowComment((prev) => !prev)}
            >
              <h3 className="text-lg font-semibold">Reviews</h3>
              <span className="text-sm text-gray-500">
                ({ratingStats.totalReviews} reviews)
              </span>
              <span className="text-sm text-gray-400">
                {showComment ? '▲' : '▼'}
              </span>
            </div>

            {showComment && (
              <div className="mt-4 max-h-96 overflow-y-auto space-y-2 pr-2">
                {ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <CustomerComent
                      key={rating._id}
                      customername={rating.userId?.name || 'Anonymous'}
                      rating={rating.rating}
                      comment={rating.comment}
                      date={rating.createdAt}
                      adminResponse={rating.adminResponse} // ✅ Pass admin response
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right - Details */}
        <div className="md:w-1/2 px-4">
          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(ratingStats.averageRating || 0)}
            </div>
            <span className="text-sm font-semibold">
              {ratingStats.averageRating?.toFixed(1) || '0'}
            </span>
            <span className="text-sm text-gray-500">
              ({ratingStats.totalReviews || 0} reviews)
            </span>
          </div>

          {/* Rate Button */}
          {!userRating && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="mt-2 text-sm text-amber-500 hover:text-amber-600 underline"
            >
              Rate this item
            </button>
          )}
          {userRating && (
            <div className="mt-2 text-sm text-green-600">
              ✅ You rated this {userRating.rating} stars
            </div>
          )}

          <p className="text-2xl font-bold mt-2">{currentFood.name}</p>
          <p className="text-2xl text-amber-500 font-bold mt-1">
            {currency}{currentFood.price?.toFixed(2)}
          </p>

          <div className="mt-4">
            <p className="text-lg font-semibold">THE EXPERIENCE</p>
            <p className="text-sm pb-5 text-gray-700 mt-2">
              {currentFood.description}
            </p>

            <p className="text-md font-semibold">INGREDIENTS</p>
            <div className="flex flex-wrap gap-3 mt-3 mb-5">
              {currentFood.ingredients?.map((ing, index) => (
                <div
                  key={index}
                  className="border px-5 py-2 rounded-2xl border-gray-400 font-bold text-sm bg-amber-100"
                >
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="border px-5 py-5 bg-gray-100 border-gray-300 rounded-2xl mt-9">
            <div className="flex gap-4 justify-between items-center">
              <p className="text-md px-3">Select Quantity</p>
              <div className="flex gap-6 border px-4 py-1 rounded-2xl border-gray-500 items-center bg-white">
                <button
                  type="button"
                  className="font-bold text-lg cursor-pointer select-none hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setUpdatequantity((prev) => Math.max(1, prev - 1))}
                  disabled={updatequantity <= 1}
                >
                  -
                </button>

                <input
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (isNaN(value) || value < 1) {
                      setUpdatequantity(1);
                    } else {
                      setUpdatequantity(value);
                    }
                  }}
                  value={updatequantity}
                  type="number"
                  min={1}
                  className="font-bold text-md w-12 text-center border-none outline-none focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  className="font-bold text-lg cursor-pointer select-none hover:text-orange-500 transition-colors"
                  onClick={() => setUpdatequantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[3fr_1fr] rounded-2xl mt-5 gap-7 items-center">
              <button
                onClick={() => handleAddToCart(currentFood._id)}
                className="bg-amber-500 px-8 py-3 rounded-2xl text-white cursor-pointer hover:bg-amber-600 transition-colors"
              >
                Add to Order
              </button>
              <p className="flex justify-center border px-2 py-1 rounded-2xl border-gray-400 items-center cursor-pointer hover:bg-gray-200 transition-colors">
                Share
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <div className="md:px-10 px-2 border-t border-gray-400 mt-12">
        <div className="mt-9">
          <div className="flex gap-9 mb-9">
            <button
              onClick={() => setToglePopular(true)}
              className={`text-lg pb-4 cursor-pointer rounded-2xl px-3 py-1 flex justify-center items-center transition-colors ${
                toglePopular
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Popular Right Now
            </button>
            <button
              onClick={() => setToglePopular(false)}
              className={`text-lg pb-4 cursor-pointer rounded-2xl px-3 py-1 flex justify-center items-center transition-colors ${
                !toglePopular
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Perfect Match
            </button>
          </div>

          <div>
            {toglePopular ? (
              <div>
                <p className="text-2xl mb-3">Popular Right Now</p>
                <p className="text-sm text-gray-600">
                  Customers who ordered this also loved these items.
                </p>
                <div onClick={() => setMore((prev) => !prev)} className="cursor-pointer mt-3">
                  {more ? <Less text={"Less"} /> : <More text={"More"} />}
                </div>
                <div className="mt-4">
                  <FoodCard food={popularFood} />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-2xl mb-3">Perfect Match</p>
                <p className="text-sm text-gray-600">
                  Perfect match with your selection.
                </p>
                <div onClick={() => setMore((prev) => !prev)} className="cursor-pointer mt-3">
                  {more ? <Less text={"Less"} /> : <More text={"More"} />}
                </div>
                <div className="mt-4">
                  <FoodCard food={perfectMatch} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Rate This Item</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Item Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <img
                src={currentFood.images?.[0] || assets.upload_area}
                alt={currentFood.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div>
                <p className="font-bold">{currentFood.name}</p>
                <p className="text-sm text-gray-500">{currency}{currentFood.price}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-1 mb-2">
              {renderRatingStars()}
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">
              {ratingValue > 0 ? `${ratingValue} star${ratingValue > 1 ? 's' : ''}` : 'Tap to rate'}
            </p>

            {/* Comment */}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your experience with this dish..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm mb-4"
              rows="3"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={submitting || ratingValue === 0}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;