import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/profile/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user profile:", error));

    axios.get(`${API_BASE_URL}/api/orders/${userId}`)
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Profile Details Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Profile Details</h2>
          {user && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Contact Number</p>
                  <p className="text-lg font-semibold text-gray-800">{user.contactnumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user.address}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300"
              onClick={() => setShowOrders(!showOrders)}
            >
              {showOrders ? "Hide Order Details" : "Show Order Details"}
            </button>
          </div>
        </div>

        {/* Order Details Section */}
        <div className={`transition-all duration-300 ${showOrders ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
            </div>
            
            {orders.length > 0 ? (
              orders.slice(0, 1).map((order) => ( // Show only the most recent order
                <div key={order.order_id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Product Name</p>
                      <p className="font-semibold text-gray-800 capitalize">{order.productname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Booking Time</p>
                      <p className="font-semibold text-gray-800">
                        {order.date && !isNaN(new Date(order.date))
                          ? new Date(order.date).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                          : "Invalid Date"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Delivered Time</p>
                    <p className="font-semibold text-gray-800">
                      {order.delivered_time 
                        ? new Date(order.delivered_time).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "Not Delivered Yet"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
                      <p className="font-semibold text-gray-800">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
                      <p className="font-semibold text-gray-800">{order.order_id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Delivery Address</p>
                      <p className="font-semibold text-gray-800">{order.deliveryaddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Progress</p>
                      <p className="font-semibold text-gray-800 capitalize">{order.order_progress}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-4">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;