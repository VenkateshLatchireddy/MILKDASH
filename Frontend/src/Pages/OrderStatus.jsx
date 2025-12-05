import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Components/AdminNavbar.jsx';
import AdminSidebar from '../Components/AdminSidebar.jsx';
import API_BASE_URL from "../config.js";
import { MapPin, Navigation, Package, User, Phone, Calendar, Clock, Truck, CheckCircle, RefreshCw } from 'lucide-react';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch non-delivered orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching pending orders...');
      
      const response = await axios.get(`${API_BASE_URL}/accepted-orders`, {
        timeout: 10000
      });
      
      console.log('✅ Response received:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Sort by date (newest first)
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        console.log(`✅ Loaded ${sortedOrders.length} pending orders`);
        setOrders(sortedOrders);
        setError(null);
      } else {
        console.error('❌ Invalid data format:', response.data);
        setError('Invalid data received from server');
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      
      // Detailed error handling
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Backend is slow to respond.');
      } else if (error.response) {
        // Server error
        const { status, data } = error.response;
        if (status === 500) {
          setError(`Backend error (500): ${data?.message || data?.details || 'Error fetching orders'}`);
        } else {
          setError(`Server error ${status}: ${data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        setError('Cannot connect to backend. Make sure server is running.');
      } else {
        setError(`Network error: ${error.message}`);
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Optional: Auto-refresh every 60 seconds
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update order progress
  const handleProgressUpdate = async (order_id, currentStatus) => {
    // Define progression
    let nextStatus;
    if (currentStatus === "Order In Progress" || currentStatus === "Order Confirmed") {
      nextStatus = "Out for Delivery";
    } else if (currentStatus === "Out for Delivery") {
      nextStatus = "Order Delivered";
    } else {
      alert("Cannot update this order status.");
      return;
    }

    try {
      setUpdatingOrderId(order_id);
      console.log(`🔄 Updating order ${order_id}: ${currentStatus} → ${nextStatus}`);
      
      // Use the PUT endpoint for updating order progress
      const response = await axios.put(`${API_BASE_URL}/orders/progress`, {
        order_id: order_id,
        order_progress: nextStatus
      });

      if (response.status === 200) {
        // If order is delivered, remove from list
        if (nextStatus === "Order Delivered") {
          alert(`✅ Order #${order_id} marked as DELIVERED!\nIt will be removed from this list.`);
          // Remove from local state
          setOrders(orders.filter(order => order.order_id !== order_id));
        } else {
          // Update status locally
          setOrders(orders.map(order =>
            order.order_id === order_id
              ? { ...order, order_progress: nextStatus }
              : order
          ));
          alert(`✅ Order #${order_id} updated to: ${nextStatus}`);
        }
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      alert(`❌ Failed to update order: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Alternative: Use the route parameter endpoint if preferred
  const handleProgressUpdateAlternative = async (order_id, currentStatus) => {
    let nextStatus;
    if (currentStatus === "Order In Progress" || currentStatus === "Order Confirmed") {
      nextStatus = "Out for Delivery";
    } else if (currentStatus === "Out for Delivery") {
      nextStatus = "Order Delivered";
    } else {
      alert("Cannot update this order status.");
      return;
    }

    try {
      setUpdatingOrderId(order_id);
      // You can also use this endpoint: /orders/:id/progress
      const response = await axios.put(`${API_BASE_URL}/orders/${order_id}/progress`, {
        progress: nextStatus
      });

      if (response.status === 200) {
        if (nextStatus === "Order Delivered") {
          alert(`✅ Order #${order_id} marked as DELIVERED!`);
          setOrders(orders.filter(order => order.order_id !== order_id));
        } else {
          setOrders(orders.map(order =>
            order.order_id === order_id
              ? { ...order, order_progress: nextStatus }
              : order
          ));
          alert(`✅ Order #${order_id} updated to: ${nextStatus}`);
        }
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      alert(`❌ Failed to update order: ${error.response?.data?.error || error.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleFetchLocation = (customerAddress) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${encodeURIComponent(customerAddress)}`;
          window.open(googleMapsUrl, "_blank");
        },
        () => alert("Please enable location services.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // Get status styling
  const getStatusStyles = (status) => {
    const styles = {
      "Order In Progress": "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
      "Order Confirmed": "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
      "Out for Delivery": "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
      "Order Delivered": "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
  };

  // Get button text based on status
  const getButtonText = (status) => {
    if (status === "Order In Progress" || status === "Order Confirmed") {
      return "Mark as Out for Delivery";
    }
    if (status === "Out for Delivery") {
      return "Mark as Delivered";
    }
    return "Update Status";
  };

  // Get next status for display
  const getNextStatus = (status) => {
    if (status === "Order In Progress" || status === "Order Confirmed") {
      return "Out for Delivery";
    }
    if (status === "Out for Delivery") {
      return "Delivered";
    }
    return "";
  };

  // Filter for stats
  const inProgressCount = orders.filter(o => 
    o.order_progress === "Order In Progress" || 
    o.order_progress === "Order Confirmed"
  ).length;
  const outForDeliveryCount = orders.filter(o => 
    o.order_progress === "Out for Delivery"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <div className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Package className="w-7 h-7 text-green-600" />
                  Order Status Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Manage and track order deliveries in real-time</p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Orders'}
              </button>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">⚠️ {error}</p>
                <p className="text-sm text-red-600 mt-1">
                  Endpoint: {API_BASE_URL}/accepted-orders
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Out for Delivery</p>
                  <p className="text-2xl font-bold text-purple-600">{outForDeliveryCount}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Active Orders</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Orders marked as "Delivered" will automatically disappear from this list
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                  <p className="mt-2 text-gray-500">Loading pending orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending orders!</p>
                  <p className="text-sm text-gray-400 mt-1">All orders are delivered or no active orders</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-mono font-semibold text-gray-800">#{order.order_id}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-700 block">{order.name}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{order.contactnumber}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 truncate max-w-xs flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            {order.deliveryaddress}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-700 capitalize">{order.productname}</div>
                          <div className="text-sm text-gray-500">Quantity: {order.quantity}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(order.date).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${getStatusStyles(order.order_progress)}`}>
                              {order.order_progress}
                            </span>
                            <button
                              onClick={() => handleProgressUpdate(order.order_id, order.order_progress)}
                              disabled={updatingOrderId === order.order_id}
                              className={`
                                px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200
                                ${order.order_progress === "Out for Delivery" 
                                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
                                  : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                                }
                                ${updatingOrderId === order.order_id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                              `}
                            >
                              {updatingOrderId === order.order_id ? (
                                <span className="flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  Updating...
                                </span>
                              ) : (
                                `Mark as ${getNextStatus(order.order_progress)}`
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleFetchLocation(order.deliveryaddress)}
                              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                            >
                              <Navigation className="w-4 h-4" />
                              Get Directions
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Auto-refresh every 60s • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;