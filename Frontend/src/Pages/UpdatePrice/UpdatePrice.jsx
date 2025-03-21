import React, { useState, useEffect } from 'react';
import './UpdatePrice.css';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar.jsx';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar.jsx';

const UpdatePrice = () => {
  const [prices, setPrices] = useState({});
  const [editing, setEditing] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Fetch prices from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/getPrices')
      .then(response => response.json())
      .then(data => {
        setPrices(data);
        sessionStorage.setItem('prices', JSON.stringify(data)); // Update localStorage
      })
      .catch(error => console.error('Error fetching prices:', error));
  }, []);

  const handleEdit = (product) => {
    setEditing(product);
    setTempPrice(prices[product]);
  };

  const handleSave = (product) => {
    const updatedPrices = { ...prices, [product]: tempPrice };
    setPrices(updatedPrices);
    setEditing(null);

    // Save updated prices in localStorage
    sessionStorage.setItem('prices', JSON.stringify(updatedPrices));

    // Update the price in the backend
    fetch('http://localhost:5000/api/updatePrice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product, price: tempPrice }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Price updated successfully');
      })
      .catch(error => {
        console.error('Error updating price:', error);
        alert('Error updating price');
      });
  };

  return (
    <div>
      <AdminNavbar />
      <div className="wrapper-container">
        <div className="sidebar-container">
          <AdminSidebar />
        </div>
        <div className="container">
          {Object.keys(prices).map((product) => (
            <div className="price-box" key={product}>
              <h1>{product}</h1>
              {editing === product ? (
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                />
              ) : (
                <p>{prices[product]} /-</p>
              )}
              <div className='buttons'>
                {editing === product ? (
                  <button className="save-btn" onClick={() => handleSave(product)}>Update</button>
                ) : (
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatePrice;
