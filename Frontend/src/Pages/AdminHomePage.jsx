import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from "../Components/AdminSidebar.jsx"
import AdminNavbar from '../Components/AdminNavbar.jsx'
import AdminLoginPage from './AdminLoginPage.jsx'

const AdminHomePage = () => {
  const isAdminAuthenticated = sessionStorage.getItem("isAdminAuthenticated");
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path='/admin-login' element={<AdminLoginPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage