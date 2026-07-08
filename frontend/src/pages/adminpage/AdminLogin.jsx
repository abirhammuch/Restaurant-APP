// pages/adminpage/AdminLogin.jsx
import React, { useState, useContext, useEffect } from 'react'
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from 'react-icons/fa6';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { navigate, backendUrl, setAdmintoken, setIsAdmin, isAdmin } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  // ✅ Check if already logged in - runs once
  useEffect(() => {
    const token = localStorage.getItem('admintoken')
    if (token) {
      setAdmintoken(token)
      setIsAdmin(true)
      navigate('/admin/dashboard', { replace: true })
    }
    setChecked(true)
  }, [])

  // ✅ Show loader while checking
  if (!checked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(backendUrl + '/api/user/admin/login', {
        email,
        password,
      })

      if (response.data.success) {
        const token = response.data.admintoken
        setAdmintoken(token)
        setIsAdmin(true)
        localStorage.setItem("admintoken", token)
        toast.success('Admin login successful')
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='shadow-lg px-12 py-9 rounded-2xl bg-white w-full max-w-md'>
        <div className="text-center mb-6">
          <p className='text-3xl font-bold'>
            Admin <span className='text-orange-500'>Sign In</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials to access dashboard</p>
        </div>

        <form onSubmit={onSubmitHandler} className='mt-6 flex flex-col'>
          <div className='relative mb-4'>
            <p className='text-sm font-medium mb-1'>Email</p>
            <MdEmail className='absolute bottom-3 left-3 text-gray-400' />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='admin@example.com'
              required
              className='w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
            />
          </div>

          <div className='relative mb-6'>
            <p className='text-sm font-medium mb-1'>Password</p>
            <FaLock className='absolute bottom-3 left-3 text-gray-400' />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Enter your password'
              required
              className='w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-orange-600 text-white py-3 rounded-lg cursor-pointer hover:bg-orange-700 text-lg font-semibold transition-colors disabled:opacity-50'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Digital Menu. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin