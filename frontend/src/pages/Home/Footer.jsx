import React from "react";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import "./home_css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Vedic Vedang.AI</h3>
          <p>Empowering decisions through AI-powered Vedic astrology.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#why-us">Why Us</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <h4>
            Sangeeta Kothale
            <span style={{ fontSize: "12px", marginLeft: "4px" }}>
              (M.A Vedang Jyotish)
            </span>
          </h4>
          <h4>+91 9421406323</h4>
          <h4 className="email-link">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sangeeta.kothale@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope style={{ marginRight: "8px" }} />
              sangeeta.kothale@gmail.com
            </a>
          </h4>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Vedic Vedang.AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
