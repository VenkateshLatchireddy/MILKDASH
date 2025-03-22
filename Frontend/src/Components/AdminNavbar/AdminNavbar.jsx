import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

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
    <nav className="admin-navbar">
      <div className="admin-nav-logo"> 
        <h2>Admin Panel</h2>
      </div>
      <div className="admin-nav-title">
        <h1>MILKDASH</h1>
      </div>
      <div className="admin-nav-actions">
        <button className="admin-nav-button" onClick={handleAuthAction}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;