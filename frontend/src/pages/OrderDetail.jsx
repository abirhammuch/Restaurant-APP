import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(false);
  const { orderId } = useParams();
  const { currency, backendUrl } = useContext(AppContext);

  const getToken = () => localStorage.getItem("usertoken");

  const userOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
        headers: {
          usertoken: getToken(),
        },
      });

      console.log('Order Detail Response:', response.data);

      if (response.data.success) {
        setOrderDetail(response.data.order);
        
        //  Update tick based on order status
        const status = response.data.order?.orderStatus;
        if (status === 'confirmed' || status === 'preparing' || status === 'ready') {
          setTick(true);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch order');
      }
    } catch (error) {
      console.log('Error fetching order:', error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      userOrderDetail(orderId);
    }
  }, [orderId]);

  // ✅ Get order status
  const orderStatus = orderDetail?.orderStatus || 'pending';

  // ✅ Get formatted time
  const getFormattedTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Get status step
  const getStatusStep = () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'F'];
    const currentIndex = statuses.indexOf(orderStatus);
    return currentIndex;
  };

  // ✅ Check if step is completed
  const isStepCompleted = (stepIndex) => {
    return getStatusStep() >= stepIndex;
  };

  // ✅ Check if step is active
  const isStepActive = (stepIndex) => {
    return getStatusStep() === stepIndex;
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // ✅ Order not found
  if (!orderDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">Order Not Found</p>
          <p className="text-gray-500 mt-2">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // ✅ Order status steps
  const steps = [
    { label: 'Order Received', description: 'We have successfully received your order and sent it to the kitchen team.' },
    { label: 'Order Confirmed', description: 'Our chefs have acknowledged your order and are gathering the finest ingredients.' },
    { label: 'Preparing Your Food', description: 'The kitchen is buzzing! Our head chef is meticulously crafting your meal right now.' },
    { label: 'Ready for Pickup', description: 'Once finalized we will notify you that your order is ready for the courier.' },
    { label: 'Out for Delivery', description: 'Our courier will safely deliver your warm meal to your table.' },
    { label: 'Delivered', description: 'Your order has been delivered. Enjoy your meal!' }
  ];

  // ✅ Status colors
  const getStatusColor = (stepIndex) => {
    if (isStepCompleted(stepIndex)) {
      return 'bg-amber-600 text-white';
    } else if (isStepActive(stepIndex)) {
      return 'bg-amber-400 text-white animate-pulse';
    }
    return 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="mt-14">
      {/* Header */}
      <div className="lg:mx-80 shadow-2xl rounded-2xl px-6 py-8">
        <div className="lg:flex justify-around items-center">
          <div className="mb-5 lg:mb-0">
            <div className="border border-amber-400 rounded-2xl inline-block">
              <p className="px-3 py-2 text-amber-700 bg-amber-50 rounded-2xl font-bold">
                LIVE TRACKING
              </p>
            </div>
            <p className="font-bold text-2xl mt-3 mb-2">Order ID: {orderId}</p>
            <p className="text-sm">
              Placed at {getFormattedTime(orderDetail.createdAt)}
            </p>
          </div>
          
          <div className="border px-9 py-4 rounded-2xl border-gray-300 text-center">
            <p className="text-md font-bold">ESTIMATED ARRIVAL</p>
            <p className="font-bold text-2xl text-amber-600">18 - 24 min</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-around mt-6">
          <div>
            <p className="font-bold">
              Currently:{" "}
              <span className="text-amber-600 capitalize">
                {orderStatus === 'delivered' ? 'Delivered 🎉' : orderStatus}
              </span>
            </p>
          </div>
          <div>
            <p>{Math.round((getStatusStep() / (steps.length - 1)) * 100)}% complete</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:grid lg:grid-cols-[2fr_1fr] shadow m-9 gap-8 p-6">
        {/* Left Column - Order Journey */}
        <div className="mx-8">
          <div className="flex items-center mt-4 mb-6">
            <p className="font-bold text-2xl w-full">Order Journey</p>
          </div>

          {steps.map((step, index) => {
            const completed = isStepCompleted(index);
            const active = isStepActive(index);
            const statusColor = getStatusColor(index);

            return (
              <div key={index} className="flex gap-6 mt-8">
                <div className={`px-3 h-10 flex items-center rounded-full ${statusColor}`}>
                  <FaCheck className={completed || active ? 'text-white' : 'text-gray-400'} />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <p className={`font-bold ${active ? 'text-amber-600' : completed ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {completed && (
                      <p className="text-sm font-bold text-green-600">
                        {getFormattedTime(orderDetail.updatedAt)}
                      </p>
                    )}
                    {active && (
                      <p className="text-sm font-bold text-amber-600">In Progress</p>
                    )}
                  </div>
                  <p className={`text-sm ${completed ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Order Summary & Help */}
        <div>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            {orderDetail.items?.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-gray-500">x{item.quantity}</span>
                </div>
                <span>{currency}{item.totalPrice}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency}{orderDetail.subtotal}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Delivery Fee</span>
                <span>{currency}{orderDetail.deliveryFee}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Tax</span>
                <span>{currency}{orderDetail.tax}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-300 font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-600">{currency}{orderDetail.total}</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-orange-100 rounded-2xl p-6">
            <p className="font-bold text-red-950 mb-2">
              Need help with your order?
            </p>
            <p className="text-sm">
              Our supporter team is available 24/7 if you have any questions or
              need to modify your instructions.
            </p>

            <div className="flex justify-center mt-4">
              <div className="flex gap-3 bg-amber-600 rounded-2xl text-white items-center px-9 py-2 hover:bg-amber-700 cursor-pointer transition-colors">
                <FaPhone />
                <p>Call Us</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mt-4 text-sm text-gray-600">
            <p><span className="font-semibold">Payment Method:</span> {orderDetail.paymentMethod || 'Cash'}</p>
            <p><span className="font-semibold">Table Number:</span> {orderDetail.table || 'N/A'}</p>
            {orderDetail.note && (
              <p><span className="font-semibold">Special Instructions:</span> {orderDetail.note}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;