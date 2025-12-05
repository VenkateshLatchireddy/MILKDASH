import React, { useState, useEffect, useCallback } from "react";

// Import local images
import BuffaloMilkImg1 from '../Components/Assets/Buffalo Milk1.jpg';
import BuffaloMilkImg2 from '../Components/Assets/Buffalo Milk2.jpg';
import BuffaloMilkImg3 from '../Components/Assets/Buffalo Milk3.jpg';
import Paneer1 from '../Components/Assets/Paneer1.jpg';
import Paneer2 from '../Components/Assets/Paneer2.jpg';
import Paneer3 from '../Components/Assets/Paneer3.jpg';
import CowMilk1 from '../Components/Assets/Cow milk1.jpg';
import CowMilk2 from '../Components/Assets/Cow milk2.jpg';
import CowMilk3 from '../Components/Assets/Cow milk3.jpg';
import BadamMilk1 from '../Components/Assets/Badam milk1.jpg';
import BadamMilk2 from '../Components/Assets/Badam milk2.jpg';
import BadamMilk3 from '../Components/Assets/Badam milk3.jpg';
import PotCurdImg1 from '../Components/Assets/curd1.jpg';
import PotCurdImg2 from '../Components/Assets/curd2.jpg';
import PotCurdImg3 from '../Components/Assets/PotCurd.jpg';

// Enhanced ImageSlider component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(goToNext, 3000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-xl group">
      {/* Image */}
      <img 
        src={images[currentIndex]} 
        alt="Product" 
        className="w-full h-72 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Previous image"
      >
        ‹
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Next image"
      >
        ›
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80'}`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const aboutSections = [
    {
      title: "BUFFALO MILK",
      description: "Our Fresh Buffalo Milk is creamy, nutritious, and sourced from healthy buffaloes, offering a rich, premium milk experience.",
      images: [BuffaloMilkImg1, BuffaloMilkImg2, BuffaloMilkImg3],
      imageFirst: true
    },
    {
      title: "COW MILK",
      description: "Our Fresh Cow Milk is naturally rich and full of essential nutrients, sourced from healthy cows to provide a pure, high-quality milk option for your daily needs.",
      images: [CowMilk1, CowMilk2, CowMilk3],
      imageFirst: false
    },
    {
      title: "PANEER",
      description: "Our Fresh Paneer is made from the finest quality milk, offering a soft, creamy texture and rich flavor, perfect for your favorite dishes.",
      images: [Paneer1, Paneer2, Paneer3],
      imageFirst: true
    },
    {
      title: "POT CURD",
      description: "Our Pot Curd is thick, creamy, and made from pure milk, offering a natural probiotic-rich option for your daily diet.",
      images: [PotCurdImg1, PotCurdImg2, PotCurdImg3],
      imageFirst: false
    },
    {
      title: "BADAM MILK",
      description: "Our Badam Milk combines rich, creamy milk with the goodness of almonds, offering a deliciously smooth and nutritious drink perfect for any time of day.",
      images: [BadamMilk1, BadamMilk2, BadamMilk3],
      imageFirst: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">About MilkDash</h1>
          <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
            Bringing fresh, pure milk products directly to your doorstep
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Introduction */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Our Commitment to Quality
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At MilkDash, we believe in delivering not just milk, but a promise of purity, 
            freshness, and health. Every product is carefully sourced and delivered with care.
          </p>
        </div>

        {/* Product Sections */}
        {aboutSections.map((section, index) => (
          <div 
            key={index}
            className={`flex flex-col ${section.imageFirst ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12 mb-16 sm:mb-20 lg:mb-24`}
          >
            {/* Image Slider */}
            <div className="w-full lg:w-1/2">
              <ImageSlider images={section.images} />
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-green-100">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                  {section.title}
                </h3>
                
                {/* Separator */}
                <div className="w-16 h-1 bg-green-500 mb-4"></div>
                
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                  {section.description}
                </p>
                
                {/* Feature Points */}
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">100% Natural & Pure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Direct from Farm</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Daily Fresh Delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* Mission Statement */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12 border border-green-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h3>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To provide every household with access to fresh, pure, and healthy milk products 
            while supporting local farmers and promoting sustainable farming practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;