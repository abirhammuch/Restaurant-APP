import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaClock,
  FaInfoCircle,
  FaMugHot,
  FaUtensils,
} from "react-icons/fa";
import { MdOutlineRestaurant, MdRefresh } from "react-icons/md";
import { AppContext } from "../../context/AppContext";

const statusColumns = [
  { key: "active", label: "Active Orders", color: "bg-orange-500" },
  { key: "preparing", label: "Preparing", color: "bg-amber-500" },
  { key: "ready", label: "Ready for Pickup", color: "bg-emerald-500" },
  { key: "completed", label: "Completed", color: "bg-slate-500" },
];

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const getColumn = (status) => {
  if (["delivered", "cancelled"].includes(status)) return "completed";
  if (status === "ready") return "ready";
  if (["preparing", "confirmed"].includes(status)) return "preparing";
  return "active";
};

const Kitchen = () => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/admin/all`, {
        headers: { kitchentoken: localStorage.getItem("kitchentoken") },
      });
      if (response.data.success) setOrders(response.data.orders || []);
      else toast.error(response.data.message || "Unable to load orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const initialFetch = setTimeout(fetchOrders, 0);
    return () => clearTimeout(initialFetch);
  }, [fetchOrders]);

  const groupedOrders = useMemo(
    () =>
      statusColumns.reduce((groups, column) => {
        groups[column.key] = orders.filter(
          (order) => getColumn(order.orderStatus) === column.key,
        );
        return groups;
      }, {}),
    [orders],
  );

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `${backendUrl}/api/order/admin/status/${orderId}`,
        { status },
        { headers: { kitchentoken: localStorage.getItem("kitchentoken") } },
      );
      await fetchOrders();
      toast.success(`Order marked ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextAction = (order) => {
    if (["pending", "confirmed"].includes(order.orderStatus)) {
      return { label: "Start Preparing", status: "preparing" };
    }
    if (order.orderStatus === "preparing") {
      return { label: "Mark as Ready", status: "ready" };
    }
    if (order.orderStatus === "ready") {
      return { label: "Complete Order", status: "delivered" };
    }
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-150px)] bg-[#f8f6f2] -m-4 p-4 sm:-m-6 sm:p-6 lg:-m-9 lg:p-8">
      <div className="mx-auto max-w-375">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[#3d2418] px-5 py-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-orange-500/20 p-3 text-orange-200">
              <FaUtensils className="text-3xl" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">Kitchen</p>
              <p className="text-sm text-orange-100">
                Keep every order moving.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 sm:justify-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-200">
                Kitchen status
              </p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Open
              </p>
            </div>
            <button
              type="button"
              onClick={fetchOrders}
              className="rounded-lg p-2 text-orange-100 transition hover:bg-white/10 disabled:opacity-50"
              aria-label="Refresh kitchen orders"
              disabled={loading}
            >
              <MdRefresh
                className={loading ? "animate-spin text-xl" : "text-xl"}
              />
            </button>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {statusColumns.map((column) => (
            <div
              key={column.key}
              className="flex min-w-max items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
              {column.label}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {groupedOrders[column.key]?.length || 0}
              </span>
            </div>
          ))}
        </div>

        {loading && !orders.length ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-gray-500">
            Loading kitchen orders...
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-4">
            {statusColumns.map((column) => (
              <section key={column.key} className="min-w-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="font-bold text-gray-800">{column.label}</h2>
                  <span className="text-sm text-gray-500">
                    {groupedOrders[column.key]?.length || 0}
                  </span>
                </div>
                <div className="space-y-4">
                  {groupedOrders[column.key]?.map((order) => {
                    const action = getNextAction(order);
                    return (
                      <article
                        key={order._id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className={`h-1 ${column.color}`} />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-gray-900">
                                Order #{order._id?.slice(-4).toUpperCase()}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <FaClock /> {formatTime(order.createdAt)}
                              </p>
                            </div>
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                              {order.table
                                ? `Table ${order.table}`
                                : "Take Away"}
                            </span>
                          </div>

                          <div className="my-4 space-y-3">
                            {order.items?.map((item) => (
                              <div
                                key={`${order._id}-${item.foodId || item.name}`}
                                className="flex items-center gap-3"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                                    <MdOutlineRestaurant />
                                  </div>
                                )}
                                <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                                  {item.name}
                                </p>
                                <span className="text-sm font-bold text-gray-800">
                                  x {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mb-3 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                            <FaInfoCircle className="mt-0.5 shrink-0" />
                            <span>{order.note || "No special requests"}</span>
                          </div>

                          {action && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(order._id, action.status)
                              }
                              disabled={updatingId === order._id}
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
                            >
                              {action.status === "delivered" ? (
                                <FaCheck />
                              ) : (
                                <FaMugHot />
                              )}
                              {updatingId === order._id
                                ? "Updating..."
                                : action.label}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                  {!groupedOrders[column.key]?.length && (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-400">
                      No orders here
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
