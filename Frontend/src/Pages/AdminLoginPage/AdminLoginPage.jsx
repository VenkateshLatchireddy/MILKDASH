import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const ADMIN_EMAIL = 'milkdash@gmail.com';
  const ADMIN_PASSWORD = 'milkdash';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      alert('Admin login successful!');
      navigate('/admin-home', { replace: true });
    } else {
      alert('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Admin Email"
              value={formData.email}
              onChange={handleChange}
              className="admin-form-input"
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="admin-form-input"
              required
            />
          </div>
          <button type="submit" className="admin-login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
