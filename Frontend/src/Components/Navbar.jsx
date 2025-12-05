import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

// Icons - make sure these paths are correct
import homeicon from "./Assets/home-128.webp";
import loginicon from "./Assets/login.webp";
import profileicon from "./Assets/profile.webp";
import logouticon from "./Assets/logout.webp";
import adminicon from "./Assets/admin-icon.png"; // Add this icon or use any other

// Define products with correct paths
const products = [
  { name: "Badam Milk", path: "/badammilk" },
  { name: "Buffalo Milk", path: "/buffalomilk" },
  { name: "Paneer", path: "/paneer" },
  { name: "Cow Milk", path: "/cowmilk" },
  { name: "Pot Curd", path: "/potcurd" }
];

// Configure Fuse.js for fuzzy searching
const fuse = new Fuse(products, {
  keys: ["name"],
  threshold: 0.3,
  includeScore: true,
});

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const isAdmin = sessionStorage.getItem("isAdmin") === "true"; // Check if admin

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    setIsMenuOpen(false); // Close menu after logout
  };

  const handleProfileClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login");
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const results = fuse.search(query);
    setSuggestions(results.map((result) => result.item));
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setSuggestions([]);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const results = fuse.search(searchQuery);

    if (results.length > 0) {
      navigate(results[0].item.path);
    } else {
      alert("No results found");
    }

    setSearchQuery("");
    setSuggestions([]);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu function
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 backdrop-blur-sm shadow-lg w-full sticky top-0 z-50">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center w-full px-4 md:px-8 py-3 font-sans text-white">
        
        {/* Home Link */}
        <div className="flex-1 text-center hover:scale-110 transition-transform duration-300">
          <Link to="/" className="flex items-center justify-center gap-2 no-underline group">
            <img 
              src={homeicon} 
              alt="home" 
              className="w-7 h-7 bg-white rounded-md p-1 group-hover:scale-125 transition-transform duration-200"
            />
            <span className="font-medium text-white text-shadow-lg shadow-black/50">Home</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative text-center">
          <form onSubmit={handleSearchSubmit} className="relative inline-block w-full max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 shadow-sm"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {suggestions.map((product) => (
                  <li
                    key={product.name}
                    onClick={() => handleSuggestionClick(product.path)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* Title */}
        <div className="flex-2 text-center px-4">
          <Link to="/about" className="no-underline hover:opacity-90 transition-opacity">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                MILK<span className="text-yellow-300">DASH</span>
              </h1>
          </Link>
        </div>

        {/* All Buttons in one container */}
        <div className="flex-1 flex justify-end gap-3 items-center">
          {/* Contact Button */}
          <Link to="/contact" className="no-underline">
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white text-shadow-lg shadow-black/50 hover:shadow-md font-medium min-w-[120px] h-[44px]">
              Contact
            </button>
          </Link>
          
          {/* Admin Login Button */}
          {!isAdmin && (
            <button
              onClick={handleAdminLogin}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white text-shadow-lg shadow-black/50 hover:shadow-md font-medium min-w-[140px] h-[44px]"
            >
              <img 
                src={adminicon} 
                alt="admin" 
                className="w-6 h-6 bg-white rounded-md p-1"
              />
              Admin Login
            </button>
          )}
          
          {/* Profile Button */}
          <button
            onClick={handleProfileClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white text-shadow-lg shadow-black/50 hover:shadow-md font-medium min-w-[120px] h-[44px]"
          >
            <img 
              src={profileicon} 
              alt="profile" 
              className="w-6 h-6 bg-white rounded-md p-1"
            />
            Profile
          </button>
          
          {/* Login/Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-red-600 hover:text-white transition-all duration-300 text-white text-shadow-lg shadow-black/50 hover:shadow-md font-medium min-w-[120px] h-[44px]"
            >
              <img 
                src={logouticon} 
                alt="logout" 
                className="w-6 h-6 bg-white rounded-md p-1"
              />
              Logout
            </button>
          ) : (
            <Link to="/login" className="no-underline">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white text-shadow-lg shadow-black/50 hover:shadow-md font-medium min-w-[120px] h-[44px]">
                <img 
                  src={loginicon} 
                  alt="login" 
                  className="w-6 h-6 bg-white rounded-md p-1"
                />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar - SWAPPED POSITIONS */}
      <div className="md:hidden">
        {/* Mobile Header - Always visible - Hamburger on RIGHT, Home on LEFT */}
        <div className="flex justify-between items-center px-4 py-3">
          {/* Home on LEFT side */}
          <Link to="/" className="p-2 hover:opacity-80 transition-opacity">
            <img 
              src={homeicon} 
              alt="home" 
              className="w-6 h-6 bg-white rounded-md p-1"
            />
          </Link>
          
          {/* Title in center */}
          <Link to="/about" className="text-center no-underline flex-1 mx-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-md">MILKDASH</h1>
          </Link>
          
          {/* Hamburger on RIGHT side */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors flex flex-col justify-center items-center"
            aria-label="Toggle menu"
          >
            {/* Animated hamburger icon */}
            <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMenuOpen && (
          <div className="px-4 pb-6 bg-gradient-to-b from-green-800/95 to-emerald-800/95 backdrop-blur-sm shadow-xl animate-slideDown">
            {/* Search in mobile */}
            <div className="mb-6">
              <form onSubmit={(e) => {
                handleSearchSubmit(e);
                closeMenu();
              }} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 text-base"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((product) => (
                      <li
                        key={product.name}
                        onClick={() => {
                          handleSuggestionClick(product.path);
                          closeMenu();
                        }}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 active:bg-gray-200"
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            {/* All Mobile Buttons */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Contact Button for Mobile */}
              <Link 
                to="/contact" 
                onClick={closeMenu}
                className="w-full no-underline"
              >
                <button className="flex items-center justify-center w-full px-4 py-4 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white hover:shadow-md text-base font-medium">
                  Contact
                </button>
              </Link>
              
              {/* Admin Login Button for Mobile */}
              {!isAdmin && (
                <button
                  onClick={() => {
                    handleAdminLogin();
                    closeMenu();
                  }}
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white hover:shadow-md text-base font-medium"
                >
                  <img 
                    src={adminicon} 
                    alt="admin" 
                    className="w-7 h-7 bg-white rounded-md p-1"
                  />
                  Admin Login
                </button>
              )}
              
              {/* Profile Button */}
              <button
                onClick={() => {
                  handleProfileClick();
                  closeMenu();
                }}
                className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white hover:shadow-md text-base font-medium"
              >
                <img 
                  src={profileicon} 
                  alt="profile" 
                  className="w-7 h-7 bg-white rounded-md p-1"
                />
                Profile
              </button>
              
              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-lg border border-white/30 hover:bg-red-600 hover:text-white transition-all duration-300 text-white hover:shadow-md text-base font-medium"
                >
                  <img 
                    src={logouticon} 
                    alt="logout" 
                    className="w-7 h-7 bg-white rounded-md p-1"
                  />
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={closeMenu} className="w-full no-underline">
                  <button className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-lg border border-white/30 hover:bg-green-700 hover:text-white transition-all duration-300 text-white hover:shadow-md text-base font-medium">
                    <img 
                      src={loginicon} 
                      alt="login" 
                      className="w-7 h-7 bg-white rounded-md p-1"
                    />
                    Login
                  </button>
                </Link>
              )}
            </div>

            {/* Caption */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-white font-semibold text-lg">
                We Provide Milk Home Delivery
              </p>
              <p className="text-white text-sm mt-2">
                Fresh milk delivered to your doorstep
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Global styles for animation */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        /* Hide scrollbar for suggestions dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;    
        }
      `}</style>
    </nav>
  );
};

export default Navbar;