import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaBell,
  FaCheck,
  FaClock,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaStore,
  FaUtensils,
} from "react-icons/fa";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdTableRestaurant,
} from "react-icons/md";
import { AppContext } from "../../context/AppContext";
import kitchenBanner from "../../assets/assets/desktop_banner.png";

const columns = [
  {
    key: "active",
    label: "Active Orders",
    dot: "bg-orange-500",
    icon: <FaUtensils />,
  },
  {
    key: "preparing",
    label: "Preparing",
    dot: "bg-amber-400",
    icon: <FaClock />,
  },
  {
    key: "ready",
    label: "Ready for Pickup",
    dot: "bg-green-500",
    icon: <FaCheck />,
  },
  {
    key: "completed",
    label: "Completed",
    dot: "bg-slate-400",
    icon: <FaCheck />,
  },
];

const getColumn = (status) => {
  if (["delivered", "cancelled"].includes(status)) return "completed";
  if (status === "ready") return "ready";
  if (["preparing", "confirmed"].includes(status)) return "preparing";
  return "active";
};

const time = (date) =>
  date
    ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const Kitchen = () => {
  const { backendUrl, navigate } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [query, setQuery] = useState("");

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

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return orders;
    return orders.filter((order) =>
      [order._id, order.table, order.deliveryAddress?.name]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(normalized)),
    );
  }, [orders, query]);

  const grouped = useMemo(
    () =>
      columns.reduce((result, column) => {
        result[column.key] = visibleOrders.filter(
          (order) => getColumn(order.orderStatus) === column.key,
        );
        return result;
      }, {}),
    [visibleOrders],
  );

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `${backendUrl}/api/order/admin/status/${orderId}`,
        { status },
        {
          headers: { kitchentoken: localStorage.getItem("kitchentoken") },
        },
      );
      await fetchOrders();
      toast.success(`Order marked ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const nextAction = (order) => {
    if (["pending", "confirmed"].includes(order.orderStatus))
      return ["Start Preparing", "preparing"];
    if (order.orderStatus === "preparing") return ["Mark as Ready", "ready"];
    if (order.orderStatus === "ready") return ["Complete Order", "delivered"];
    return null;
  };

  const logout = () => {
    localStorage.removeItem("kitchentoken");
    navigate("/kitchen/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f5f2] text-[#27221f]">
      <aside className="hidden w-[195px] shrink-0 flex-col justify-between bg-[#17130f] px-4 py-7 text-white lg:flex">
        <div>
          <div className="mb-12 flex items-center gap-2 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e87a22] text-xl">
              <FaStore />
            </div>
            <div>
              <p className="font-bold tracking-wide">Tana Cafe</p>
              <p className="text-[9px] text-gray-400">
                Good Food · Better Mood
              </p>
            </div>
          </div>
          <nav className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3 rounded-lg px-3 py-3">
              <FaHome /> Dashboard
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-3">
              <MdDashboard /> Orders
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-[#9d4e1e] px-3 py-3 font-semibold text-white">
              <FaUtensils /> Kitchen
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-3">
              <MdRestaurantMenu /> Menu
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-3">
              <MdTableRestaurant /> Tables
            </div>
          </nav>
        </div>
        <div className="px-3 text-center font-serif italic text-[#c87839]">
          Great Food
          <br />
          Great Vibes
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex min-h-[58px] items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-7">
          <label className="relative max-w-[355px] flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders, customer name or table..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-400"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-600 hover:bg-orange-50"
              aria-label="Notifications"
            >
              <FaBell />
              <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a35b2a] text-white">
                <FaUtensils />
              </div>
              <div className="text-xs">
                <p className="font-bold">Kitchen Staff</p>
                <p className="text-gray-400">Kitchen</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Sign out"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <div
          className="relative h-[116px] overflow-hidden bg-[#49210c] bg-cover bg-center px-5 py-5 text-white sm:px-8"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(48,22,10,.92), rgba(48,22,10,.35)), url(${kitchenBanner})`,
          }}
        >
          <div className="relative z-10 flex h-full items-center gap-4">
            <FaUtensils className="text-4xl text-[#f2cfaa]" />
            <div>
              <h1 className="font-serif text-3xl font-bold">Kitchen</h1>
              <p className="text-sm text-orange-100">
                Prepare great food, keep the orders moving!
              </p>
            </div>
          </div>
          <div className="absolute right-5 top-4 hidden rounded-lg border border-white/20 bg-black/20 px-5 py-3 text-xs sm:block">
            <p className="mb-1 text-orange-100">Kitchen status</p>
            <p className="font-semibold text-white">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />
              Kitchen Open
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-7">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {columns.map((column) => (
              <div
                key={column.key}
                className={`flex min-w-max items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${column.key === "active" ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-700"}`}
              >
                <span className="text-xs">{column.icon}</span>
                {column.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${column.key === "active" ? "bg-white/20" : "bg-gray-100"}`}
                >
                  {grouped[column.key]?.length || 0}
                </span>
              </div>
            ))}
          </div>

          {loading && !orders.length ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-white text-sm text-gray-500">
              Loading kitchen orders...
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-3 2xl:grid-cols-4">
              {columns.map((column) => (
                <section key={column.key} className="min-w-0">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${column.dot}`}
                    />
                    <h2 className="text-sm font-bold">{column.label}</h2>
                    <span className="text-xs text-gray-400">
                      {grouped[column.key]?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {grouped[column.key]?.map((order) => {
                      const action = nextAction(order);
                      return (
                        <article
                          key={order._id}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                              <p className="text-sm font-bold">
                                Order #{order._id?.slice(-4).toUpperCase()}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                                <FaClock /> {time(order.createdAt)}
                              </p>
                            </div>
                            <span className="rounded bg-[#edf3ee] px-2 py-1 text-[11px] font-semibold text-gray-600">
                              {order.table
                                ? `Table ${order.table}`
                                : "Take Away"}
                            </span>
                          </div>
                          <div className="space-y-3 py-3">
                            {order.items?.map((item) => (
                              <div
                                key={`${order._id}-${item.foodId || item.name}`}
                                className="flex items-center gap-3"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-9 w-9 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50 text-orange-500">
                                    <FaUtensils />
                                  </div>
                                )}
                                <span className="min-w-0 flex-1 truncate text-xs">
                                  {item.name}
                                </span>
                                <b className="text-xs">× {item.quantity}</b>
                              </div>
                            ))}
                          </div>
                          <div className="mb-3 rounded bg-[#f2f8fd] px-3 py-2 text-[11px] text-blue-600">
                            ⓘ {order.note || "No special requests"}
                          </div>
                          {action && (
                            <button
                              type="button"
                              disabled={updatingId === order._id}
                              onClick={() => updateStatus(order._id, action[1])}
                              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f4510b] py-2 text-xs font-bold text-white transition hover:bg-[#d94100] disabled:opacity-60"
                            >
                              <FaCheck />{" "}
                              {updatingId === order._id
                                ? "Updating..."
                                : action[0]}
                            </button>
                          )}
                        </article>
                      );
                    })}
                    {!grouped[column.key]?.length && (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-3 py-8 text-center text-xs text-gray-400">
                        No orders here
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Kitchen;
