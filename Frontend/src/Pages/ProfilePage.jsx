import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle, 
  User, 
  Phone, 
  Mail, 
  Home,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await axios.get(`${API_BASE_URL}/api/profile/${userId}`);
        setUser(userResponse.data);
        
        // Fetch all user orders
        const ordersResponse = await axios.get(`${API_BASE_URL}/api/orders/${userId}`);
        // Sort orders by date (newest first)
        const sortedOrders = ordersResponse.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Order Confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Order In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Your Profile
          </h1>
          <p className="text-gray-600 text-center mt-2">
            View your account details and order history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">{user?.name || "Loading..."}</h2>
                <p className="text-gray-500">Customer</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user?.email || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-gray-800">{user?.contactnumber || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800 break-words">
                      {user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                  </div>
                  <Package className="w-10 h-10 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Orders */}
          <div className="lg:col-span-2">
            {/* Order History Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Order History
                  </h3>
                  <p className="text-gray-600 mt-1">All your orders in one place</p>
                </div>
                <button
                  onClick={() => setShowOrders(!showOrders)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-300"
                >
                  {showOrders ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Hide Orders
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show Orders ({orders.length})
                    </>
                  )}
                </button>
              </div>

              {showOrders && (
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                      <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div 
                        key={order.order_id} 
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        {/* Order Header */}
                        <div 
                          className="p-4 bg-gray-50 cursor-pointer"
                          onClick={() => toggleOrderDetails(order.order_id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono font-bold text-gray-800">
                                  Order #{order.order_id}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_progress)}`}>
                                  {order.order_progress}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(order.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="w-4 h-4" />
                                  <span className="capitalize">{order.productname}</span>
                                </div>
                                <div>
                                  <span>Qty: {order.quantity}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              {expandedOrderId === order.order_id ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {expandedOrderId === order.order_id && (
                          <div className="p-4 bg-white border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Delivery Details
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm text-gray-500">Address</p>
                                      <p className="font-medium text-gray-800 flex items-start gap-2 mt-1">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="break-words">{order.deliveryaddress}</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Booking Time</p>
                                      <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {formatDate(order.date)}
                                      </p>
                                    </div>
                                    {order.delivered_time && (
                                      <div>
                                        <p className="text-sm text-gray-500">Delivered Time</p>
                                        <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                          {formatDate(order.delivered_time)}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Product</span>
                                      <span className="font-medium text-gray-800 capitalize">{order.productname}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Quantity</span>
                                      <span className="font-medium text-gray-800">{order.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Order Status</span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_progress)}`}>
                                        {order.order_progress}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Order ID</span>
                                    <span className="font-mono font-bold text-gray-800">#{order.order_id}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h4>
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Summary when orders are hidden */}
              {!showOrders && orders.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-600 text-center">
                    Click "Show Orders" to view your {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
            
            {/* Orders Summary Stats */}
            {orders.length > 0 && showOrders && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">Orders Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {orders.filter(o => 
                        o.order_progress === 'Order In Progress' || 
                        o.order_progress === 'Order Confirmed'
                      ).length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Delivered</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {orders.filter(o => o.order_progress === 'Order Delivered').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Out for Delivery</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">
                      {orders.filter(o => o.order_progress === 'Out for Delivery').length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;