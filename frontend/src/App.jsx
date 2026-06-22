

import React, { useContext } from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MenuPage from './pages/MenuPage'
import CategoryPage from './pages/CategoryPage'
import FooterLink from './components/FooterLink'
import Policy from './components/Policy'
import SearchFood from './pages/SearchFood'
import FoodDetail from './pages/FoodDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Order from './pages/Order'
import Login from './pages/Login'
import { AppContext } from './context/AppContext'
import AdminLogin from './pages/adminpage/AdminLogin'
import AdminLayout from './pages/adminpage/AdminLayout'
import Orders from './pages/adminpage/TotalOrders'
import Products from './pages/adminpage/Products'
import Qrcodes from './pages/adminpage/qrcodes'
import Settings from './pages/adminpage/settings'
import Dashboard from './pages/adminpage/Dashboard'




const App = () => {
 const  isAdminPath = useLocation().pathname.includes('admin');

  const {userLogin, isAdmin} = useContext(AppContext)
  return (
    <div >
      <ToastContainer />

      {
        isAdminPath ? null :  <Navbar />
      }
     

      <div>
        <Routes >
          <Route path='/' element= {<Home />} />
          <Route path='/about' element= {<About />} />
          <Route path='/login' element= {<Login />} />
          <Route path='/admin/login' element= {<AdminLogin />} />
          <Route path='/admin/dashboard' element= {<AdminLayout />} />
          <Route path='/contact' element= {<Contact />} />
          <Route path='/cart' element= {<CartPage />} />
          <Route path='/checkout' element= {<Checkout />} />
          <Route path='/orders' element= {<Order />} />
          <Route path='/menu' element= {<MenuPage />} />
          <Route path='/menu/:category' element= {<CategoryPage />} />
          <Route path='/menu/search' element= {<SearchFood />} />
          <Route path ='/menu/:category/:id' element ={<FoodDetail />} />


          <Route path='/admin' element= { isAdmin ? <AdminLayout /> : <AdminLogin />} >
            
            <Route path='/admin/products' element= { <Products />} />
            <Route path='/admin/totalorders' element= { <Orders />} />
            <Route path='/admin/qrcodes' element= { <Qrcodes />} />
            <Route path='/admin/dashboard' element = { <Dashboard />} />
            <Route path='/admin/settings' element= { <Settings />} />
           
           
            

          </Route>
        </Routes>
          
      </div>

      { 
        isAdminPath ? '' :
        <div>
          <FooterLink />
          <Policy />

          </div>
      }
      
        
    </div>
  )
}

export default App
