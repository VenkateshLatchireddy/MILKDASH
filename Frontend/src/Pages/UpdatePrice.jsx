import React, { useState, useEffect } from 'react';
import AdminNavbar from '../Components/AdminNavbar.jsx';
import AdminSidebar from '../Components/AdminSidebar.jsx';
import API_BASE_URL from "../config.js";
import { DollarSign, Edit2, Save, RefreshCw, TrendingUp, Package } from 'lucide-react';

const UpdatePrice = () => {
  const [prices, setPrices] = useState({});
  const [editing, setEditing] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch prices from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/getPrices`)
      .then(response => response.json())
      .then(data => {
        setPrices(data);
        sessionStorage.setItem('prices', JSON.stringify(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (product) => {
    setEditing(product);
    setTempPrice(prices[product]);
  };

  const handleSave = async (product) => {
    if (!tempPrice || isNaN(tempPrice) || parseFloat(tempPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setSaving(true);
    const updatedPrices = { ...prices, [product]: tempPrice };
    
    try {
      // Update in backend
      const response = await fetch(`${API_BASE_URL}/api/updatePrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product, price: tempPrice }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update state and localStorage
        setPrices(updatedPrices);
        sessionStorage.setItem('prices', JSON.stringify(updatedPrices));
        setEditing(null);
        alert('Price updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setTempPrice('');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/getPrices`)
      .then(response => response.json())
      .then(data => {
        setPrices(data);
        sessionStorage.setItem('prices', JSON.stringify(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-green-600" />
                  Price Management
                </h1>
                <p className="text-gray-600 mt-2">Update product prices in real-time</p>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Prices'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-xl font-bold text-gray-800">{Object.keys(prices).length}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-600 opacity-60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{Object.values(prices).reduce((sum, price) => sum + parseFloat(price || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 opacity-60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Editing</p>
                    <p className="text-xl font-bold text-gray-800">
                      {editing ? 'Active' : 'None'}
                    </p>
                  </div>
                  <Edit2 className="w-8 h-8 text-yellow-600 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading prices...</p>
            </div>
          ) : Object.keys(prices).length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
              <p className="text-gray-500 mt-1">Add products to start managing prices</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(prices).map((product) => (
                <div 
                  key={product} 
                  className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                    editing === product ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    {/* Product Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">{product}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-500">Active Product</span>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    {/* Price Display/Edit */}
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-gray-500 mr-2">Current Price:</span>
                        {editing === product ? (
                          <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <DollarSign className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                              placeholder="Enter new price"
                              min="0"
                              step="0.01"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="text-3xl font-bold text-green-600">
                            ₹{prices[product]}
                            <span className="text-sm text-gray-500 ml-2 font-normal">/unit</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {editing === product ? (
                        <>
                          <button
                            onClick={() => handleSave(product)}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition duration-200 disabled:opacity-70"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            {saving ? 'Saving...' : 'Update Price'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Price
                        </button>
                      )}
                    </div>

                    {/* Last Updated */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Last updated: Today
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Price Update Guidelines</h4>
                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                  <li>• Prices are updated in real-time across the platform</li>
                  <li>• Changes reflect immediately for new orders</li>
                  <li>• Existing orders retain their original prices</li>
                </ul>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Live Updates:</span>
                <span className="ml-2 font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrice;