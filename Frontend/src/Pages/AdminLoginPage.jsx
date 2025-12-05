import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const ADMIN_EMAIL = 'milkdash@gmail.com';
  const ADMIN_PASSWORD = 'milkdash';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin-home', { replace: true });
    } else {
      alert('Invalid admin credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back Button - Top Left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Brand Header - Reduced size */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold text-gray-800">
            MILK<span className="text-green-600">DASH</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
        </div>

        {/* Login Card - Reduced padding */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Card Header - Reduced padding */}
          <div className="bg-green-600 p-2 text-center">
            <h2 className="text-base font-bold text-white">Admin Access</h2>
            <p className="text-green-100 text-xs mt-0.5">Secure administrative login</p>
          </div>

          {/* Login Form - Reduced padding and spacing */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Field - Reduced height */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="milkdash@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field - Reduced height */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Demo Credentials - Reduced size */}
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Email:</span>
                    <div className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-700 mt-0.5">
                      {ADMIN_EMAIL}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Password:</span>
                    <div className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-700 mt-0.5">
                      {ADMIN_PASSWORD}
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Button - Reduced height */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            {/* Security Note - Reduced size */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Restricted access only. Activities are monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Reduced size */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            © 2024 MILKDASH • Admin System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;