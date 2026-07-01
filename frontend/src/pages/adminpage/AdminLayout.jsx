import React, { useState } from "react";
import { assets } from "../../assets/assets/assets";
import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaQrcode  } from "react-icons/fa";
import { HiMenu} from "react-icons/hi"
import { IoClose } from 'react-icons/io5'
import {
  MdDashboard,
  MdRestaurantMenu,
  MdAddShoppingCart,
  MdSettings,
  MdQrCode,
} from "react-icons/md";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const AdminLayout = () => {
  const {navigate} = useContext(AppContext)

  const [menuOpen, setMenuOpen] = useState(true)
 

  const logout = async () => {
    localStorage.removeItem('admintoken')
    navigate('/admin/login')
  }

  return (
    <div>
      <div className=  {`grid ${menuOpen ? "grid-cols-[300px_1fr]" : "grid-cols-[120px_1fr]"}  mt-7 ` }>
        <div className="flex flex-col justify-between min-h-screen  px-5 ml-9 shadow-2xl py-9  border-r border-gray-300 bg-gray-100 gap-9 ">
          <div className="">
            <div className= {`flex ${menuOpen ? "justify-between " : "justify-center "}items-center`} >
              {
                menuOpen && <img src={assets.logo} onClick={() =>navigate('/')}/>
              }
            
               
             {
              menuOpen ? <HiMenu onClick={() => setMenuOpen((prev) => !prev)}
                  size={30}
                className="cursor-pointer"/> : <IoClose size={30} onClick={() => setMenuOpen((prev) => !prev)}
                className="cursor-pointer"/>
             }
              
            </div>
            <div className="mt-5 flex flex-col gap-6">
              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/dashboard"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl hover:bg-amber-500 hover:text-white"
                >
                  <MdDashboard />
                      {
                        menuOpen &&   <p className="text-lg ">Dashboard</p>
                      }
                
                </NavLink>
              </div>

              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/products"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl hover:bg-amber-500 hover:text-white"
                >
                  <MdRestaurantMenu />
                    {
                      menuOpen &&  <p className="text-lg">Products</p>
                    }
                  
                </NavLink>
              </div>



              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/categories"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl hover:bg-amber-500 hover:text-white"
                >
                  <MdRestaurantMenu />
                    {
                      menuOpen &&  <p className="text-lg">Categories</p>
                    }
                  
                </NavLink>
              </div>

              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/totalorders"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl hover:bg-amber-500 hover:text-white"
                >
                  <MdAddShoppingCart />
                      {
                        menuOpen &&  <p className="text-lg">Orders</p>
                      }
                 
                </NavLink>
              </div>

              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/qrcodes"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl "
                >
                  <MdQrCode />
                      {
                        menuOpen && <p className="text-lg">QR Codes</p>
                      }
                  
                </NavLink>
              </div>

              <div className=" admin  cursor-pointer ">
                <NavLink
                  to="/admin/settings"
                  className="flex gap-3 items-center px-3 py-2 rounded-2xl hover:bg-amber-500 hover:text-white"
                >
                  <MdSettings />
                      {
                        menuOpen && <p className="text-lg">Settings</p>
                      }
                 
                </NavLink>
              </div>
            </div>
          </div>
          <div className="pb-16 flex flex-col gap-2 border-t w-full items-center border-gray-300 pt-2">
            <p className="text-md font-bold">SUPPORT</p>
            <p className="text-md font-bold text-orange-600">Help Center</p>
          </div>
        </div>

        {/* header */}

        <div>
          <div className="flex w-full  justify-between px-9 mt-7 border-b border-gray-400 items-center pb-4">
            <p className="text-2xl text-orange-700">Dashboard</p>
            <div className="flex gap-5 items-center">
              <p onClick={logout}
               className="border px-4 py-1 rounded-2xl border-gray-500 cursor-pointer">
                Logout
              </p>
              <FaUser className="text-orange-500 cursor-pointer " />
            </div>
          </div>

          {/* outlet middle */}
          <div className=" p-9  ">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 flex justify-center items-center py-5 border-t border-gray-200">
        <p>&copy;2026 Greencart manegment. All rights are reserved.</p>
      </div>
    </div>
  );
};

export default AdminLayout;
