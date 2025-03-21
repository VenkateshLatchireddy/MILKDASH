import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import BuffaloCardImg from '../Assets/BuffaloImg.jpg';
import CowMilkCardImg from '../Assets/CowMilkImg.jpg';
import PaneerCardImg from '../Assets/PaneerImg.jpg';
import PotCurdCardImg from '../Assets/PotCurd.jpg'
import BadamMilkCardImg from '../Assets/BadamMilkImg.jpg';
import './ProductCard.css';

const ProductCard = () => {
  const [products, setProducts] = useState([]);

  // ✅ Fetch Product Prices from Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched products:", data); // Debugging
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid data format:", data);
          setProducts([]); // Ensure it's an array
        }
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // ✅ Function to Get Price
  const getPrice = (productName) => {
    const product = products.find(p => p.product_name === productName);
    return product ? `₹ ${product.price} per litre` : "Price not available";
  };

  return (
    <div className='cards-container'>
      <div className='image-container'>
        <img className='card1-img' src={BuffaloCardImg} alt="error-image"/>
        <div className='card-text'>
          <h1>Buffalo Milk </h1>
          <h2>Fresh And Creamy, Organic Milk</h2>
          <p>{getPrice("BuffaloMilk")}</p>
          <Link to={'/buffalomilk'}><button className="primary">Buy Now</button></Link>
        </div>
      </div>
      <div className='image-container'>
        <img className='card1-img' src={CowMilkCardImg} alt="error-image"/>
        <div className='card-text'>
          <h1>Cow Milk </h1>
          <h2>Healthy, pure, and full of energy</h2>
          <p>{getPrice("CowMilk")}</p>
          <Link to={'/cowmilk'}><button className="primary">Buy Now</button></Link>
        </div>
      </div>
      <div className='image-container'>
        <img className='card1-img' src={PaneerCardImg} alt="error-image"/>
        <div className='card-text'>
          <h1>Paneer </h1>
          <h2>Soft, milky, packed with goodness</h2>
          <p>{getPrice("Paneer").replace("per litre", "per kg")}</p>
          <Link to={'/paneer'}><button className="primary">Buy Now</button></Link>
        </div>
      </div>

      <div className='image-container'>
        <img className='card1-img' src={PotCurdCardImg} alt="error-image"/>
        <div className='card-text'>
          <h1>Pot Curd </h1>
          <h2>Thick and creamy curd, naturally set in clay pots</h2>
          <p>{getPrice("PotCurd").replace("per litre", "per Litre")}</p>
          <Link to={'/potcurd'}><button className="primary">Buy Now</button></Link>
        </div>
      </div>

      <div className='image-container'>
        <img className='card1-img' src={BadamMilkCardImg} alt="error-image"/>
        <div className='card-text'>
          <h1>Badam Milk</h1>
          <h2>Almond milk, nature’s perfect treat</h2>
          <p>{getPrice("BadamMilk")}</p>
          <Link to={'/badammilk'}><button className="primary">Buy Now</button></Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;