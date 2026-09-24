import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaDownload, FaSearch, FaSyncAlt } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import KitchenSidebar from "./KitchenSidebar";

const statusFilters = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "delivered",
  "cancelled",
];

const statusClasses = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-purple-100 text-purple-800 border-purple-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  delivering: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "--";

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

const formatAmount = (amount) => `ETB ${Number(amount || 0).toFixed(2)}`;

const Kitchen = () => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const pageSize = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: pageSize };
      if (filterStatus !== "all") params.status = filterStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const response = await axios.get(`${backendUrl}/api/order/admin/all`, {
        headers: { kitchentoken: localStorage.getItem("kitchentoken") },
        params,
      });
      if (response.data.success) {
        setOrders(response.data.orders || []);
        setPagination(
          response.data.pagination || {
            total: 0,
            page: 1,
            limit: pageSize,
            totalPages: 1,
          },
        );
      } else toast.error(response.data.message || "Unable to load orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filterStatus, page, searchQuery]);

  useEffect(() => {
    const initialFetch = setTimeout(fetchOrders, 0);
    return () => clearTimeout(initialFetch);
  }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `${backendUrl}/api/order/admin/status/${orderId}`,
        { status },
        { headers: { kitchentoken: localStorage.getItem("kitchentoken") } },
      );
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order,
        ),
      );
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders;
  }, [orders]);

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

  const exportOrders = () => {
    const rows = filteredOrders.map((order) =>
      [
        order._id,
        order.deliveryAddress?.name || "N/A",
        order.table || "Take Away",
        formatAmount(order.total),
        order.orderStatus,
        order.paymentStatus || "pending",
      ].join(","),
    );
    const csv = ["Order ID,Customer,Table,Total,Status,Payment", ...rows].join(
      "\n",
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kitchen-orders.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const changeFilter = (status) => {
    setFilterStatus(status);
    setPage(1);
  };

  const changeSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#10233f]">
      <KitchenSidebar />

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-[#49617f]">
              Manage, monitor, and update live orders from the kitchen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={exportOrders}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <FaDownload /> Export
            </button>
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-300 bg-white px-5 py-5 text-center shadow-[0_10px_18px_rgba(20,35,55,0.08)]">
            <p className="text-sm">TOTAL ORDERS</p>
            <p className="mt-1 text-2xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white px-5 py-5 text-center shadow-[0_10px_18px_rgba(20,35,55,0.08)]">
            <p className="text-sm">PENDING</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white px-5 py-5 text-center shadow-[0_10px_18px_rgba(20,35,55,0.08)]">
            <p className="text-sm">PREPARING</p>
            <p className="mt-1 text-2xl font-bold text-purple-600">
              {stats.preparing}
            </p>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white px-5 py-5 text-center shadow-[0_10px_18px_rgba(20,35,55,0.08)]">
            <p className="text-sm">READY</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {stats.ready}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block w-full max-w-142.5">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search by Order ID or Customer Name..."
                className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => changeFilter(status)}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium capitalize transition ${filterStatus === status ? "bg-orange-500 text-white" : "bg-[#f2f4f7] text-[#304665] hover:bg-orange-100"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-232.5 border-collapse text-left text-sm">
              <thead className="bg-[#f4f5f7] text-xs font-bold text-[#10233f]">
                <tr>
                  <th className="px-4 py-4">Order ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Table</th>
                  <th className="px-4 py-4">Food</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4">Time</th>
                  <th className="px-4 py-4">Order Status</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Special Request</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-orange-50/30"
                  >
                    <td className="px-4 py-4 font-medium text-[#1b2d47]">
                      {order._id?.slice(-6)}
                    </td>
                    <td className="px-4 py-4">
                      {order.deliveryAddress?.name || "N/A"}
                    </td>
                    <td className="px-4 py-4">{order.table || "Take Away"}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="space-y-1">
                        {order.items?.length ? (
                          order.items.map((item) => (
                            <p key={`${order._id}-${item.foodId || item.name}`}>
                              {item.name}
                            </p>
                          ))
                        ) : (
                          <span className="text-gray-400">No items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      <div className="space-y-1">
                        {order.items?.length ? (
                          order.items.map((item) => (
                            <p
                              key={`${order._id}-quantity-${item.foodId || item.name}`}
                            >
                              × {item.quantity}
                            </p>
                          ))
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p>{formatTime(order.createdAt)}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus || "pending"}
                        disabled={updatingId === order._id}
                        onChange={(event) =>
                          updateStatus(order._id, event.target.value)
                        }
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize outline-none ${statusClasses[order.orderStatus] || statusClasses.pending}`}
                      >
                        {statusFilters.slice(1).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex min-w-26.25 justify-center rounded-full px-3 py-1.5 text-xs font-medium ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {order.paymentStatus || "pending"}
                      </span>
                    </td>
                    <td className="max-w-56 px-4 py-4 text-xs text-gray-500">
                      {order.note || "No order notes"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !filteredOrders.length && (
              <div className="px-5 py-14 text-center text-sm text-gray-500">
                No orders match your filters.
              </div>
            )}
            {loading && (
              <div className="px-5 py-14 text-center text-sm text-gray-500">
                Loading orders...
              </div>
            )}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
                <p className="text-sm text-gray-500">
                  Showing page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} paid orders)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="rounded-md bg-orange-500 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kitchen;
