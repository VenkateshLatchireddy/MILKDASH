import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import BuffaloCardImg from './Assets/BuffaloImg.jpg';
import CowMilkCardImg from './Assets/CowMilkImg.jpg';
import PaneerCardImg from './Assets/PaneerImg.jpg';
import PotCurdCardImg from './Assets/PotCurd.jpg';
import BadamMilkCardImg from './Assets/BadamMilkImg.jpg';
import API_BASE_URL from "../config";

const ProductCard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const getPrice = (productName) => {
    const product = products.find(p => p.product_name === productName);
    return product ? product.price : "129.00";
  };

  const productData = [
    { 
      name: "Buffalo Milk", 
      desc: "Fresh And Creamy, Organic Milk", 
      img: BuffaloCardImg, 
      link: "/buffalomilk", 
      unit: "Per Litre",
      priceKey: "BuffaloMilk"
    },
    { 
      name: "Cow Milk", 
      desc: "Healthy, Pure, And Full Of Energy", 
      img: CowMilkCardImg, 
      link: "/cowmilk", 
      unit: "Per Litre",
      priceKey: "CowMilk"
    },
    { 
      name: "Paneer", 
      desc: "Soft, Milky, Packed With Goodness", 
      img: PaneerCardImg, 
      link: "/paneer", 
      unit: "Per Kg",
      priceKey: "Paneer"
    },
    { 
      name: "Pot Curd", 
      desc: "Thick And Creamy Natural Curd", 
      img: PotCurdCardImg, 
      link: "/potcurd", 
      unit: "Per Litre",
      priceKey: "PotCurd"
    },
    { 
      name: "Badam Milk", 
      desc: "Almond Milk, Nature's Perfect Treat", 
      img: BadamMilkCardImg, 
      link: "/badammilk", 
      unit: "Per Litre",
      priceKey: "BadamMilk"
    }
  ];

  return (
    <div className="py-8" style={{ backgroundColor: 'rgba(144, 238, 144, 0.1)' }}>
      {/* Products Container - Responsive */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 max-w-7xl mx-auto px-4">
        {productData.map((product, index) => (
          <div 
            key={index}
            className="w-full sm:w-48 md:w-56 rounded-lg p-4 flex flex-col items-center"
            style={{
              backgroundColor: 'rgba(0, 128, 0, 0.372)',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Product Image */}
            <img 
              src={product.img} 
              alt={product.name}
              className="w-full h-40 rounded-lg mb-4 object-cover"
            />
            
            {/* Product Content */}
            <div className="text-center w-full">
              {/* Product Title */}
              <h3 
                className="font-bold mb-2 text-lg"
                style={{
                  color: '#fff',
                  textShadow: '1px 1px 3px #000'
                }}
              >
                {product.name}
              </h3>
              
              {/* Description */}
              <p 
                className="mb-4 text-sm"
                style={{
                  color: '#f0f0f0',
                  lineHeight: '1.4'
                }}
              >
                {product.desc}
              </p>
              
              {/* Price */}
              <div className="mb-4">
                <span 
                  className="text-xl font-bold"
                  style={{
                    color: '#fff',
                    textShadow: '1px 1px 2px #000'
                  }}
                >
                  ₹ {getPrice(product.priceKey)}
                </span>
                <span 
                  className="ml-1"
                  style={{ color: '#f0f0f0' }}
                >
                  {product.unit}
                </span>
              </div>
              
              {/* Buy Now Button */}
              <Link to={product.link} className="w-full block">
                <button 
                  className="w-full py-2 rounded font-bold"
                  style={{
                    backgroundColor: 'rgb(71, 125, 4)',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgb(3, 71, 3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgb(71, 125, 4)';
                  }}
                >
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;