import { createContext, useEffect, useState } from "react";
import { categories, dummyOrders } from "../assets/assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { translations } from "../assets/translations";

export const AppContext = createContext();

// Exchange rate: 1 USD = 130 ETB (approximate)
const ETH_TO_USD_RATE = 130;

export const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

  const navigate = useNavigate();

  // Language and Currency State
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const [currencyType, setCurrencyType] = useState(() => {
    return localStorage.getItem("currencyType") || "USD";
  });

  // Currency symbol based on type
  const getCurrencySymbol = () => {
    return currencyType === "ETB" ? "ብር" : "$";
  };

  const currency = getCurrencySymbol();

  // Convert price based on currency
  const convertPrice = (priceInUSD) => {
    if (currencyType === "ETB") {
      return Math.round(priceInUSD * ETH_TO_USD_RATE);
    }
    return priceInUSD;
  };

  const formatPrice = (priceInUSD) => {
    const amount = convertPrice(priceInUSD);
    const amountString =
      typeof amount === "number" ? amount.toFixed(2) : amount;

    if (currencyType === "ETB") {
      const label = language === "am" ? "ብር" : "ETB";
      return language === "am"
        ? `${amountString} ${label}`
        : `${label} ${amountString}`;
    }

    return `$${amountString}`;
  };

  const delivery_fee = convertPrice(10);
  const tax = 8; // Tax percentage

  // Translation helper function
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Change language function
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Change currency function
  const changeCurrency = (curr) => {
    setCurrencyType(curr);
    localStorage.setItem("currencyType", curr);
  };

  const [fullCategory, setFullCategory] = useState(categories);
  const [foods, setFoods] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchedFood, setSearchedFood] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [popularFood, setPopularFood] = useState([]);
  const [foodDetail, setFoodDetail] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userLogin, setUserLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalOrders, setTotalOrders] = useState([]);
  const [usertoken, setUsertoken] = useState("");
  const [admintoken, setAdmintoken] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chatThreads, setChatThreads] = useState(() => {
    try {
      const stored = localStorage.getItem("chatThreads");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load chat threads from storage:", error);
      return [];
    }
  });
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // ✅ App loading state - for checking auth
  const [appLoading, setAppLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total: 0,
    count: 0,
  });
  const [cartCount, setCartCount] = useState(0);
  // ✅ Cart loading state
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveChatThreads = (threads) => {
    setChatThreads(threads);
    try {
      localStorage.setItem("chatThreads", JSON.stringify(threads));
    } catch (error) {
      console.error("Failed to save chat threads:", error);
    }
  };

  const getGuestId = () => {
    let guestId = localStorage.getItem("guestChatId");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guestChatId", guestId);
    }
    return guestId;
  };

  const getChatThreadByUser = (userId) => {
    return chatThreads.find((thread) => thread.userId === userId) || null;
  };

  const getLatestThreads = () => {
    return [...chatThreads].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  };

  const addMessageToThread = (userId, userName, userEmail, message) => {
    const updatedThreads = [...chatThreads];
    const threadIndex = updatedThreads.findIndex(
      (thread) => thread.userId === userId,
    );
    if (threadIndex !== -1) {
      updatedThreads[threadIndex] = {
        ...updatedThreads[threadIndex],
        userName,
        userEmail,
        messages: [...updatedThreads[threadIndex].messages, message],
        updatedAt: message.createdAt,
      };
    } else {
      updatedThreads.push({
        userId,
        userName,
        userEmail,
        messages: [message],
        updatedAt: message.createdAt,
      });
    }
    saveChatThreads(updatedThreads);
  };

  const sendCustomerMessage = (text) => {
    const userId = currentUser?.id || getGuestId();
    const userName = currentUser?.name || "Guest";
    const userEmail = currentUser?.email || "guest@chat.local";
    const message = {
      id: `customer-${Date.now()}`,
      from: "customer",
      text,
      createdAt: new Date().toISOString(),
    };
    addMessageToThread(userId, userName, userEmail, message);
    setSelectedChatUserId(userId);
  };

  const sendAdminMessage = (text, userId = null) => {
    const targetUserId = userId || selectedChatUserId;
    if (!targetUserId) {
      toast.error("Please select a customer chat thread first.");
      return;
    }
    const thread = getChatThreadByUser(targetUserId);
    const userName = thread?.userName || "Customer";
    const userEmail = thread?.userEmail || "unknown@chat.local";
    const message = {
      id: `admin-${Date.now()}`,
      from: "admin",
      text,
      createdAt: new Date().toISOString(),
    };
    addMessageToThread(targetUserId, userName, userEmail, message);
  };

  const fetchCurrentUserProfile = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const response = await axios.get(backendUrl + "/api/user/profile", {
        headers: { usertoken: token },
      });
      if (response.data.success) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch current user profile:", error);
    }
  };

  // ✅ Get token from localStorage helper
  const getToken = () => {
    const token = localStorage.getItem("usertoken");
    console.log(
      "Getting token from localStorage:",
      token ? "Token exists" : "No token",
    );
    return token;
  };

  // ✅ Get food list
  const getFoodList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/food/list");
      if (response.data.success) {
        setFoods(response.data.foods);
        console.log("✅ Foods loaded:", response.data.foods.length);
        return response.data.foods;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Get category list
  const getCategoryList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        setAllCategory(response.data.categories);
        console.log("✅ Categories loaded:", response.data.categories.length);
        return response.data.categories;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Load all data
  const loadAllData = async () => {
    setDataLoading(true);
    try {
      await Promise.all([getFoodList(), getCategoryList()]);
      console.log("✅ All data loaded successfully");
    } catch (error) {
      console.error("❌ Error loading data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // ✅ Load cart on login
  useEffect(() => {
    const token = getToken();
    if (token) {
      setUsertoken(token);
      setUserLogin(true);
      loadCart();
    } else {
      setUserLogin(false);
      setCart({ items: [], subtotal: 0, total: 0, count: 0 });
      setCartCount(0);
    }
  }, []);

  // ✅ Load cart function
  const loadCart = async () => {
    try {
      setCartLoading(true);
      await getUserCart();
    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  // ✅ Get User Cart
  const getUserCart = async () => {
    const token = getToken();

    if (!token) {
      console.log("No token found for getUserCart");
      return;
    }

    try {
      const response = await axios.get(backendUrl + "/api/cart/get", {
        headers: {
          usertoken: token,
        },
      });

      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart?.count || 0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Add to Cart
  const addToCart = async (foodId, quantity = 1) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to add items to cart");
      return { success: false };
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/cart/add",
        { foodId, quantity },
        {
          headers: {
            usertoken: token,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart?.count || 0);
        toast.success(response.data.message);
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ Update Cart
  const updateCartItem = async (foodId, quantity) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to update cart");
      return { success: false };
    }

    try {
      const response = await axios.put(
        backendUrl + "/api/cart/update",
        { foodId, quantity },
        {
          headers: {
            usertoken: token,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart?.count || 0);
        toast.success(response.data.message);
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (foodId) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to remove items");
      return { success: false };
    }

    try {
      const response = await axios({
        method: "delete",
        url: backendUrl + "/api/cart/remove",
        data: { foodId },
        headers: {
          usertoken: token,
        },
      });

      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart?.count || 0);
        toast.success(response.data.message);
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to clear cart");
      return { success: false };
    }

    try {
      const response = await axios({
        method: "delete",
        url: backendUrl + "/api/cart/clear",
        headers: {
          usertoken: token,
        },
      });

      if (response.data.success) {
        setCart({ items: [], subtotal: 0, total: 0, count: 0 });
        setCartCount(0);
        toast.success(response.data.message);
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ Get Cart Count
  const getCartCount = async () => {
    const token = getToken();

    if (!token) {
      return { success: false, count: 0 };
    }

    try {
      const response = await axios.get(backendUrl + "/api/cart/count", {
        headers: {
          usertoken: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return { success: false, count: 0 };
    }
  };

  // ✅ Get User Orders
  const getUserOrder = async () => {
    const token = getToken();
    if (!token) {
      console.log("No token found for getUserOrder");
      return [];
    }

    try {
      const response = await axios.get(backendUrl + "/api/order/my-orders", {
        headers: { usertoken: token },
      });
      if (response.data.success) {
        setUserOrder(response.data.orders || []);
        console.log(
          "✅ User orders loaded:",
          (response.data.orders || []).length,
        );
        return response.data.orders || [];
      } else {
        toast.error(response.data.message || "Failed to load orders");
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching user orders:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view your orders");
        localStorage.removeItem("usertoken");
        setUsertoken("");
        setUserLogin(false);
      } else {
        toast.error(error.response?.data?.message || "Failed to load orders");
      }
      return [];
    }
  };

  // ✅ Get Order Detail
  const userOrderDetail = async (orderId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to view order details");
      return null;
    }

    try {
      const response = await axios.get(backendUrl + `/api/order/${orderId}`, {
        headers: {
          usertoken: token,
        },
      });

      if (response.data.success) {
        setOrderStatus(response.data.order.orderStatus);
        return response.data.order;
      } else {
        toast.error(response.data.message || "Failed to load order");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching order detail:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view order details");
        localStorage.removeItem("usertoken");
        setUsertoken("");
        setUserLogin(false);
      } else {
        toast.error(error.response?.data?.message || "Failed to load order");
      }
      return null;
    }
  };

  // ✅ Get tokens from localStorage on mount
  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken");
    const userToken = localStorage.getItem("usertoken");

    console.log("=== APP INIT ===");
    console.log("Admin Token:", adminToken ? "Exists" : "Not found");
    console.log("User Token:", userToken ? "Exists" : "Not found");

    if (adminToken) {
      setAdmintoken(adminToken);
      setIsAdmin(true);
    }
    if (userToken) {
      setUsertoken(userToken);
      setUserLogin(true);
    }

    // ✅ Set appLoading to false after checking tokens
    setAppLoading(false);
  }, []);

  useEffect(() => {
    if (usertoken) {
      fetchCurrentUserProfile();
    } else {
      setCurrentUser(null);
    }
  }, [usertoken]);

  // ✅ Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // ✅ Get user orders when user logs in
  useEffect(() => {
    if (userLogin && usertoken) {
      getUserOrder();
    }
  }, [userLogin, usertoken]);

  // ✅ Update popular foods when foods change
  useEffect(() => {
    if (foods && foods.length > 0) {
      const filteredPopularFood = foods.filter((item) => item.popular);
      setPopularFood(filteredPopularFood);
    }
  }, [foods]);

  const value = {
    currency,
    currencyType,
    convertPrice,
    formatPrice,
    changeCurrency,
    delivery_fee,
    tax,
    language,
    changeLanguage,
    t, // Translation function
    fullCategory,
    setFullCategory,
    foods,
    setFoods,
    navigate,
    searchedQuery,
    setSearchedQuery,
    searchedFood,
    setSearchedFood,
    showSearch,
    setShowSearch,
    useParams,
    popularFood,
    setPopularFood,
    foodDetail,
    setFoodDetail,
    orders,
    setOrders,
    userLogin,
    setUserLogin,
    setIsAdmin,
    isAdmin,
    setTotalOrders,
    totalOrders,
    backendUrl,
    admintoken,
    setAdmintoken,
    usertoken,
    setUsertoken,
    allCategory,
    setAllCategory,
    addToCart,
    updateCartItem,
    getUserCart,
    getCartCount,
    clearCart,
    getUserOrder,
    removeFromCart,
    cart,
    cartCount,
    appLoading, // ✅ Renamed from loading
    setAppLoading,
    cartLoading, // ✅ New cart loading state
    setCartLoading,
    loading,
    setLoading,
    setCart,
    setCartCount,
    getToken,
    getFoodList,
    getCategoryList,
    userOrder,
    setUserOrder,
    userOrderDetail,
    orderStatus,
    setOrderStatus,
    currentUser,
    setCurrentUser,
    chatThreads,
    selectedChatUserId,
    setSelectedChatUserId,
    getGuestId,
    getChatThreadByUser,
    getLatestThreads,
    sendCustomerMessage,
    sendAdminMessage,
    dataLoading,
    loadAllData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
