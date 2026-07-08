// pages/adminpage/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  FaUsers, 
  FaUtensils, 
  FaShoppingCart, 
  FaDollarSign,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { 
  MdRestaurantMenu, 
  MdCategory, 
  MdRateReview,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { 
    backendUrl, 
    foods, 
    allCategory, 
    admintoken,
    dataLoading,
    loadAllData
  } = useContext(AppContext);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFoods: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    deliveringOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalCategories: 0,
    totalRatings: 0,
    averageRating: 0,
    ordersToday: 0,
    ordersThisMonth: 0,
    averageOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusBreakdown, setStatusBreakdown] = useState([]);

  const getToken = () => localStorage.getItem('admintoken');

  // ✅ Format currency
  const formatCurrency = (amount) => {
    return `$${amount?.toFixed(2) || '0.00'}`;
  };

  // ✅ Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivering: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ✅ Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      confirmed: <FaCheckCircle className="text-blue-500" />,
      preparing: <FaSpinner className="text-purple-500 animate-spin" />,
      ready: <FaCheckCircle className="text-green-500" />,
      delivering: <FaSpinner className="text-indigo-500 animate-spin" />,
      delivered: <FaCheckCircle className="text-emerald-500" />,
      cancelled: <FaTimesCircle className="text-red-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  // ✅ Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      console.log('📊 Fetching dashboard stats...');
      console.log('Foods from context:', foods?.length || 0);
      console.log('Categories from context:', allCategory?.length || 0);

      // ✅ If no data, reload it
      if (foods.length === 0 || allCategory.length === 0) {
        console.log('🔄 Reloading data...');
        await loadAllData();
      }

      // Get users count
      let totalUsers = 0;
      try {
        const usersRes = await axios.get(`${backendUrl}/api/user/count`, {
          headers: { admintoken: getToken() }
        });
        totalUsers = usersRes.data?.count || 0;
      } catch (error) {
        console.log('Users count error:', error.message);
      }

      // Get orders stats
      let totalOrdersCount = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;
      let confirmedOrders = 0;
      let preparingOrders = 0;
      let readyOrders = 0;
      let deliveringOrders = 0;
      let deliveredOrders = 0;
      let cancelledOrders = 0;
      let ordersToday = 0;
      let ordersThisMonth = 0;
      let averageOrderValue = 0;
      let breakdown = [];
      
      try {
        const ordersRes = await axios.get(`${backendUrl}/api/order/admin/stats`, {
          headers: { admintoken: getToken() }
        });
        if (ordersRes.data?.success) {
          const statsData = ordersRes.data.stats;
          totalOrdersCount = statsData.totalOrders || 0;
          totalRevenue = statsData.totalRevenue || 0;
          ordersToday = statsData.ordersToday || 0;
          ordersThisMonth = statsData.ordersThisMonth || 0;
          averageOrderValue = statsData.averageOrderValue || 0;
          breakdown = statsData.statusBreakdown || [];
          
          breakdown.forEach(item => {
            if (item._id === 'pending') pendingOrders = item.count;
            else if (item._id === 'confirmed') confirmedOrders = item.count;
            else if (item._id === 'preparing') preparingOrders = item.count;
            else if (item._id === 'ready') readyOrders = item.count;
            else if (item._id === 'delivering') deliveringOrders = item.count;
            else if (item._id === 'delivered') deliveredOrders = item.count;
            else if (item._id === 'cancelled') cancelledOrders = item.count;
          });
        }
      } catch (error) {
        console.log('Orders stats error:', error.message);
      }

      setStatusBreakdown(breakdown);

      // Get ratings stats
      let totalRatings = 0;
      let averageRating = 0;
      try {
        const ratingsRes = await axios.get(`${backendUrl}/api/rating/admin/all?limit=1`, {
          headers: { admintoken: getToken() }
        });
        if (ratingsRes.data?.success) {
          totalRatings = ratingsRes.data?.pagination?.total || 0;
          if (ratingsRes.data?.ratings?.length > 0) {
            const sum = ratingsRes.data.ratings.reduce((acc, r) => acc + r.rating, 0);
            averageRating = sum / ratingsRes.data.ratings.length;
          }
        }
      } catch (error) {
        console.log('Ratings error:', error.message);
      }

      // Get recent orders
      let recentOrdersData = [];
      try {
        const recentRes = await axios.get(`${backendUrl}/api/order/admin/all?limit=5`, {
          headers: { admintoken: getToken() }
        });
        recentOrdersData = recentRes.data?.orders || [];
      } catch (error) {
        console.log('Recent orders error:', error.message);
      }

      // ✅ Update stats
      setStats({
        totalUsers: totalUsers,
        totalFoods: foods?.length || 0,
        totalOrders: totalOrdersCount,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        confirmedOrders: confirmedOrders,
        preparingOrders: preparingOrders,
        readyOrders: readyOrders,
        deliveringOrders: deliveringOrders,
        deliveredOrders: deliveredOrders,
        cancelledOrders: cancelledOrders,
        totalCategories: allCategory?.length || 0,
        totalRatings: totalRatings,
        averageRating: averageRating || 0,
        ordersToday: ordersToday,
        ordersThisMonth: ordersThisMonth,
        averageOrderValue: averageOrderValue
      });

      setRecentOrders(recentOrdersData);

      console.log('✅ Stats updated:', {
        foods: foods?.length,
        categories: allCategory?.length,
        orders: totalOrdersCount,
        revenue: totalRevenue
      });

    } catch (error) {
      console.error('Fetch stats error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load stats when data changes
  useEffect(() => {
    if (!dataLoading) {
      fetchStats();
    }
  }, [foods, allCategory, dataLoading]);

  // ✅ Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Status cards data
  const statusCards = [
    { label: 'Pending', count: stats.pendingOrders, color: 'yellow' },
    { label: 'Confirmed', count: stats.confirmedOrders, color: 'blue' },
    { label: 'Preparing', count: stats.preparingOrders, color: 'purple' },
    { label: 'Ready', count: stats.readyOrders, color: 'green' },
    { label: 'Delivering', count: stats.deliveringOrders, color: 'indigo' },
    { label: 'Delivered', count: stats.deliveredOrders, color: 'emerald' },
    { label: 'Cancelled', count: stats.cancelledOrders, color: 'red' }
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your restaurant today.</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <FaDollarSign className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-gray-400">Avg: {formatCurrency(stats.averageOrderValue)}/order</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalOrders}</p>
              <p className="text-xs text-gray-400">{stats.ordersToday} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <MdRestaurantMenu className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Food Items</p>
              <p className="text-xl font-bold text-green-600">{stats.totalFoods}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-xl font-bold text-purple-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-xl font-bold text-indigo-600">{stats.totalCategories}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-xl font-bold text-pink-600">{stats.totalRatings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <p className="text-xl font-bold text-amber-600">{stats.averageRating.toFixed(1)} ★</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Orders This Month</p>
          <p className="text-xl font-bold text-teal-600">{stats.ordersThisMonth}</p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {statusCards.map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`text-${item.color}-500`}>
                {item.label === 'Pending' && <FaClock />}
                {item.label === 'Confirmed' && <FaCheckCircle />}
                {item.label === 'Preparing' && <FaSpinner className="animate-spin" />}
                {item.label === 'Ready' && <FaCheckCircle />}
                {item.label === 'Delivering' && <FaSpinner className="animate-spin" />}
                {item.label === 'Delivered' && <FaCheckCircle />}
                {item.label === 'Cancelled' && <FaTimesCircle />}
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-lg font-bold text-${item.color}-600`}>{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          <button
            onClick={() => window.location.href = '/admin/totalorders'}
            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm font-mono">#{order._id?.slice(-8) || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">{order.deliveryAddress?.name || 'Unknown'}</td>
                    <td className="px-4 py-2 text-sm">{order.items?.length || 0} items</td>
                    <td className="px-4 py-2 text-sm font-semibold">${order.total?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;