import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderStatus.css';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar.jsx';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar.jsx';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  // Fetch accepted orders from backend
  useEffect(() => {
    axios.get("https://milkdash.onrender.com/accepted-orders")
      .then(response => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      })
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  // Get button color based on status
  const getStatusClass = (status) => {
    switch (status) {
      case "Order In Progress":
        return "order-in-progress";
      case "Order Confirmed":
        return "confirmed";
      case "Out for Delivery":
        return "out-for-delivery";
      case "Order Delivered":
        return "delivered";
      default:
        return "";
    }
  };

  // Update order progress
  const handleProgressUpdate = (order_id, currentStatus) => {
    const statusOptions = ["Order Confirmed", "Out for Delivery", "Order Delivered"];
    const nextStatusIndex = statusOptions.indexOf(currentStatus) + 1;

    if (nextStatusIndex < statusOptions.length) {
        const newStatus = statusOptions[nextStatusIndex];

        axios.put("https://milkdash.onrender.com/orders/progress", { order_id, order_progress: newStatus })
            .then(() => {
                setOrders(orders.map(order =>
                    order.order_id === order_id
                        ? { 
                            ...order, 
                            order_progress: newStatus,
                            delivered_time: newStatus === 'Order Delivered' 
                                ? new Date().toISOString() 
                                : order.delivered_time 
                          }
                        : order
                ));
                
            })
            
            .catch(error => {
                console.error("Error updating order progress:", error);
            });
    }
};
const handleFetchLocation = (customerAddress) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        // Construct Google Maps directions URL
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${encodeURIComponent(customerAddress)}`;
        
        // Open Google Maps in a new tab
        window.open(googleMapsUrl, "_blank");
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to get your current location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};


return (
    <div>
      <AdminNavbar />
      <div className='wrapper-container'>
        <div className='sidebar-container'>
          <AdminSidebar />
        </div>
        <div className='main-orders-container'>
          <h1>ORDER STATUS</h1>
          <div className="orders-container">
            <table>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>CONTACT</th>
                  <th>ADDRESS</th>
                  <th>PRODUCT NAME</th>
                  <th>DATE</th>
                  <th>QUANTITY</th>
                  <th>ORDER STATUS</th>
                </tr>
              </thead>
              <tbody>
  {orders.map(order => (
    <tr key={order.order_id}>
      <td>{order.order_id}</td>
      <td>{order.id}</td>
      <td>{order.name}</td>
      <td>{order.contactnumber}</td>
      <td>{order.deliveryaddress}</td>
      <td>{order.productname}</td>
      <td>
        {new Date(order.date).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}
      </td>
      <td>{order.quantity}</td>
      <td>
        <button
          className={`progress-btn ${getStatusClass(order.order_progress)}`}
          onClick={() => handleProgressUpdate(order.order_id, order.order_progress)}
          disabled={order.order_progress === "Order Delivered"}
        >
          {order.order_progress}
        </button>
      </td>
      <td>
        <button
          className="fetch-location-btn"
          onClick={() => handleFetchLocation(order.deliveryaddress)}
        >
          Fetch Location
        </button>
      </td>
    </tr>
  ))}
  {orders.length === 0 && <tr><td colSpan="9">No accepted orders</td></tr>}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
