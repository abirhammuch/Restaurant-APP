import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaPhone, FaSearch, FaSyncAlt } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";

const statuses = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "delivered",
  "cancelled",
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-emerald-100 text-emerald-800",
  delivering: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Deliveries = () => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const pageSize = 10;

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { serviceType: "delivery", page, limit: pageSize };
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();
      const response = await axios.get(`${backendUrl}/api/order/admin/all`, {
        headers: { admintoken: localStorage.getItem("admintoken") },
        params,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to load deliveries");
      }
      setOrders(response.data.orders || []);
      setPagination(
        response.data.pagination || { total: 0, page: 1, totalPages: 1 },
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Unable to load deliveries",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, page, search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchDeliveries, 0);
    return () => clearTimeout(timer);
  }, [fetchDeliveries]);

  const updateStatus = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/admin/status/${orderId}`,
        { status: nextStatus },
        { headers: { admintoken: localStorage.getItem("admintoken") } },
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to update delivery");
      }
      toast.success("Delivery status updated");
      await fetchDeliveries();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update delivery",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pageCounts = useMemo(
    () => ({
      active: orders.filter(
        (order) =>
          ["pending", "confirmed", "preparing", "ready", "delivering"].includes(
            order.orderStatus,
          ),
      ).length,
      delivering: orders.filter((order) => order.orderStatus === "delivering")
        .length,
      delivered: orders.filter((order) => order.orderStatus === "delivered")
        .length,
    }),
    [orders],
  );

  const changeStatusFilter = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="min-w-0 text-[#10233f]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Delivery Management
          </h1>
          <p className="mt-1 text-sm text-[#49617f]">
            Track delivery orders, contact customers, and update delivery
            progress.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchDeliveries}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">TOTAL MATCHING DELIVERIES</p>
          <p className="mt-1 text-2xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">ACTIVE ON THIS PAGE</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {pageCounts.active}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">OUT FOR DELIVERY ON THIS PAGE</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {pageCounts.delivering}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">DELIVERED ON THIS PAGE</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {pageCounts.delivered}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5">
          <label className="relative block w-full">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search order, customer, phone, or address..."
              className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => changeStatusFilter(filter)}
                className={`rounded-full px-3.5 py-2 text-xs font-medium capitalize transition ${
                  status === filter
                    ? "bg-orange-500 text-white"
                    : "bg-[#f2f4f7] text-[#304665] hover:bg-orange-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 border-collapse text-left text-sm">
            <thead className="bg-[#f4f5f7] text-xs font-bold text-[#10233f]">
              <tr>
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Delivery destination</th>
                <th className="px-4 py-4">Distance / fee</th>
                <th className="px-4 py-4">Placed</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const destination = order.deliveryAddress || {};
                const mapUrl =
                  Number.isFinite(Number(destination.latitude)) &&
                  Number.isFinite(Number(destination.longitude))
                    ? `https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=16/${destination.latitude}/${destination.longitude}`
                    : null;
                return (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 align-top hover:bg-orange-50/30"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">
                      #{order._id?.slice(-6)}
                      <p className="mt-1 text-xs font-normal text-gray-500">
                        ETB {Number(order.total || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="min-w-44 px-4 py-4">
                      <p className="font-medium">{destination.name || "N/A"}</p>
                      {destination.phone ? (
                        <a
                          href={`tel:${destination.phone}`}
                          className="mt-1 inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
                        >
                          <FaPhone /> {destination.phone}
                        </a>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">
                          No phone number
                        </p>
                      )}
                    </td>
                    <td className="min-w-64 px-4 py-4">
                      <p className="max-w-80 whitespace-normal">
                        {destination.address || "Address not provided"}
                      </p>
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                        >
                          <FaMapMarkerAlt /> Open map
                        </a>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <p>{Number(order.deliveryDistanceKm || 0).toFixed(1)} km</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Fee: ETB {Number(order.deliveryFee || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus || "pending"}
                        disabled={updatingId === order._id}
                        onChange={(event) =>
                          updateStatus(order._id, event.target.value)
                        }
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize outline-none disabled:opacity-60 ${
                          statusStyles[order.orderStatus] || statusStyles.pending
                        }`}
                      >
                        {statuses.slice(1).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="px-5 py-14 text-center text-sm text-gray-500">
              No delivery orders match these filters.
            </div>
          )}
          {loading && (
            <div className="px-5 py-14 text-center text-sm text-gray-500">
              Loading deliveries...
            </div>
          )}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} deliveries)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-md bg-orange-500 px-3 py-1.5 text-sm text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Deliveries;
