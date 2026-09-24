import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const KitchenReviews = () => {
  const { backendUrl, navigate } = useContext(AppContext);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/rating/kitchen/all`, {
        headers: { kitchentoken: localStorage.getItem("kitchentoken") },
      });
      if (response.data.success) setRatings(response.data.ratings || []);
      else toast.error(response.data.message || "Unable to load reviews");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load reviews");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const initialFetch = setTimeout(fetchRatings, 0);
    return () => clearTimeout(initialFetch);
  }, [fetchRatings]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 py-5 text-[#10233f] sm:px-6 lg:px-8 lg:py-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Customer Reviews</h1>
          <p className="mt-1 text-sm text-[#49617f]">
            Read the latest feedback about the food and service.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/kitchen")}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Orders
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white px-5 py-14 text-center text-sm text-gray-500">
          Loading reviews...
        </div>
      ) : ratings.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ratings.map((rating) => (
            <article
              key={rating._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-semibold">
                  {rating.userId?.name || "Customer"}
                </p>
                <div
                  className="flex items-center gap-1 text-amber-500"
                  aria-label={`${rating.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                      key={index}
                      className={index < rating.rating ? "" : "text-gray-200"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-gray-600">
                {rating.comment || "No written comment."}
              </p>
              <p className="mt-4 text-xs text-gray-400">
                {rating.foodId?.name || "Menu item"} ·{" "}
                {rating.createdAt
                  ? new Date(rating.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white px-5 py-14 text-center text-sm text-gray-500">
          No customer reviews yet.
        </div>
      )}
    </div>
  );
};

export default KitchenReviews;
