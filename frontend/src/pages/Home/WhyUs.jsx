import React from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaCompass,
  FaSearch,
  FaLightbulb,
  FaBalanceScale,
  FaChartLine,
} from "react-icons/fa";
import "./home_css/WhyUs.css";

const WhyUs = () => {
  const reasons = [
    {
      icon: <FaGlobe />,
      title: "Decode Your Cosmic Blueprint",
      description:
        "Discover how planetary alignments influence your thoughts, decisions, and relationships.",
    },
    {
      icon: <FaCompass />,
      title: "Navigate Life with Confidence",
      description:
        "Align your choices with universal energies to achieve clarity and purpose.",
    },
    {
      icon: <FaSearch />,
      title: "Uncover Your True Self",
      description:
        "Understand your motivations and behavioral patterns through celestial insights.",
    },
    {
      icon: <FaLightbulb />,
      title: "Find Answers to Deep Questions",
      description:
        "Gain clarity on career, relationships, and life's biggest challenges.",
    },
    {
      icon: <FaBalanceScale />,
      title: "Harmonize with the Universe",
      description:
        "Leverage cosmic wisdom to grow, thrive, and succeed in every aspect of life.",
    },
    {
      icon: <FaChartLine />,
      title: "Plan for Success with Precision",
      description:
        "Use AI-enhanced astrological guidance to make informed and impactful decisions.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="why-us" id="why-us">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock Your Cosmic Potential
        </motion.h2>
        <motion.div
          className="reasons-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="reason-item"
              variants={itemVariants}
            >
              <div className="reason-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
