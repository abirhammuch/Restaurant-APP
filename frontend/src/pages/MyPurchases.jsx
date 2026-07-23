// pages/MyPurchases.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import RatingModal from "../components/RatingModal";

const MyPurchases = () => {
  const { backendUrl, getLocalizedFoodName } = useContext(AppContext);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const getToken = () => localStorage.getItem("usertoken");

  useEffect(() => {
    fetchPurchasedItems();
  }, []);

  const fetchPurchasedItems = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/rating/user/purchased`,
        {
          headers: { usertoken: getToken() },
        },
      );
      if (response.data.success) {
        setPurchasedItems(response.data.purchasedItems);
      }
    } catch (error) {
      console.error("Fetch purchased items error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (item) => {
    setSelectedItem(item);
    setShowRatingModal(true);
  };

  if (loading) {
    return <div className="text-center py-10">Loading your purchases...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Purchases</h1>

      {purchasedItems.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">
            You haven't purchased any items yet
          </p>
          <p className="text-sm text-gray-400">
            Order and try our delicious food!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {purchasedItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={getLocalizedFoodName(item)}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div>
                  <h3 className="font-bold">{getLocalizedFoodName(item)}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ordered: {new Date(item.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRate(item)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Rate & Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedItem && (
        <RatingModal
          item={selectedItem}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedItem(null);
            fetchPurchasedItems();
          }}
          onSuccess={() => {
            setShowRatingModal(false);
            setSelectedItem(null);
            fetchPurchasedItems();
          }}
        />
      )}
    </div>
  );
};

export default MyPurchases;
