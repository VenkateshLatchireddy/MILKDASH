import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');

  const handleAuthAction = () => {
    if (isAuthenticated) {
      sessionStorage.removeItem('isAdminAuthenticated');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 px-4 py-4 md:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Admin Panel */}
          <div className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <h2 className="text-white font-bold text-lg md:text-xl tracking-tight">
                <span className="hidden sm:inline">Admin</span> Panel
                <span className="ml-2 text-green-200">⚡</span>
              </h2>
            </div>
          </div>

          {/* Center: Brand Title */}
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                MILK<span className="text-yellow-300">DASH</span>
              </h1>
              <p className="text-green-100 text-xs md:text-sm mt-1 hidden md:block">
                Administrative Dashboard
              </p>
            </div>
          </div>

          {/* Right: Auth Button */}
          <div className="flex items-center">
            <button
              onClick={handleAuthAction}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                isAuthenticated
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-green-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{isAuthenticated ? 'Admin Session Active' : 'Session Inactive'}</span>
          </div>
          <div className="hidden md:block">
            <span>📊 Real-time Analytics • 🔒 Secure Access</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;