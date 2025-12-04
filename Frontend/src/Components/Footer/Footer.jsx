import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import FacebookIcon from "../Assets/Facebook.webp";
import WhatsappIcon from "../Assets/whatsapp.webp";
import InstagramIcon from "../Assets/instagram.webp";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="md-footer">
      <div className="md-footer-inner">

        {/* Brand / Info */}
        <div className="md-footer-column md-footer-brand">
          <h2 className="md-footer-title">MILK DASH</h2>
          <p className="md-footer-tagline">
            Start Your Day the Fresh Way,<br />
            Delivered to Your Door with Love!
          </p>

          <ul className="md-footer-links">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/terms">Terms and Policies</Link>
            </li>
            <li>
              <Link to="/admin-login">Login AS Admin</Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div className="md-footer-column md-footer-products">
          <h3 className="md-footer-heading">Products</h3>
          <div className="md-footer-divider" />
          <ul className="md-footer-links">
            <li>
              <Link to="/buffalomilk">Buffalo Milk</Link>
            </li>
            <li>
              <Link to="/cowmilk">Cow Milk</Link>
            </li>
            <li>
              <Link to="/paneer">Paneer</Link>
            </li>
            <li>
              <Link to="/potcurd">Pot Curd</Link>
            </li>
            <li>
              <Link to="/badammilk">Badam Milk</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md-footer-column md-footer-contact">
          <h3 className="md-footer-heading">Contact</h3>
          <div className="md-footer-divider" />

          <ul className="md-contact-list">
            <li>
              <a
                href="https://www.facebook.com/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="md-contact-item"
              >
                <span className="md-contact-icon-wrapper">
                  <img src={FacebookIcon} alt="Facebook" className="md-contact-icon" />
                </span>
                <span className="md-contact-label">Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/accounts/login/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="md-contact-item"
              >
                <span className="md-contact-icon-wrapper">
                  <img src={InstagramIcon} alt="Instagram" className="md-contact-icon" />
                </span>
                <span className="md-contact-label">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://web.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="md-contact-item"
              >
                <span className="md-contact-icon-wrapper">
                  <img src={WhatsappIcon} alt="WhatsApp" className="md-contact-icon" />
                </span>
                <span className="md-contact-label">WhatsApp</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="md-footer-bottom">
        <p>© {year} Milk Dash. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
