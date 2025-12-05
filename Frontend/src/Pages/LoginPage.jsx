import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Mail, Lock, User, Phone, CheckCircle, ArrowLeft } from 'lucide-react';

const AuthForm = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    emailOrContact: "",
    password: "",
    contactnumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Clear error on change

    // validations
    if (name === "name" && !/^[A-Za-z ]*$/.test(value)) return;
    if (name === "contactnumber" && !/^\d{0,10}$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistered) {
        // LOGIN
        const response = await axios.post(`${API_BASE_URL}/login`, {
          emailOrContact: formData.emailOrContact,
          password: formData.password,
        });

        if (response.status === 200) {
          const userId = response.data.userId;
          const sessionExpiry = Date.now() + 30 * 60 * 1000;

          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("sessionExpiry", sessionExpiry.toString());
          
          // Show success message
          setShowSuccess(true);
          
          // Auto-redirect after 1.5 seconds
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        // REGISTER
        const response = await axios.post(`${API_BASE_URL}/signup`, {
          name: formData.name,
          email: formData.emailOrContact,
          contactnumber: formData.contactnumber,
          password: formData.password,
          address: "",
        });

        // Show success message for registration
        setShowSuccess(true);
        
        // Switch to login after 1.5 seconds
        setTimeout(() => {
          setIsRegistered(true);
          setShowSuccess(false);
          setFormData({
            name: "",
            emailOrContact: "",
            password: "",
            contactnumber: "",
          });
        }, 1500);
      }
    } catch (err) {
      console.error("Full error:", err);

      if (err.response?.data?.message) {
        const msg = err.response.data.message;

        if (msg.includes("Duplicate entry") && msg.includes("users.email")) {
          setError("This email is already registered. Please use another email.");
        } else if (msg.includes("Duplicate entry") && msg.includes("users.contactnumber")) {
          setError("This mobile number is already used. Please use another number.");
        } else {
          setError(msg);
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Back Button - Top Left */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                {isRegistered ? "Login Successful!" : "Registration Successful!"}
              </h3>
              <p className="text-sm text-gray-600">
                {isRegistered 
                  ? "Redirecting to home page..." 
                  : "Account created! Switching to login..."
                }
              </p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-green-600 h-1 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          
          {/* Header - Reduced size */}
          <div className="p-4 border-b border-gray-100 text-center">
            <h1 className="text-lg font-bold text-gray-800">
              MILK<span className="text-green-600">DASH</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isRegistered ? "User Login" : "Create Account"}
            </p>
          </div>

          {/* Form - Reduced padding */}
          <div className="p-4">
            {/* Error Message - Reduced size */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Name Field - Reduced size */}
              {!isRegistered && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {/* Contact Field - Reduced size */}
              {!isRegistered && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactnumber"
                    placeholder="10-digit mobile number"
                    value={formData.contactnumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    required
                    maxLength="10"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email/Contact Field - Reduced size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {isRegistered ? "Email or Phone" : "Email Address"}
                </label>
                <input
                  type="text"
                  name="emailOrContact"
                  placeholder={isRegistered ? "you@example.com or phone" : "you@example.com"}
                  value={formData.emailOrContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field - Reduced size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  required
                  disabled={loading}
                />
                {!isRegistered && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Submit Button - Reduced size */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegistered ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  isRegistered ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            {/* Toggle - Reduced size */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-center text-xs text-gray-600">
                {isRegistered ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsRegistered(!isRegistered);
                    setFormData({
                      name: "",
                      emailOrContact: "",
                      password: "",
                      contactnumber: "",
                    });
                    setError("");
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {isRegistered ? "Register" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Simple Footer - Reduced size */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms
          </p>
        </div>
      </div>

      {/* Add CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthForm;