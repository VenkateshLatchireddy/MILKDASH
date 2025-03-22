import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profile/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user profile:", error));

      axios.get(`http://localhost:5000/api/orders/${userId}`)
      .then((response) => {
        console.log("Raw orders data:", response.data); // Debugging: Check the raw data
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, [userId]);

  return (
    <div>
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Details Card */}
          <div className="profile-card">
            <h2>Profile Details</h2>
            {user && (
              <div className="profile-details">
                <div className="profile-row">
                  <div className="profile-column">
                    <p className="label">Name</p>
                    <p className="value">{user.name}</p>
                  </div>
                  <div className="profile-column">
                    <p className="label">Email</p>
                    <p className="value">{user.email}</p>
                  </div>
                </div>
                <div className="profile-row">
                  <div className="profile-column">
                    <p className="label">Contact Number</p>
                    <p className="value">{user.contactnumber}</p>
                  </div>
                  <div className="profile-column">
                    <p className="label">Address</p>
                    <p className="value">{user.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details Toggle Button inside Profile Card */}
            <div className="order-details-toggle">
              <button onClick={() => setShowOrders(!showOrders)}>
                {showOrders ? "Hide Order Details" : "Show Order Details"}
              </button>
            </div>
          </div>

          {/* Order Details Container */}
          <div className={`orders-container ${showOrders ? "visible" : "hidden"}`}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-row">
                    <p><strong>Product Name:</strong> {order.productname}</p>
                    <p>
  <strong>Booking Time:</strong>{" "}
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
                    <p>
                      <strong>Delivered Time:</strong>{" "}
                      {order.delivered_time && !isNaN(new Date(order.delivered_time))
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
                  <div className="order-row">
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                  </div>
                  <div className="order-row">
                    <p><strong>Delivery Address:</strong> {order.deliveryaddress}</p>
                    <p><strong>Progress:</strong> {order.order_progress}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;