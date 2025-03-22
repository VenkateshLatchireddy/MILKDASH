import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js"; // Import Fuse.js
import "./Navbar.css";
import homeicon from "../Assets/home-128.webp";
import loginicon from "../Assets/login.webp";
import profileicon from "../Assets/profile.webp";
import logouticon from "../Assets/logout.webp";

// Define products with correct paths
const products = [
  { name: "Badam Milk", path: "/badammilk" },
  { name: "Buffalo Milk", path: "/buffalomilk" },
  { name: "Paneer", path: "/paneer" },
  { name: "Cow Milk", path: "/cowmilk" },
  {name: "Pot Curd", path: "/potcurd"}
];

// Configure Fuse.js for fuzzy searching
const fuse = new Fuse(products, {
  keys: ["name"], // Search by product name
  threshold: 0.3, // Lower threshold means stricter matching
  includeScore: true,
});

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Use Fuse.js to find fuzzy matches
    const results = fuse.search(query);
    setSuggestions(results.map((result) => result.item));
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setSuggestions([]);
  };

  // Handle search submission (Enter key)
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
  };
return (
    <div className="nav-container">
      <div className="nav-home">
        <Link to={"/"} className="nav-link">
          <img src={homeicon} alt="home icon" className="navicon" />
          Home
        </Link>
      </div>

      <div className="nav-search">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((product) => (
                <li key={product.name} onClick={() => handleSuggestionClick(product.path)}>
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <div className="nav-title">
        <Link to={"/about"}>
          <p className="title-heading">MILKDASH</p>
          <p className="title-caption">We Provide Milk Home Delivery</p>
        </Link>
      </div>

      <div className="nav-contact">
        <Link to={"/contact"}>
          WhatsApp: 8142244668 <br /> Email: milkdash@gmail.com
        </Link>
      </div>

      <div className="nav-buttons">
        <button onClick={handleProfileClick} >
          <img src={profileicon} alt="profile icon" className="navicon" />
          Profile
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout}>
            <img src={logouticon} alt="logout icon" className="navicon" />
            Logout
          </button>
        ) : (
          <Link to={"/login"} className="nav-button">
            <button>
              <img src={loginicon} alt="login icon" className="navicon" />
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
