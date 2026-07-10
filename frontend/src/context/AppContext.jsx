import { createContext, useEffect, useState } from "react";
import { categories, dummyOrders } from "../assets/assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
  const currency = "$";
  const delivery_fee = 10;
  const tax = 8;
  const navigate = useNavigate();

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
    try {
      const response = await axios.get(backendUrl + "/api/order/my-orders", {
        headers: { usertoken: getToken() },
      });
      if (response.data.success) {
        setUserOrder(response.data.orders);
        console.log("✅ User orders loaded:", response.data.orders.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Get Order Detail
  const userOrderDetail = async (orderId) => {
    try {
      const response = await axios.get(backendUrl + `/api/order/${orderId}`, {
        headers: {
          usertoken: getToken(),
        },
      });

      if (response.data.success) {
        setOrderStatus(response.data.order.orderStatus);
        return response.data.order;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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

  // ✅ Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // ✅ Get user orders on mount
  useEffect(() => {
    getUserOrder();
  }, []);

  // ✅ Update popular foods when foods change
  useEffect(() => {
    if (foods && foods.length > 0) {
      const filteredPopularFood = foods.filter((item) => item.popular);
      setPopularFood(filteredPopularFood);
    }
  }, [foods]);

  const value = {
    currency,
    delivery_fee,
    tax,
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
    dataLoading,
    loadAllData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
