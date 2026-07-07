import { createContext, useEffect, useState } from "react";
import { categories, dummyOrders } from "../assets/assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
  const [userLogin, setUserLogin] = useState(false); // ✅ Changed to false
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Changed to false
  const [totalOrders, setTotalOrders] = useState([]);
  const [usertoken, setUsertoken] = useState("");
  const [admintoken, setAdmintoken] = useState("");
  const [allCategory, setAllCategory] = useState([]);

  // user order
  const [userOrder, setUserOrder] = useState([])
  

  // Cart state
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total: 0,
    count: 0,
  });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Get token from localStorage helper
  const getToken = () => {
    const token = localStorage.getItem("usertoken");
    console.log("Getting token from localStorage:", token ? "Token exists" : "No token");
    return token;
  };

  // ✅ Get food list
  const getFoodList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/food/list");
      if (response.data.success) {
        setFoods(response.data.foods);
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
      setLoading(true);
      await getUserCart();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get User Cart - ALWAYS get fresh token
  const getUserCart = async () => {
    const token = getToken(); // ✅ Get fresh token
    
    if (!token) {
      console.log("No token found for getUserCart");
      return;
    }

    try {
   
      const response = await axios.get(backendUrl + "/api/cart/get", {
        headers: {
          usertoken: token //  Use fresh token
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

  console.log(cart);
  

  // ✅ Add to Cart - ALWAYS get fresh token
  const addToCart = async (foodId, quantity = 1) => {
    const token = getToken(); //  Get fresh token
    
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
            usertoken: token //  Use fresh token
          },
        },
      );
        console.log(response);
        
      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart?.count || 0);
        toast.success(response.data.message);
        return { success: true };
        console.log(response.data.cart);
        
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

  // ✅ Update Cart - ALWAYS get fresh token
  const updateCartItem = async (foodId, quantity) => {
    const token = getToken(); // ✅Get fresh token
    
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
            usertoken: token // ✅ Use fresh token
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

  // ✅ Remove from Cart - ALWAYS get fresh token
  const removeFromCart = async (foodId) => {
    const token = getToken(); // ✅ Get fresh token
    
    console.log('yyy');
    
    
    if (!token) {
      toast.error("Please login to remove items");
      return { success: false };
    }

    try {
      const response = await axios({
        method: 'delete',
        url: backendUrl + "/api/cart/remove",
        data: { foodId },
        headers: {
          usertoken: token // ✅ Use fresh token
        },
      });
      console.log(response);
      
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

  // ✅ Clear Cart - ALWAYS get fresh token
  const clearCart = async () => {
    const token = getToken(); // ✅ Get fresh token
    
    if (!token) {
      toast.error("Please login to clear cart");
      return { success: false };
    }

    try {
      const response = await axios({
        method: 'delete',
        url: backendUrl + "/api/cart/clear",
        headers: {
          usertoken: token // ✅ Use fresh token
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

  // ✅ Get Cart Count - ALWAYS get fresh token
  const getCartCount = async () => {
    const token = getToken(); // ✅ Get fresh token
    
    if (!token) {
      return { success: false, count: 0 };
    }

    try {
      const response = await axios.get(backendUrl + "/api/cart/count", {
        headers: {
          usertoken: token // ✅ Use fresh token
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return { success: false, count: 0 };
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
  }, []);

  // ✅ Get categories on mount
  useEffect(() => {
    getCategoryList();
  }, []);

  // ✅ Get food list on mount
  useEffect(() => {
    getFoodList();
  }, []);

  // ✅ Update popular foods when foods change
  useEffect(() => {
    if (foods && foods.length > 0) {
      const filteredPopularFood = foods.filter((item) => item.popular);
      setPopularFood(filteredPopularFood);
    }
  }, [foods]);

  // order

  const getUserOrder = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/order/my-orders', {
        headers:{usertoken : getToken()}
      })
      console.log('yess i' ,response.data.orders);
      if (response.data.success) {
        setUserOrder(response.data.orders)
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

   const userOrderDetail = async (orderId) => {
    try {
      const response = await axios.get(backendUrl + `/api/order/${orderId}`, {
        headers: {
          usertoken: getToken(),
        },
      });
    
if (response.data.success) {
  setOrderStatus(response.data.order.orderStatus)
}
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  };

  
useEffect (() => {
  getUserOrder()
}, [])
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
    loading,
    setLoading,
    setCart,
    setCartCount,
    getToken, // ✅ Expose getToken if needed
    userOrder, setUserOrder,
    userOrderDetail
    
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};