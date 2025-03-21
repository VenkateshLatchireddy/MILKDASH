import React from 'react';
import milksphlash from './Components/Assets/milksphlash.mp4';
import './App.css';
import { Routes, Route ,Navigate,useLocation} from 'react-router-dom';

import HomePage from './Pages/Home/HomePage.jsx';
import AboutPage from './Pages/AboutUs/AboutPage.jsx';
import ContactPage from './Pages/ContactUs/ContactPage.jsx';
import LoginPage from './Pages/Login/LoginPage.jsx';
import ProfilePage from './Pages/Profile/ProfilePage.jsx';
import BuffaloMilkPage from './Pages/ProductPages/BuffaloMilkPage.jsx';
import CowMilkPage from './Pages/ProductPages/CowMilkPage.jsx';
import PaneerPage from './Pages/ProductPages/PaneerPage.jsx';
import BadamMilkPage from './Pages/ProductPages/BadamMilkPage.jsx';
import PotCurdPage from './Pages/ProductPages/PotCurd.jsx';
import Terms from './Pages/Terms&Conditions/Terms.jsx';
import Footer from './Components/Footer/Footer.jsx';
import ScrollToTop from './Pages/ScrollToTop.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import PaymentPage from './Pages/PaymentPage/PaymentPage.jsx';

import AdminLoginPage from './Pages/AdminLoginPage/AdminLoginPage.jsx';
import AdminHomePage from './Pages/AdminHome/AdminHomePage.jsx';
import UpdatePrice from './Pages/UpdatePrice/UpdatePrice.jsx';
import UpdateStocks from './Pages/UpdateStocks/UpdateStocks.jsx';
import OrderStatus from './Pages/OrderStatus/OrderStatus.jsx';
import ViewCustomers from './Pages/ViewCustomers/ViewCustomers.jsx';
import DeliveryTracking from './Pages/LocationPage/LocationPage.jsx';


const ProtectedRoute = ({ element, admin }) => {
  const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  const isUserAuthenticated = sessionStorage.getItem('isUserAuthenticated') === 'true';

  if (admin) {
    return isAdminAuthenticated ? element : <Navigate to="/admin-login" replace />;
  } else {
    return isUserAuthenticated ? element : <Navigate to="/login" replace />;
  }
};
const App = () => {
  const location = useLocation();

  // List of admin routes
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div>
      <div className='main-container'>
        <video className='bg-video' src={milksphlash} autoPlay muted loop playsInline />
        <div className='content'>
          <ScrollToTop />
          
          {!isAdminPage && <Navbar />}  {/* Hide Navbar on Admin pages */}

          <Routes>
  {/* User Pages */}
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/buffalomilk" element={<BuffaloMilkPage />} />
  <Route path="/cowmilk" element={<CowMilkPage />} />
  <Route path="/paneer" element={<PaneerPage />} />
  <Route path="/badammilk" element={<BadamMilkPage />} />
  <Route path="/potcurd" element={<PotCurdPage />} />
  <Route path="/terms" element={<Terms />} />


  {/* Admin Pages */}
  <Route path="/admin-login" element={<AdminLoginPage />} />
  <Route path="/admin-home" element={<ProtectedRoute element={<AdminHomePage />} admin={true} />} />
  <Route path="/admin-updateprice" element={<ProtectedRoute element={<UpdatePrice />} admin={true} />} />
  <Route path="/admin-updatestocks" element={<ProtectedRoute element={<UpdateStocks />} admin={true} />} />
  <Route path="/admin-viewcustomers" element={<ProtectedRoute element={<ViewCustomers />} admin={true} />} />
  <Route path="/admin-orderstatus" element={<ProtectedRoute element={<OrderStatus />} admin={true} />} />
  <Route path="/admin-location" element={<ProtectedRoute element={<DeliveryTracking />} admin={true} />} />
</Routes>


          {!isAdminPage && <Footer />}  {/* Hide Footer on Admin pages */}
        </div>
      </div>
    </div>
  );
}

export default App;
