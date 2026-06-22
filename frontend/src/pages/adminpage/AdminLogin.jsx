
import React from 'react'
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from 'react-icons/fa6';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AdminLogin = () => {
  const { navigate,backendUrl,setAdmintoken } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/user/admin/login', {
        email,
        password,
      })
      if (response.data.success) {
        setAdmintoken(response.data.admintoken)
        localStorage.setItem("admintoken", response.data.admintoken)
        navigate('/admin')
        
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }

  }
  return (
      <div className='flex justify-center items-center mt-12 '>
          <div className='shadow px-29 py-9 rounded-2xl'>
            <p className='text-2xl font-bold'>Admin  <span className='text-orange-500'>
            Sign In
             </span></p>
    
            <form onSubmit={onSubmitHandler} className='mt-6 flex flex-col'>
    
              
             
    
               <div className='relative mb-3'>
                <p className='text-md mb-2 '>Email</p>
                   <MdEmail className='absolute bottom-3 left-2 text-gray-600'/>
    
              <input  onChange={(e) =>setEmail(e.target.value)} value={email}
              type='email' placeholder='Enter your name'required  className='px-9 py-2'/>
              </div>
    
    
               <div className='relative mb-3'>
                <p className='text-md mb-2 '>Password</p>
              <input onChange={(e) =>setPassword(e.target.value)} value={password}
               type='password' placeholder='Enter your name'required className='px-9 py-2'/>
               <FaLock className='absolute bottom-3 left-2 text-gray-600'/>
              </div>
    
    
    
             
    
              <button type='submit'className='bg-orange-600 text-white py-2 rounded-2xl cursor-pointer hover:bg-orange-700 text-2xl mt-5 mb-3' >
               Sign In
                </button>
               
             
            </form>
          </div>
        </div>
        
  )
}

export default AdminLogin
