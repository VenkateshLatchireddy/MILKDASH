import React from "react";
import { Link } from "react-router-dom";

// Icons
import FacebookIcon from "./Assets/Facebook.webp";
import WhatsappIcon from "./Assets/whatsapp.webp";
import InstagramIcon from "./Assets/instagram.webp";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          
          {/* Brand & Info */}
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400 tracking-wide">
                MILKDASH
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mt-2">
                We Provide Milk Home Delivery
              </p>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base italic leading-relaxed">
              Start Your Day the Fresh Way, Delivered to Your Door with Love!
            </p>
            
            <div className="space-y-2 sm:space-y-3 pt-2">
              <Link 
                to="/about" 
                className="block text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 text-sm sm:text-base"
              >
                About Us
              </Link>
              <Link 
                to="/terms" 
                className="block text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 text-sm sm:text-base"
              >
                Terms and Policies
              </Link>
              <Link 
                to="/admin-login" 
                className="block text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 text-sm sm:text-base"
              >
                Login AS Admin
              </Link>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold uppercase text-white tracking-wider pb-2 border-b-2 border-green-500">
              Our Products
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Buffalo Milk", path: "/buffalomilk" },
                { name: "Cow Milk", path: "/cowmilk" },
                { name: "Paneer", path: "/paneer" },
                { name: "Pot Curd", path: "/potcurd" },
                { name: "Badam Milk", path: "/badammilk" }
              ].map((product) => (
                <Link
                  key={product.path}
                  to={product.path}
                  className="block text-gray-400 hover:text-green-300 transition-all duration-300 hover:translate-x-2 text-sm sm:text-base group"
                >
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  {product.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 sm:space-y-5 md:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold uppercase text-white tracking-wider pb-2 border-b-2 border-green-500">
              Connect With Us
            </h3>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 sm:space-x-6 justify-center md:justify-start">
              {[
                { icon: FacebookIcon, color: "blue-500", href: "https://www.facebook.com/login/", alt: "Facebook" },
                { icon: InstagramIcon, color: "pink-500", href: "https://www.instagram.com/accounts/login/?hl=en", alt: "Instagram" },
                { icon: WhatsappIcon, color: "green-500", href: "https://web.whatsapp.com/", alt: "WhatsApp" }
              ].map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 hover:text-${social.color} transition-all duration-300 transform hover:-translate-y-1`}
                  title={social.alt}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-opacity-20 hover:backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <img 
                      src={social.icon} 
                      alt={social.alt} 
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                    />
                  </div>
                </a>
              ))}
            </div>
            
            {/* Contact Info */}
            <div className="text-sm sm:text-base text-gray-400 space-y-2 sm:space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                <span className="text-green-400 font-medium min-w-[90px]">WhatsApp:</span>
                <span className="break-words font-medium">8142244668</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                <span className="text-green-400 font-medium min-w-[90px]">Email:</span>
                <span className="break-words">milkdash@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Responsive */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="text-center text-gray-500">
            <p className="text-sm sm:text-base">
              © {year} Milk Dash. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm mt-2 font-medium text-green-400 tracking-wide">
              Fresh • Pure • Delivered Daily
            </p>
            <p className="text-xs mt-2 text-gray-600">
              Made with ❤️ for healthy mornings
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;