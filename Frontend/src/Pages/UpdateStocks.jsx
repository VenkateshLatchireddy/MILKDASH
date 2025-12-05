import React, { useState, useEffect } from 'react';
import AdminNavbar from '../Components/AdminNavbar.jsx';
import AdminSidebar from '../Components/AdminSidebar.jsx';
import API_BASE_URL from "../config.js";
import { Package, Warehouse, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Edit2, Save } from 'lucide-react';

const UpdateStocks = () => {
  const [stockData, setStockData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tempStock, setTempStock] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch stock data from the backend
  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/stocks`)
      .then((response) => response.json())
      .then((data) => {
        setStockData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stocks:', error);
        setLoading(false);
      });
  };

  const handleEdit = (product, currentStock) => {
    setEditing(product);
    setTempStock(currentStock);
  };

  const handleStockUpdate = async (product, newStock) => {
    if (!newStock || isNaN(newStock) || parseInt(newStock) < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/updateStock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productname: product, stock: newStock }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Stock updated successfully!');
        setStockData((prevStocks) =>
          prevStocks.map((item) =>
            item.productname === product ? { ...item, stock: newStock } : item
          )
        );
        setEditing(null);
      } else {
        throw new Error(data.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setTempStock('');
  };

  const getStockStatus = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum === 0) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Out of Stock' };
    if (stockNum <= 10) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Low Stock' };
    if (stockNum <= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Moderate' };
    return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'In Stock' };
  };

  const calculateTotalStock = () => {
    return stockData.reduce((total, item) => total + parseInt(item.stock || 0), 0);
  };

  const calculateLowStockCount = () => {
    return stockData.filter(item => parseInt(item.stock) <= 10).length;
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
                  <Warehouse className="w-7 h-7 text-green-600" />
                  Stock Management
                </h1>
                <p className="text-gray-600 mt-2">Monitor and update product inventory levels</p>
              </div>
              
              <button
                onClick={fetchStockData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Stocks'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-xl font-bold text-gray-800">{stockData.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600 opacity-60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Stock Units</p>
                    <p className="text-xl font-bold text-gray-800">{calculateTotalStock()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 opacity-60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-xl font-bold text-gray-800">{calculateLowStockCount()}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading stock data...</p>
            </div>
          ) : stockData.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No Stock Data Found</h3>
              <p className="text-gray-500 mt-1">Add products to start managing stock</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stockData.map((item) => {
                const status = getStockStatus(item.stock);
                return (
                  <div 
                    key={item.productname} 
                    className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${status.border} ${
                      editing === item.productname ? 'ring-1 ring-green-500' : ''
                    }`}
                  >
                    <div className="p-6">
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 capitalize">{item.productname}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')}`}></div>
                            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg ${status.bg}`}>
                          {parseInt(item.stock) === 0 ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : parseInt(item.stock) <= 10 ? (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          ) : (
                            <Package className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>

                      {/* Stock Display/Edit */}
                      <div className="mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Stock:</span>
                            {editing === item.productname ? (
                              <div className="relative">
                                <input
                                  type="number"
                                  value={tempStock}
                                  onChange={(e) => setTempStock(e.target.value)}
                                  className="w-32 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold text-center"
                                  placeholder="Qty"
                                  min="0"
                                  autoFocus
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                  <Package className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                            ) : (
                              <div className={`text-3xl font-bold ${status.color}`}>
                                {item.stock}
                                <span className="text-sm text-gray-500 ml-2 font-normal">units</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Stock Bar */}
                          <div className="pt-2">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${status.color.replace('text-', 'bg-')} transition-all duration-500`}
                                style={{ 
                                  width: `${Math.min((parseInt(item.stock) / 100) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0</span>
                              <span>50</span>
                              <span>100+</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {editing === item.productname ? (
                          <>
                            <button
                              onClick={() => handleStockUpdate(item.productname, tempStock)}
                              disabled={updating}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition duration-200 disabled:opacity-70"
                            >
                              {updating ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              {updating ? 'Updating...' : 'Update Stock'}
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
                            onClick={() => handleEdit(item.productname, item.stock)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Stock
                          </button>
                        )}
                      </div>

                      {/* Stock Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="font-medium text-gray-700">Today</span>
                        </div>
                        {parseInt(item.stock) <= 10 && (
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">Consider restocking soon</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Stock Management Guidelines</h4>
                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                  <li>• <span className="text-red-600 font-medium">Red (0)</span>: Out of Stock - Immediate attention required</li>
                  <li>• <span className="text-orange-600 font-medium">Orange (1-10)</span>: Low Stock - Consider restocking</li>
                  <li>• <span className="text-yellow-600 font-medium">Yellow (11-50)</span>: Moderate Stock - Monitor regularly</li>
                  <li>• <span className="text-green-600 font-medium">Green (51+)</span>: Healthy Stock - No immediate action needed</li>
                </ul>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Inventory Status:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-600">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStocks;