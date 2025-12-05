import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../config";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");
  const name = queryParams.get("name");
  const phone = queryParams.get("phone");
  const email = queryParams.get("email");
  const productname = queryParams.get("productname");
  const quantity = queryParams.get("quantity");
  const deliveryaddress = queryParams.get("deliveryaddress");

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const userId = sessionStorage.getItem("userId");

  const handleOrderPlacement = async () => {
    setLoading(true);
    setErrorMessage("");

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

      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);

      if (response.status === 201) {
        setOrderPlaced(true);
        setTimeout(() => {
          navigate("/");
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
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center font-sans">
      {/* Header */}
      <div className="w-full max-w-lg mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">MILKDASH</h1>
        <p className="text-gray-600 mt-1">We Provide Milk Home Delivery</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Order Details</h2>
        
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-lg font-semibold text-gray-800">{phone}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <p className="text-lg font-semibold text-gray-800">{email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Product</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{productname}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
              <p className="text-lg font-semibold text-gray-800">{quantity}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Amount</p>
            <p className="text-2xl font-bold text-green-600">₹{amount}.00</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Delivery Address</p>
            <p className="text-lg font-semibold text-gray-800">{deliveryaddress}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={handleOrderPlacement}
            disabled={loading}
            className={`py-3 px-6 rounded-lg font-medium text-white transition duration-300 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="py-3 px-6 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">Your order has been successfully placed.</p>
              <button
                onClick={handleOk}
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;