import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';
import axios from 'axios';
import BadamMilk from '../../Components/Assets/BadamMilkImg.jpg';

const BadamMilkPage = () => {
  const [showInput, setShowInput] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(null);
  const [user, setUser] = useState({ name: '', contactnumber: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(null);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const userResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`);
          setUser(userResponse.data);
          setAddress(userResponse.data.address || ''); // Set default address
        }

        const stockResponse = await axios.get('http://localhost:5000/api/stocks/badammilk');
        setStock(stockResponse.data.stock);

        const priceResponse = await axios.get('http://localhost:5000/api/product-price/badammilk');
        setPrice(priceResponse.data.price);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const increaseQuantity = () => {
    if (quantity < 10 && quantity < stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const [location, setLocation] = useState(null);
  const API_KEY = "pk.f93056d7a8151da3e8682629e9c0f60d"; // Replace with actual key

  const handleGetLocation = () => {
    if (!API_KEY) {
      console.error("API key is missing! Provide a valid key.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (data.address) {
              const { road, suburb, city, state, postcode, country } = data.address;
              const formattedAddress = `${road || ''}, ${suburb || ''}, ${city || ''}, ${state || ''} - ${postcode || ''}, ${country || ''}`;
              setAddress(formattedAddress);
            } else {
              console.error("No address data found");
            }
          })
          .catch((err) => console.error("Error fetching data from API:", err));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to fetch location. Please allow location access in browser settings.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleBuyNow = async () => {
    if (!userId) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    if (!address) {
      alert('Please enter a delivery address.');
      return;
    }

    if (stock <= 0) {
      alert('Out of stock!');
      return;
    }

    const totalAmount = (quantity * price).toFixed(2);

    // Navigate to the Payment Page with order details
    navigate(`/payment?amount=${totalAmount}&name=${user.name}&phone=${user.contactnumber}&email=${user.email}&productname=BadamMilk&quantity=${quantity}&deliveryaddress=${address}`);
  };

  return (
    <div className='product-page'>
      <div className='product-container'>
        <div className='product-image'>
          <img src={BadamMilk} alt='Badam Milk' />
        </div>

        <div className='product-content'>
          <h1>Badam Milk</h1>
          <p>A creamy blend of almonds and milk, perfect for any time of day.</p>
          <h2 className='price'>Price ₹ {price !== null ? price : 'Loading...'}/ Per Kg</h2>
          <div className='stock-info'>
            {loading ? <p>Loading stock...</p> : <h3>Stock Left: {stock}</h3>}
          </div>
          <div className='delivery-address'>
            <h3 onClick={() => setShowInput(!showInput)} className='delivery-heading'>
              + Enter delivery address
            </h3>
            {showInput && (
              <div>
                <input
                  type='text'
                  className='delivery-input'
                  placeholder='Enter address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button onClick={handleGetLocation}>Get Current Location</button>
              </div>
            )}
          </div>
          <h1>Total Cost : <span>{(quantity * price).toFixed(2)}</span></h1>

          <div className='customer-input'>
            <div className='quantity-selector'>
              <button className='quantity-btn' onClick={decreaseQuantity}>−</button>
              <span className='quantity-value'>{quantity}</span>
              <button className='quantity-btn' onClick={increaseQuantity}>+</button>
            </div>
            <button
              className={`buy-now ${stock === 0 ? 'disabled' : ''}`}
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              {stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadamMilkPage;
