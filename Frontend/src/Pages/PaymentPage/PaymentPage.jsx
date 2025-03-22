import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // To handle the success popup
  const [errorMessage, setErrorMessage] = useState(""); // To show error messages

  // Accessing query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");
  const name = queryParams.get("name");
  const phone = queryParams.get("phone");
  const email = queryParams.get("email");
  const productname = queryParams.get("productname"); // Ensure this is being correctly passed
  const quantity = queryParams.get("quantity"); // Ensure this is being correctly passed
  const deliveryaddress = queryParams.get("deliveryaddress");

  const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date for order
  const userId = sessionStorage.getItem("userId")
  const handleOrderPlacement = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message on each attempt

    try {
      const orderData = {
        id: userId,
        name,
        contactnumber: phone,
        productname,
        quantity: parseInt(quantity),
        deliveryaddress,
        date,
      };

      const response = await axios.post("https://milkdash.onrender.com/api/orders", orderData);

      if (response.status === 201) {
        setOrderPlaced(true); // Show success popup if order is placed successfully
        setTimeout(() => {
          navigate("/"); // Navigate to home after 2 seconds (optional delay)
        }, 2000);
      } else {
        setErrorMessage("Order placement failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Order placement failed. Please try again.");
    }
    setLoading(false);
  };

  const handleOk = () => {
    // After clicking OK, navigate to the home page
    navigate("/");
  };

  return (
    <div className="payment-container">
      <h2>Order Details</h2>
      <div className="payment-details">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Product:</strong> {productname}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Amount:</strong> ₹{amount}</p>
        <p><strong>Delivery Address:</strong> {deliveryaddress}</p>
      </div>

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="payment-buttons">
        <button onClick={handleOrderPlacement} disabled={loading} className="pay-button">
          {loading ? "Processing..." : "Place Order"}
        </button>
        <button onClick={() => navigate(-1)} className="cancel-button">Cancel</button>
      </div>

      {/* Success Popup */}
      {orderPlaced && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Order Placed Successfully!</h3>
            <p>Your order has been successfully placed.</p>
            <button onClick={handleOk} className="ok-button">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;