import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaPhone, FaSignOutAlt, FaSyncAlt } from "react-icons/fa";
import { MdDeliveryDining, MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const statusFilters = [
  { value: "active", label: "Active deliveries" },
  { value: "ready", label: "Ready to pick up" },
  { value: "delivering", label: "Out for delivery" },
  { value: "delivered", label: "Completed" },
];

const DeliveryPortal = () => {
  const navigate = useNavigate();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
  const [token, setToken] = useState(
    () => localStorage.getItem("deliverytoken") || "",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/delivery/orders`, {
        headers: { deliverytoken: token },
        params: { status: filter, limit: 50 },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to load deliveries");
      }
      setOrders(response.data.orders || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load deliveries";
      if (error.response?.status === 401) {
        localStorage.removeItem("deliverytoken");
        setToken("");
        setOrders([]);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filter, token]);

  useEffect(() => {
    if (!token) return undefined;
    const timer = setTimeout(fetchOrders, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders, token]);

  const signIn = async (event) => {
    event.preventDefault();
    setLoggingIn(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/delivery/login`, {
        email,
        password,
      });
      if (!response.data.success || !response.data.deliverytoken) {
        throw new Error(response.data.message || "Delivery login failed");
      }
      localStorage.setItem("deliverytoken", response.data.deliverytoken);
      setToken(response.data.deliverytoken);
      setPassword("");
      toast.success("Signed in to delivery portal");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Delivery login failed",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("deliverytoken");
    setToken("");
    setOrders([]);
    navigate("/delivery", { replace: true });
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const response = await axios.put(
        `${backendUrl}/api/delivery/orders/${orderId}/status`,
        { status },
        { headers: { deliverytoken: token } },
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Could not update delivery");
      }
      toast.success(
        status === "delivering"
          ? "Delivery started"
          : "Order marked as delivered",
      );
      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not update delivery",
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ef] px-4 py-10">
        <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-4xl text-orange-600">
              <MdDeliveryDining />
            </div>
            <h1 className="text-3xl font-bold text-[#3d2418]">
              Delivery Staff
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your delivery queue
            </p>
          </div>
          <form onSubmit={signIn} className="space-y-5">
            <label className="block text-sm font-semibold text-gray-700">
              Email
              <span className="relative mt-2 block">
                <MdEmail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="delivery@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-10 py-2.5 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </span>
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter delivery staff password"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              {loggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 w-full text-center text-sm text-gray-500 hover:text-gray-800"
          >
            Back to restaurant
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ef] text-[#243247]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-2xl text-orange-600">
            <MdDeliveryDining />
          </span>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Delivery Portal</h1>
            <p className="text-xs text-gray-500">Courier work queue</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            <FaSignOutAlt /> Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Your deliveries</h2>
          <p className="mt-1 text-sm text-gray-600">
            Paid delivery orders that are ready for pickup or currently in
            transit.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {statusFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-orange-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-orange-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && orders.length === 0 ? (
          <div className="rounded-xl bg-white px-5 py-14 text-center text-gray-500 shadow-sm">
            Loading deliveries...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white px-5 py-14 text-center shadow-sm">
            <MdDeliveryDining className="mx-auto mb-3 text-4xl text-gray-300" />
            <p className="font-semibold">No orders in this list</p>
            <p className="mt-1 text-sm text-gray-500">
              New paid delivery orders will appear once the kitchen marks them
              ready.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const customer = order.deliveryAddress || {};
              const mapUrl =
                customer.latitude != null && customer.longitude != null
                  ? `https://www.openstreetmap.org/?mlat=${customer.latitude}&mlon=${customer.longitude}#map=16/${customer.latitude}/${customer.longitude}`
                  : null;
              const nextStatus =
                order.orderStatus === "ready" ? "delivering" : "delivered";
              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            order.orderStatus === "ready"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.orderStatus === "delivering"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-orange-700">
                        ETB {Number(order.total || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Number(order.deliveryDistanceKm || 0).toFixed(1)} km
                        {" · "}Fee ETB{" "}
                        {Number(order.deliveryFee || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 border-t border-gray-100 pt-5 md:grid-cols-2">
                    <div>
                      <p className="font-semibold">{customer.name || "Customer"}</p>
                      {customer.phone ? (
                        <a
                          href={`tel:${customer.phone}`}
                          className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
                        >
                          <FaPhone /> Call {customer.phone}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          No customer phone provided
                        </p>
                      )}
                      <p className="mt-3 whitespace-normal text-sm text-gray-700">
                        {customer.address || "Address not available"}
                      </p>
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                          <FaMapMarkerAlt className="text-orange-600" />
                          Open destination in map
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold">Order items</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {order.items?.map((item) => (
                          <li key={`${order._id}-${item.foodId}`}>
                            {item.quantity} × {item.name}
                          </li>
                        ))}
                      </ul>
                      {order.note && (
                        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          Note: {order.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.orderStatus !== "delivered" && (
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, nextStatus)}
                      className="mt-5 w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {updatingId === order._id
                        ? "Updating..."
                        : nextStatus === "delivering"
                          ? "Start delivery"
                          : "Mark as delivered"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default DeliveryPortal;
