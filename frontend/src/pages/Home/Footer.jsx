import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaMobileAlt,
} from "react-icons/fa";
import "./home_css/Footer.css";
import { useNavigate, Link } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/contactUs");
  };
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Vedic Vedang.AI</h3>
          <p>
            Vedic Vedang.AI is the best astrology website for online Astrology
            predictions. Talk to Astrologer on call and get answers to all your
            worries by seeing the future life through Astrology Kundli
            Predictions from the best Astrologers from India. Get best future
            predictions related to Marriage, love life, Career or Health over
            call, chat, query or report.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="#home">Home</Link>
            </li>
            <li>
              <Link to="#why-us">Why Us</Link>
            </li>
            <li>
              <Link to="#features">Features</Link>
            </li>
            <li>
              <Link to="#" onClick={handleClick}>
                Contact
              </Link>
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
          <h4>
            <FaMobileAlt style={{ marginRight: "8px" }} />
            +91 9421406323
          </h4>
          <h4 className="email-link">
            <Link
              to="https://mail.google.com/mail/?view=cm&fs=1&to=sangeeta.kothale@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope style={{ marginRight: "8px" }} />
              sangeeta.kothale@gmail.com
            </Link>
          </h4>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <Link to="#" className="social-icon">
              <FaFacebookF />
            </Link>
            <Link to="#" className="social-icon">
              <FaInstagram />
            </Link>
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
