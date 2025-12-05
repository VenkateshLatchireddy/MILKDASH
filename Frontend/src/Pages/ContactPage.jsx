import React from 'react';
import { MapPin, Clock, Phone, Mail, MessageCircle, Instagram, Facebook, ExternalLink } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 font-sans">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            MILK<span className="text-green-600">DASH</span>
          </h1>
          <p className="text-gray-600 text-lg mt-2">We Provide Milk Home Delivery</p>
        </div>
        
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Address</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Hyderabad City Center</p>
                    <p className="text-gray-600">123 Milk Street</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Hyderabad, Telangana 500001</p>
                    <p className="text-gray-600">India</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Get Directions on Maps
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Business Hours</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <span className="font-medium text-gray-700">Monday - Friday</span>
                  <span className="font-bold text-blue-600">6:00 AM - 9:00 PM</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-gray-700">Saturday - Sunday</span>
                  <span className="font-bold text-green-600">7:00 AM - 8:00 PM</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-500 text-sm text-center">
                  24/7 Online Orders Available • Emergency Delivery: +91 93479 60789
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Methods */}
          <div className="space-y-6">
            {/* Social Media Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook Card */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500 text-white rounded-xl">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800">Facebook</h3>
                </div>
                <p className="text-gray-600 mb-4">Connect with us on Facebook</p>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                >
                  @MILKDASH Official
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Instagram Card */}
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800">Instagram</h3>
                </div>
                <p className="text-gray-600 mb-4">Follow us for daily updates</p>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700"
                >
                  @MILKDASH.Hyd
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-500 text-white rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-600 mb-4">Send us your queries</p>
                <a 
                  href="mailto:contact@milkdash.com" 
                  className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
                >
                  contact@milkdash.com
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500 text-white rounded-xl">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800">WhatsApp</h3>
                </div>
                <p className="text-gray-600 mb-4">Instant messaging support</p>
                <a 
                  href="https://wa.me/919347960789" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
                >
                  +91 93479 60789
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">Quick Contact</h3>
                  <p className="text-green-100">Immediate assistance available</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                  <span className="font-medium">Customer Care</span>
                  <span className="font-bold text-xl">1800-MILKDASH</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                  <span className="font-medium">Emergency Delivery</span>
                  <span className="font-bold text-xl">+91 93479 60789</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition duration-300">
                  Call Now
                </button>
                <button className="flex-1 py-3 bg-transparent border-2 border-white font-semibold rounded-xl hover:bg-white/10 transition duration-300">
                  Request Callback
                </button>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📍 Find Us on Map</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500 text-white rounded-lg">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Our Location</p>
                        <p className="text-sm text-gray-600">Tap to open in Maps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">MILKDASH</span> • Fresh Milk Delivered Daily • Since 2020
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Average response time: 15 minutes • Customer satisfaction: 98.7%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;