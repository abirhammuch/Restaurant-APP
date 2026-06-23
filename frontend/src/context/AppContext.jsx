

import { createContext, useEffect, useState } from "react";
import { cart, categories, dummyOrders } from "../assets/assets/assets";
import { food } from "../assets/assets/assets";
import { useNavigate,useParams } from "react-router-dom";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = '$'
  const delivery_fee = 10
  const navigate = useNavigate()

  
  const [fullCategory, setFullCategory] = useState(categories)
  const [foods, setFoods] = useState(food)
  const [searchedQuery, setSearchedQuery] = useState([])
    const [searchedFood, setSearchedFood] = useState('')
    const [showSearch, setShowSearch ] = useState(false)
    const [popularFood, setPopularFood] = useState([]);
    const [foodDetail, setFoodDetail] = useState([]);
    const [orders, setOrders] = useState(cart)
    const [userLogin, setUserLogin] = useState(true)
    const [isAdmin, setIsAdmin] = useState(true)
    const [totalOrders, setTotalOrders]= useState(dummyOrders)
    const [usertoken, setUsertoken] = useState('')
    const [admintoken, setAdmintoken] = useState('')
 
  
  

      useEffect(() =>{
        const admintoken = localStorage.getItem('admintoken')
        const usertoken = localStorage.getItem('usertoken')
        if (admintoken) {
          setAdmintoken(admintoken)
          setIsAdmin(true)
        }
        if (usertoken) {
          setUsertoken(usertoken)
        }

      },[])
 
 
     useEffect(() => {
    if (foods) {
      const filteredPopularFood = foods.filter((item) => item.popular);
      setPopularFood(filteredPopularFood);
    }
  }, []);



  

 
  
  const value = {
    currency,
    delivery_fee,
    fullCategory, setFullCategory,
    foods, setFoods,
    navigate,searchedQuery,setSearchedQuery, searchedFood,setSearchedFood,showSearch,setShowSearch,useParams,
    popularFood,setPopularFood,
    foodDetail,setFoodDetail,
    orders,setOrders, 
    userLogin,setUserLogin,setIsAdmin,isAdmin,
    setTotalOrders,totalOrders, 
    backendUrl,
    admintoken,setAdmintoken,usertoken,setUsertoken
    
   
  }
  return(
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}