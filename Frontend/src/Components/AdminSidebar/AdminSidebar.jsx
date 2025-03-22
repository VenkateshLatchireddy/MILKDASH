import React from 'react'
import './AdminSidebar.css'
import {Link} from 'react-router-dom'
import UpdatePriceImg from '../../Components/Assets/updateprice.png';
import  UpdateStocksImg from '../../Components/Assets/updatestock.png';
import ViewCustomersImg from '../../Components/Assets/viewcustomer.png';
import OrderStatusImg from '../../Components/Assets/order status.png';

const Sidebar = () => {
  return (
    <div className='sidebar-container'>
    <div className='sidebar'>
        <Link to={'/admin-orderstatus'}>
            <div className='sidebar-item'>
                <img src={OrderStatusImg} alt="OrderStatus" className='sidebar-icons' />
                <p>Order Status</p>
            </div>
       </Link>
       <Link to={'/admin-updateprice'}>
        <div className='sidebar-item'>
            <img src={UpdatePriceImg} alt="UpdatePrice" className='sidebar-icons'/>
        <p>Update Price</p>
        </div>
       </Link>
       <Link to={'/admin-updatestocks'}>
        <div className='sidebar-item'>
            <img src={UpdateStocksImg} alt="UpdateStocks" className='sidebar-icons'/>
            <p>Update Stocks</p>
        </div>
       </Link>
       <Link to={'/admin-viewcustomers'}>
        <div className='sidebar-item'>
            <img src={ViewCustomersImg} alt="ViewCustomers" className='sidebar-icons' />
            <p>View Customers</p>
        </div>
       </Link>
    </div>
    </div>
  )
}

export default Sidebar