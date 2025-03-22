import React, { useState, useEffect } from 'react';
import './UpdateStocks.css';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar.jsx';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar.jsx';

const UpdateStocks= () => {
  const [stockData, setStockData] = useState([]);

  // Fetch stock data from the backend
  useEffect(() => {
    fetch('https://milkdash.onrender.com/api/stocks')
      .then((response) => response.json())
      .then((data) => setStockData(data))
      .catch((error) => console.error('Error fetching stocks:', error));
  }, []);

  // Handle stock update
  const handleStockUpdate = (product, newStock) => {
    fetch('https://milkdash.onrender.com/api/updateStock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productname: product, stock: newStock }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setStockData((prevStocks) =>
          prevStocks.map((item) =>
            item.productname === product ? { ...item, stock: newStock } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating stock:', error);
        alert('Failed to update stock');
      });
  };

  return (
    <div>
      <AdminNavbar />
      <div className="stock-wrapper">
        <div className="stock-sidebar">
          <AdminSidebar />
        </div>
        <div className="stock-container">
          {stockData.map((item) => (
            <div className="stock-card" key={item.productname}>
              <h2 className="stock-title">{item.productname}</h2>
              <input
                type="number"
                className="stock-input"
                value={item.stock}
                onChange={(e) =>
                  setStockData((prev) =>
                    prev.map((prod) =>
                      prod.productname === item.productname
                        ? { ...prod, stock: e.target.value }
                        : prod
                    )
                  )
                }
              />
              <button
                className="stock-update-btn"
                onClick={() => handleStockUpdate(item.productname, item.stock)}
              >
                Update
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateStocks;