import React from 'react';
import { MapPin, Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div>
      <div className="contact-container-wrapper">
        <div className="contact-container">
          <div className="contact-left-section">
            <h2 className="contact-title"><MapPin className="contact-icon" /> MILKDASH</h2>
            <h2 className="contact-title">Address</h2>
            <p>
              Hyderabad,<br />
              City
            </p>

            <div className="contact-footer-box">
              <h2 className="contact-heading">CONTACT</h2>
              <hr />
              <ul className="contact-footer-list">
                <li className="contact-item"><Facebook className="contact-icon" /> Facebook</li>
                <li className="contact-item"><Instagram className="contact-icon" /> Instagram</li>
                <li className="contact-item"><Mail className="contact-icon" /> Email</li>
                <li className="contact-item"><MessageCircle className="contact-icon" /> WhatsApp</li>
              </ul>
            </div>
          </div>

          <div className="contact-right-section">
            <h2 className="contact-title" >Office Location</h2>
          <iframe title='hyd' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487293.4778514321!2d78.07834058207517!3d17.4127332389343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1742388590970!5m2!1sen!2sin" width="600" height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
