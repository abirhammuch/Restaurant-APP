import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaClock, FaFire, FaSyncAlt, FaUtensils } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import KitchenSidebar from "./KitchenSidebar";

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const statusClass = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-emerald-100 text-emerald-800",
  delivering: "bg-indigo-100 text-indigo-800",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

const KitchenDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/admin/all`, {
        params: { page: 1, limit: 100 },
        headers: { kitchentoken: localStorage.getItem("kitchentoken") },
      });
      if (response.data.success) setOrders(response.data.orders || []);
      else toast.error(response.data.message || "Unable to load dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const initialFetch = setTimeout(fetchOrders, 0);
    return () => clearTimeout(initialFetch);
  }, [fetchOrders]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.orderStatus === "pending").length,
      preparing: orders.filter((order) => order.orderStatus === "preparing")
        .length,
      ready: orders.filter((order) => order.orderStatus === "ready").length,
    }),
    [orders],
  );

  const popularFoods = useMemo(() => {
    const foodTotals = new Map();
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.name || "Unknown item";
        foodTotals.set(
          key,
          (foodTotals.get(key) || 0) + Number(item.quantity || 0),
        );
      });
    });
    return Array.from(foodTotals, ([name, quantity]) => ({ name, quantity }))
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#10233f]">
      <KitchenSidebar />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Kitchen Dashboard
            </h1>
            <p className="mt-1 text-sm text-[#49617f]">
              A quick view of today&apos;s paid orders and kitchen workload.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Paid Orders", stats.total, "text-[#10233f]"],
            ["Pending", stats.pending, "text-amber-600"],
            ["Preparing", stats.preparing, "text-purple-600"],
            ["Ready", stats.ready, "text-emerald-600"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FaFire className="text-orange-500" />
              <h2 className="text-lg font-bold">Most Ordered Food</h2>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">
                Loading food statistics...
              </p>
            ) : popularFoods.length ? (
              <div className="space-y-4">
                {popularFoods.map((food, index) => (
                  <div key={food.name} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {food.name}
                    </span>
                    <span className="text-sm font-bold text-gray-600">
                      {food.quantity} sold
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No paid food orders yet.</p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              <h2 className="text-lg font-bold">Recent Orders</h2>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading recent orders...</p>
            ) : recentOrders.length ? (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                      <FaUtensils />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        Order #{order._id?.slice(-6)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <FaClock /> {formatTime(order.createdAt)} ·{" "}
                        {order.items?.length || 0} food item(s)
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusClass[order.orderStatus] || statusClass.pending}`}
                    >
                      {order.orderStatus || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No paid orders yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default KitchenDashboard;
