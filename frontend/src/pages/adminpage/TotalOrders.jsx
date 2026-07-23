import React, { useContext, useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { totalOrders, setTotalOrders, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getToken = () => localStorage.getItem("admintoken");

  //  Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/order/admin/all", {
        headers: {
          admintoken: getToken(),
        },
      });

      if (response.data.success) {
        setTotalOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get formatted time
  const getFormattedTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Get formatted date
  const getFormattedDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ Handle Order Status Update
  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/api/order/admin/status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            admintoken: getToken(),
          },
        },
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        // ✅ Refresh orders
        await fetchOrders();
        setEditingId(null);
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/order/admin/delete/${orderId}`,
        {
          headers: {
            admintoken: getToken(),
          },
        },
      );

      if (response.data.success) {
        toast.success("Order deleted successfully");
        await fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const buildExportExcel = (orders) => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Table",
      "Total",
      "Order Date",
      "Order Time",
      "Order Status",
      "Payment Status",
    ];

    const escapeHtml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const rows = orders.map((order) => [
      escapeHtml(order._id),
      escapeHtml(order.deliveryAddress?.name || "N/A"),
      escapeHtml(order.deliveryAddress?.phone || "N/A"),
      escapeHtml(order.table || "N/A"),
      escapeHtml(order.total?.toFixed(2) || "0.00"),
      escapeHtml(getFormattedDate(order.createdAt)),
      escapeHtml(getFormattedTime(order.createdAt)),
      escapeHtml(order.orderStatus || "N/A"),
      escapeHtml(order.paymentStatus || "pending"),
    ]);

    const headerRow = headers
      .map((header) => `<th>${escapeHtml(header)}</th>`)
      .join("");

    const bodyRows = rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join("");

    return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </body>
</html>`;
  };

  const handleExportOrders = () => {
    const exportOrders = filteredOrders?.length ? filteredOrders : [];
    if (!exportOrders.length) {
      toast.info("No orders available to export.");
      return;
    }

    const excelData = buildExportExcel(exportOrders);
    const blob = new Blob([excelData], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "orders-export.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ✅ Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      delivering: "bg-indigo-100 text-indigo-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // ✅ Get payment status color
  const getPaymentColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  // ✅ Filter orders
  const filteredOrders = totalOrders?.filter((order) => {
    // Filter by status
    if (filterStatus !== "all" && order.orderStatus !== filterStatus) {
      return false;
    }
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderIdMatch = order._id.toLowerCase().includes(query);
      const nameMatch = order.deliveryAddress?.name
        ?.toLowerCase()
        .includes(query);
      const tableMatch = order.table?.toLowerCase().includes(query);
      return orderIdMatch || nameMatch || tableMatch;
    }
    return true;
  });

  // ✅ Get stats
  const getStats = () => {
    if (!totalOrders)
      return { total: 0, pending: 0, preparing: 0, ready: 0, delivered: 0 };
    const stats = {
      total: totalOrders.length,
      pending: totalOrders.filter((o) => o.orderStatus === "pending").length,
      preparing: totalOrders.filter((o) => o.orderStatus === "preparing")
        .length,
      ready: totalOrders.filter((o) => o.orderStatus === "ready").length,
      delivered: totalOrders.filter((o) => o.orderStatus === "delivered")
        .length,
    };
    return stats;
  };

  const stats = getStats();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && !totalOrders) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center mb-5">
        <div>
          <p className="text-2xl font-bold">Order Management</p>
          <p className="text-gray-600">
            Manage, monitor, and update live orders from the kitchen.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportOrders}
            className="flex gap-2 border px-3 py-2 rounded-md border-gray-300 bg-white hover:bg-gray-100 transition-colors"
          >
            <FaDownload />
            <p>Export</p>
          </button>
          <div className="flex gap-2 border px-3 py-2 rounded-md border-gray-300 cursor-pointer bg-amber-500 text-white font-bold hover:bg-orange-600 transition-colors">
            <p>+</p>
            <p>New In-shop Order</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="border w-full flex flex-col justify-center items-center rounded-2xl py-4 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <p className="text-sm text-gray-600">TOTAL ORDERS</p>
          <p className="font-bold text-2xl">{stats.total}</p>
        </div>
        <div className="border w-full flex flex-col justify-center items-center rounded-2xl py-4 border-gray-300 shadow-lg cursor-pointer hover:bg-yellow-50 transition-colors">
          <p className="text-sm text-gray-600">PENDING</p>
          <p className="font-bold text-2xl text-yellow-600">{stats.pending}</p>
        </div>
        <div className="border w-full flex flex-col justify-center items-center rounded-2xl py-4 border-gray-300 shadow-lg cursor-pointer hover:bg-purple-50 transition-colors">
          <p className="text-sm text-gray-600">PREPARING</p>
          <p className="font-bold text-2xl text-purple-600">
            {stats.preparing}
          </p>
        </div>
        <div className="border w-full flex flex-col justify-center items-center rounded-2xl py-4 border-gray-300 shadow-lg cursor-pointer hover:bg-green-50 transition-colors">
          <p className="text-sm text-gray-600">READY</p>
          <p className="font-bold text-2xl text-green-600">{stats.ready}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 md:pt-7 px-3 sm:px-5 mb-5 rounded-2xl border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="px-10 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="absolute top-3 left-3 w-5 h-5 opacity-50"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
          {[
            "all",
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "delivering",
            "delivered",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filterStatus === status
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-2xl border-gray-300 overflow-hidden">
        <div className="grid grid-cols-[0.8fr_1.5fr_0.8fr_1fr_1.2fr_1.5fr_1fr_1fr] px-4 py-4 bg-gray-100 font-bold text-sm">
          <p>Order ID</p>
          <p>Customer</p>
          <p>Table</p>
          <p>Total</p>
          <p>Time</p>
          <p>Order Status</p>
          <p>Payment</p>
          <p>Actions</p>
        </div>

        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 gap-3 xl:grid-cols-[0.8fr_1.5fr_0.8fr_1fr_1.2fr_1.5fr_1fr_1fr] px-4 py-4 border-t border-gray-100 items-start xl:items-center hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs font-mono truncate">
                {order._id.slice(-6)}
              </p>
              <p className="text-sm truncate">
                {order.deliveryAddress?.name || "N/A"}
              </p>
              <p className="text-sm">{order.table || "N/A"}</p>
              <p className="font-bold text-amber-600">
                ${order.total?.toFixed(2)}
              </p>
              <p className="text-xs">
                {getFormattedTime(order.createdAt)}
                <br />
                <span className="text-gray-400 text-xs">
                  {getFormattedDate(order.createdAt)}
                </span>
              </p>

              {/* Status Dropdown */}
              <div>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <p
                className={`text-xs px-2 py-1 rounded-full text-center ${getPaymentColor(order.paymentStatus)}`}
              >
                {order.paymentStatus || "pending"}
              </p>

              <div className="flex gap-3">
                <FaPencil
                  className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                  onClick={() => {
                    // Open edit modal or navigate to edit page
                    toast.info("Edit functionality coming soon");
                  }}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => handleDeleteOrder(order._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
