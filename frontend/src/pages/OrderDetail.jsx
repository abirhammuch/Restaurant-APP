import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheck, FaStar, FaRegStar, FaEdit } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratedItems, setRatedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateRatingId, setUpdateRatingId] = useState(null);
  const [existingRatingData, setExistingRatingData] = useState(null);
  const { orderId } = useParams();
  const { currency, formatPrice, backendUrl, getLocalizedFoodName } =
    useContext(AppContext);

  const getToken = () => localStorage.getItem("usertoken");

  const userOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
        headers: {
          usertoken: getToken(),
        },
      });

      console.log("Order Detail Response:", response.data);

      if (response.data.success) {
        setOrderDetail(response.data.order);

        const status = response.data.order?.orderStatus;
        if (status === "delivered") {
          await checkRatedItems(response.data.order);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch order");
      }
    } catch (error) {
      console.log("Error fetching order:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check which items have been rated
  const checkRatedItems = async (order) => {
    try {
      const rated = [];

      for (const item of order.items) {
        try {
          const response = await axios.get(
            `${backendUrl}/api/rating/check?orderId=${order._id}&foodId=${item.foodId}`,
            {
              headers: { usertoken: getToken() },
            },
          );

          if (response.data.success && response.data.isRated) {
            rated.push(item.foodId.toString());
          }
        } catch (err) {
          console.log(`Error checking rating for item ${item.foodId}:`, err);
        }
      }

      setRatedItems(rated);
    } catch (error) {
      console.log("Check rated items error:", error);
    }
  };

  // ✅ Handle rate button click
  const handleRateClick = async (item) => {
    setSelectedItem(item);
    setIsUpdating(false);
    setUpdateRatingId(null);
    setExistingRatingData(null);
    setRating(0);
    setComment("");

    // Check if already rated
    const isRated = ratedItems.includes(item.foodId.toString());

    if (isRated) {
      try {
        // ✅ Fetch the existing rating
        const response = await axios.get(
          `${backendUrl}/api/rating/check?orderId=${orderId}&foodId=${item.foodId}`,
          {
            headers: { usertoken: getToken() },
          },
        );

        console.log("Existing rating response:", response.data.rating.rating);

        if (
          response.data.success &&
          response.data.isRated &&
          response.data.rating
        ) {
          const ratingData = response.data.rating;
          console.log("eeee");

          setRating(response.data.rating.rating || 0);
          setComment(ratingData.comment || "");
          setIsUpdating(true);
          setUpdateRatingId(ratingData._id);
          setExistingRatingData(ratingData);
          console.log("Loaded rating for update:", ratingData);
        }
      } catch (error) {
        console.log("Fetch rating error:", error);
        toast.error("Could not load existing rating");
      }
    }

    setShowRating(true);
  };
  console.log(rating);

  // ✅ Submit or Update Rating
  const handleSubmitRating = async (foodId, orderId) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      let response;

      if (isUpdating && updateRatingId) {
        // ✅ Update existing rating
        console.log("Updating rating:", updateRatingId, { rating, comment });

        response = await axios.put(
          `${backendUrl}/api/rating/${updateRatingId}`,
          {
            rating,
            comment,
          },
          {
            headers: {
              usertoken: getToken(),
            },
          },
        );

        console.log("Update response:", response.data);
      } else {
        // ✅ Add new rating
        console.log("Adding new rating:", { foodId, orderId, rating, comment });

        response = await axios.post(
          `${backendUrl}/api/rating/add`,
          {
            foodId,
            orderId,
            rating,
            comment,
          },
          {
            headers: {
              usertoken: getToken(),
            },
          },
        );

        console.log("Add response:", response.data);
      }

      if (response.data.success) {
        toast.success(
          isUpdating
            ? "Rating updated successfully!"
            : "Thank you for your rating!",
        );

        // Reset form
        setRating(0);
        setComment("");
        setShowRating(false);
        setSelectedItem(null);
        setIsUpdating(false);
        setUpdateRatingId(null);
        setExistingRatingData(null);

        // Refresh order detail
        await userOrderDetail(orderId);
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating error:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Cancel rating
  const cancelRating = () => {
    setShowRating(false);
    setSelectedItem(null);
    setRating(0);
    setComment("");
    setIsUpdating(false);
    setUpdateRatingId(null);
    setExistingRatingData(null);
  };

  useEffect(() => {
    if (orderId) {
      userOrderDetail(orderId);
    }
  }, [orderId]);

  const orderStatus = orderDetail?.orderStatus || "pending";

  const getFormattedTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStep = () => {
    const statuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivering",
      "delivered",
    ];
    const currentIndex = statuses.indexOf(orderStatus);
    return currentIndex === -1 ? 0 : currentIndex;
  };

  const isStepCompleted = (stepIndex) => {
    return getStatusStep() >= stepIndex;
  };

  const isStepActive = (stepIndex) => {
    return getStatusStep() === stepIndex;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">Order Not Found</p>
          <p className="text-gray-500 mt-2">
            The order you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      label: "Order Received",
      description:
        "We have successfully received your order and sent it to the kitchen team.",
    },
    {
      label: "Order Confirmed",
      description:
        "Our chefs have acknowledged your order and are gathering the finest ingredients.",
    },
    {
      label: "Preparing Your Food",
      description:
        "The kitchen is buzzing! Our head chef is meticulously crafting your meal right now.",
    },
    {
      label: "Ready for Pickup",
      description:
        "Once finalized we will notify you that your order is ready for the courier.",
    },
    {
      label: "Out for Delivery",
      description:
        "Our courier will safely deliver your warm meal to your table.",
    },
    {
      label: "Delivered",
      description: "Your order has been delivered. Enjoy your meal!",
    },
  ];

  const getStatusColor = (stepIndex) => {
    if (isStepCompleted(stepIndex)) {
      return "bg-amber-600 text-white";
    } else if (isStepActive(stepIndex)) {
      return "bg-amber-400 text-white animate-pulse";
    }
    return "bg-gray-200 text-gray-400";
  };

  const isDelivered = orderStatus === "delivered";

  // ✅ Render stars
  const renderStars = (value) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="text-2xl focus:outline-none transition-transform hover:scale-110"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHover(star)}
        onMouseLeave={() => setHover(0)}
      >
        {star <= (hover || value) ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </button>
    ));
  };

  return (
    <div className="mt-14">
      {/* Header */}
      <div className="lg:mx-80 shadow-2xl rounded-2xl px-6 py-8">
        <div className="lg:flex justify-around items-center">
          <div className="mb-5 lg:mb-0">
            <div className="border border-amber-400 rounded-2xl inline-block">
              <p className="px-3 py-2 text-amber-700 bg-amber-50 rounded-2xl font-bold">
                LIVE TRACKING
              </p>
            </div>
            <p className="font-bold text-2xl mt-3 mb-2">Order ID: {orderId}</p>
            <p className="text-sm">
              Placed at {getFormattedTime(orderDetail.createdAt)}
            </p>
          </div>

          <div className="border px-9 py-4 rounded-2xl border-gray-300 text-center">
            <p className="text-md font-bold">ESTIMATED ARRIVAL</p>
            <p className="font-bold text-2xl text-amber-600">18 - 24 min</p>
          </div>
        </div>

        <div className="flex justify-around mt-6">
          <div>
            <p className="font-bold">
              Currently:{" "}
              <span className="text-amber-600 capitalize">
                {isDelivered ? "Delivered 🎉" : orderStatus}
              </span>
            </p>
          </div>
          <div>
            <p>
              {Math.round((getStatusStep() / (steps.length - 1)) * 100)}%
              complete
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:grid lg:grid-cols-[2fr_1fr] shadow m-9 gap-8 p-6">
        {/* Left Column - Order Journey */}
        <div className="mx-8">
          <div className="flex items-center mt-4 mb-6">
            <p className="font-bold text-2xl w-full">Order Journey</p>
          </div>

          {steps.map((step, index) => {
            const completed = isStepCompleted(index);
            const active = isStepActive(index);
            const statusColor = getStatusColor(index);

            return (
              <div key={index} className="flex gap-6 mt-8">
                <div
                  className={`px-3 h-10 flex items-center rounded-full ${statusColor}`}
                >
                  <FaCheck
                    className={
                      completed || active ? "text-white" : "text-gray-400"
                    }
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <p
                      className={`font-bold ${active ? "text-amber-600" : completed ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    {completed && (
                      <p className="text-sm font-bold text-green-600">
                        {getFormattedTime(orderDetail.updatedAt)}
                      </p>
                    )}
                    {active && (
                      <p className="text-sm font-bold text-amber-600">
                        In Progress
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-sm ${completed ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* ✅ Rate Now Section - Shows when delivered */}
          {isDelivered && (
            <div className="mt-8 w-full">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-bold text-lg text-amber-800">
                  🍽️ Rate Your Order
                </h3>
              </div>

              {orderDetail.items?.map((item, index) => {
                const isRated = ratedItems.includes(item.foodId.toString());

                return (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={getLocalizedFoodName(item)}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/64?text=No+Image")
                        }
                      />
                      <div>
                        <p className="font-bold">
                          {getLocalizedFoodName(item)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        {isRated && (
                          <span className="text-xs text-green-600 font-medium">
                            ✅ Rated
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRateClick(item)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        isRated
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      {isRated ? <FaEdit /> : <FaStar />}
                      {isRated ? "Update Rating" : "Rate Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Order Summary & Help */}
        <div>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

            {orderDetail.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span>{getLocalizedFoodName(item)}</span>
                  <span className="text-gray-500">x{item.quantity}</span>
                </div>
                <span>{formatPrice(item.totalPrice)}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderDetail.subtotal)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Delivery Fee</span>
                <span>{formatPrice(orderDetail.deliveryFee)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Tax</span>
                <span>{formatPrice(orderDetail.tax)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-300 font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-600">
                  {formatPrice(orderDetail.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-orange-100 rounded-2xl p-6">
            <p className="font-bold text-red-950 mb-2">
              Need help with your order?
            </p>
            <p className="text-sm">
              Our supporter team is available 24/7 if you have any questions or
              need to modify your instructions.
            </p>

            <div className="flex justify-center mt-4">
              <div className="flex gap-3 bg-amber-600 rounded-2xl text-white items-center px-9 py-2 hover:bg-amber-700 cursor-pointer transition-colors">
                <FaPhone />
                <p>Call Us</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {orderDetail.paymentMethod || "Cash"}
            </p>
            <p>
              <span className="font-semibold">Table Number:</span>{" "}
              {orderDetail.table || "N/A"}
            </p>
            {orderDetail.note && (
              <p>
                <span className="font-semibold">Special Instructions:</span>{" "}
                {orderDetail.note}
              </p>
            )}
          </div>

          {/* ✅ Rating Status */}
          {isDelivered && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                🎉 Order delivered! Rate your items above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Rating Modal */}
      {showRating && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 left-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {isUpdating ? "Update Rating" : "Rate Your Item"}
              </h3>
              <button
                onClick={cancelRating}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Item Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <img
                src={selectedItem.image}
                alt={getLocalizedFoodName(selectedItem)}
                className="w-14 h-14 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/56?text=No+Image")
                }
              />
              <div>
                <p className="font-bold">
                  {getLocalizedFoodName(selectedItem)}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {selectedItem.quantity}
                </p>
                {isUpdating && (
                  <p className="text-xs text-blue-600 font-medium">
                    Editing your rating
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(rating)}
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">
              {rating > 0
                ? `${rating} star${rating > 1 ? "s" : ""}`
                : "Tap to rate"}
            </p>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm mb-4"
              rows="3"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelRating}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleSubmitRating(selectedItem.foodId, orderDetail._id)
                }
                disabled={submitting || rating === 0}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
                  isUpdating
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {submitting
                  ? "Saving..."
                  : isUpdating
                    ? "Update Rating"
                    : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
