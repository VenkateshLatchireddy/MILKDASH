import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import FacebookIcon from "../Assets/Facebook.webp";
import EmailIcon from "../Assets/email.webp";
import WhatsappIcon from "../Assets/whatsapp.webp";
import InstagramIcon from "../Assets/instagram.webp";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Container 1 */}
      <div className="footer-box-common">
        <h2 className="footer-heading">Welcome to MILK DASH</h2>
        <hr className="footer-hr" />
        <p className="footer-caption">
          Start Your Day the Fresh Way,<br /> Delivered to Your Door with Love!
        </p>
        <ul className="footer-list-common">
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/terms">Terms and Policies</Link>
          </li>
          <li onClick={() => console.log("Admin login clicked!")}>
            <Link to="/admin-login">Login AS Admin</Link>
          </li>
        </ul>
      </div>

      {/* Container 2 */}
      <div className="footer-box-common">
        <h2 className="footer-heading">PRODUCTS</h2>
        <hr className="footer-hr" />
        <ul className="footer-list-common">
          <li><Link to="/buffalomilk">Buffalo Milk</Link></li>
          <li><Link to="/cowmilk">Cow Milk</Link></li>
          <li><Link to="/paneer">Paneer</Link></li>
          <li><Link to="/potcurd">Pot Curd</Link></li>
          <li><Link to="/badammilk">Badam Milk</Link></li>
        </ul>
      </div>

      {/* Container 3 */}
      <div className="footer-box-contact">
        <h2 className="footer-heading">CONTACT</h2>
        <hr className="footer-hr" />
        <ul className="footer-list-contact">
          <li>
            <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
              <img src={FacebookIcon} alt="Facebook" className="footer-icon" />
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/accounts/login/?hl=en" target="_blank" rel="noopener noreferrer">
              <img src={InstagramIcon} alt="Instagram" className="footer-icon" />
              Instagram
            </a>
          </li>
          <li>
            <a href="https://accounts.google.com/servicelogin?service=mail" target="_blank" rel="noopener noreferrer">
              <img src={EmailIcon} alt="Email" className="footer-icon" />
              Email
            </a>
          </li>
          <li>
            <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
              <img src={WhatsappIcon} alt="WhatsApp" className="footer-icon" />
              WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;