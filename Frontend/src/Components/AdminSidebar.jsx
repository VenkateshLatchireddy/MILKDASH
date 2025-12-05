import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { BarChart3, DollarSign, Package, Users } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/admin-orderstatus',
      icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />,
      label: 'Order Status',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      path: '/admin-updateprice',
      icon: <DollarSign className="w-5 h-5 md:w-6 md:h-6" />,
      label: 'Update Price',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      path: '/admin-updatestocks',
      icon: <Package className="w-5 h-5 md:w-6 md:h-6" />,
      label: 'Update Stocks',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      path: '/admin-viewcustomers',
      icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
      label: 'View Customers',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full max-w-[250px] h-screen sticky top-0 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full p-4 md:p-6">
        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="block no-underline"
            >
              <div className={`
                group flex items-center gap-3 p-3 md:p-4 
                rounded-xl transition-all duration-300 
                ${isActive(item.path) 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                  : `hover:bg-gray-50 hover:shadow-sm`
                }
              `}>
                {/* Icon Container */}
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${isActive(item.path) 
                    ? 'bg-white/20' 
                    : `bg-gray-100 ${item.iconColor}`
                  }
                `}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className={`
                  font-medium transition-all duration-300
                  ${isActive(item.path) 
                    ? 'text-white font-semibold' 
                    : 'text-gray-700 group-hover:text-gray-900'
                  }
                `}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Status - Optional, remove if not needed */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600">Connected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar;