import React from 'react'
import {Routes, Route,Navigate} from 'react-router-dom'
import AdminSidebar from "../../Components/AdminSidebar.jsx"
import AdminNavbar from '../../Components/AdminNavbar.jsx'
import AdminLoginPage from '../AdminLoginPage.jsx'

const AdminHomePage = () => {
  const isAdminAuthenticated = sessionStorage.getItem("isAdminAuthenticated");
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div className='home'>
      <AdminNavbar/>
      <AdminSidebar/>
      <Routes>
        <Route path='/admin-login' element={<AdminLoginPage/>}/>
      </Routes>
    </div>
  )
}

export default AdminHomePage