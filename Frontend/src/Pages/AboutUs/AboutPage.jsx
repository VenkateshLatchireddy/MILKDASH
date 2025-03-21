import React, { useState, useEffect } from "react";
import "./AboutPage.css";

// Import local images
import BuffaloMilkImg1 from '../../Components/Assets/Buffalo Milk1.jpg'
import BuffaloMilkImg2 from '../../Components/Assets/Buffalo Milk2.jpg'
import BuffaloMilkImg3 from '../../Components/Assets/Buffalo Milk3.jpg'
import Paneer1 from '../../Components/Assets/Paneer1.jpg'
import Paneer2 from '../../Components/Assets/Paneer2.jpg'
import Paneer3 from '../../Components/Assets/Paneer3.jpg'
import CowMilk1 from '../../Components/Assets/Cow milk1.jpg'
import CowMilk2 from '../../Components/Assets/Cow milk2.jpg'
import CowMilk3 from '../../Components/Assets/Cow milk3.jpg'
import BadamMilk1 from '../../Components/Assets/Badam milk1.jpg'
import BadamMilk2 from '../../Components/Assets/Badam milk2.jpg'
import BadamMilk3 from '../../Components/Assets/Badam milk3.jpg'
import PotCurdImg1 from '../../Components/Assets/curd1.jpg'
import PotCurdImg2 from '../../Components/Assets/curd2.jpg'
import PotCurdImg3 from '../../Components/Assets/curd6.jpg'

// ImageSlider functionality inside AboutPage
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider-container">
      <button className="prev" onClick={goToPrevious}>
        &#10094;
      </button>
      <div className="slider">
        <img src={images[currentIndex]} alt="slide" />
      </div>
      <button className="next" onClick={goToNext}>
        &#10095;
      </button>
    </div>
  );
};

const AboutPage = () => {
return (
    <div>
      <div className="about-us">
        <div className="about-page">
          <h1 className="about-heading">ABOUT US</h1>

          <div className="about-container buffalo-milk-container">
            <div className="about-image-container">
              <ImageSlider images={[BuffaloMilkImg1, BuffaloMilkImg2, BuffaloMilkImg3]} />
            </div>
            <div className="image-description">
              <h1>BUFFALO MILK</h1>
              <hr />
              <p>
                Our Fresh Buffalo Milk is creamy, nutritious, and sourced from healthy buffaloes,
                offering a rich, premium milk experience.
              </p>
            </div>
          </div>
          <div className="about-container ">
            <div className="image-description">
              <h1>COW MILK</h1>
              <hr />
              <p>
                Our Fresh Cow Milk is naturally rich and full of essential nutrients, sourced from
                healthy cows to provide a pure, high-quality milk option for your daily needs.
              </p>
            </div>
            <div className="about-image-container">
              <ImageSlider images={[CowMilk1, CowMilk2, CowMilk3]} />
            </div>
          </div>

          <div className="about-container paneer-container">
            <div className="about-image-container">
              <ImageSlider images={[Paneer1, Paneer2, Paneer3]} />
            </div>
            <div className="image-description">
              <h1>PANEER</h1>
              <hr />
              <p>
                Our Fresh Paneer is made from the finest quality milk, offering a soft, creamy
                texture and rich flavor, perfect for your favorite dishes.
              </p>
            </div>
          </div>


          <div className="about-container">
            <div className="image-description">
              <h1>Pot Curd</h1>
              <hr />
              <p>
                Our Badam Milk combines rich, creamy milk with the goodness of almonds, offering a
                deliciously smooth and nutritious drink perfect for any time of day.
              </p>
            </div>
            <div className="about-image-container">
              <ImageSlider images={[PotCurdImg1, PotCurdImg2, PotCurdImg3]} />
            </div>
          </div>


          <div className="about-container paneer-container">
            <div className="about-image-container">
              <ImageSlider images={[BadamMilk1, BadamMilk2, BadamMilk3]} />
            </div>
            <div className="image-description">
              <h1>Badam Milk</h1>
              <hr />
              <p>
              Our Badam Milk combines rich, creamy milk with the goodness of almonds, offering a
              deliciously smooth and nutritious drink perfect for any time of day.
              </p>
            </div>
          </div>



          
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
