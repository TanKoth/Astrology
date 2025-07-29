import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaHeart,
  FaRobot,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaRoute,
} from "react-icons/fa";
import "./home_css/Feature.css";

//image import
import Horoscope from "../../img/horoscope.png";
import Compatibility from "../../img/compatibility.png";
import Astrologer from "../../img/astrologer.png";
import Planets from "../../img/planets.png";
import Planner from "../../img/weekly.png";
import LifePath from "../../img/path.png";
import { useNavigate } from "react-router-dom";

const Feature = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaUser />,
      title: "Personalized Horoscope",
      description:
        "Daily guidance tailored to your birth chart for a deeper understanding of your day-to-day journey",
      image: Horoscope,
    },
    {
      icon: <FaHeart />,
      title: "Compatibility Analysis",
      description:
        "Explore the dynamics of your relationships with detailed compatibility reports based on astrological insights",
      image: Compatibility,
    },
    {
      icon: <FaRobot />,
      title: "Interactive Astrologer",
      description:
        "Engage with our AI-powered astrologer for real-time answers to your astrological queries",
      image: Astrologer,
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Visual Planetary Movements",
      description:
        "Stay updated with the latest planetary movements and their potential impacts on your life",
      image: Planets,
    },
    {
      icon: <FaCalendarAlt />,
      title: "Weekly Planner",
      description:
        "Plan your week with astrological insights to make the most of favorable cosmic energies",
      image: Planner,
    },
    {
      icon: <FaRoute />,
      title: "Life Path Analysis",
      description:
        "Discover your life path and purpose through detailed astrological analysis",
      image: LifePath,
    },
  ];

  return (
    <section className="features" id="features">
      <div className="stars"></div>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Your Journey with Our Powerful Tools
        </motion.h2>
        <div className="features-content">
          <div className="features-wrapper">
            <div className="feature-list">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`feature-item ${
                    index === activeFeature ? "active" : ""
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="feature-showcase">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  className="feature-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-illustration">
                    <img
                      src={features[activeFeature].image || "/placeholder.svg"}
                      alt={features[activeFeature].title}
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-info">
                    <h3>{features[activeFeature].title}</h3>
                    <p>{features[activeFeature].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/signup")}
        >
          Explore Your Cosmic Journey
        </motion.button>
      </div>
    </section>
  );
};

export default Feature;
