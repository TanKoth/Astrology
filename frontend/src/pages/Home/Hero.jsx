import React from "react";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import "./home_css/Hero.css";
import { useNavigate } from "react-router-dom";
import Aries from "../../img/Zodiac_Signs/Aries.png";
import Taurus from "../../img/Zodiac_Signs/Taurus.png";
import Gemini from "../../img/Zodiac_Signs/Gemini.png";
import Cancer from "../../img/Zodiac_Signs/Cancer.png";
import Leo from "../../img/Zodiac_Signs/Leo.png";
import Virgo from "../../img/Zodiac_Signs/Virgo.png";
import Libra from "../../img/Zodiac_Signs/Libra.png";
import Scorpio from "../../img/Zodiac_Signs/Scorpio.png";
import Sagittarius from "../../img/Zodiac_Signs/Sagittarius.png";
import Capricorn from "../../img/Zodiac_Signs/Capricorn.png";
import Aquarius from "../../img/Zodiac_Signs/Aquarius.png";
import Pisces from "../../img/Zodiac_Signs/Pisces.png";
const zodiacSymbols = [
  {
    Image: Aries,
  },
  {
    Image: Taurus,
  },
  {
    Image: Gemini,
  },
  {
    Image: Cancer,
  },
  {
    Image: Leo,
  },
  {
    Image: Virgo,
  },
  {
    Image: Libra,
  },
  {
    Image: Scorpio,
  },
  {
    Image: Sagittarius,
  },
  {
    Image: Capricorn,
  },
  {
    Image: Aquarius,
  },
  {
    Image: Pisces,
  },
  // "♈",
  // "♉",
  // "♊",
  // "♋",
  // "♌",
  // "♍",
  // "♎",
  // "♏",
  // "♐",
  // "♑",
  // "♒",
  // "♓",
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="hero relative bg-gradient-to-b from-background via-primary to-black min-h-screen flex items-center justify-center text-center text-textPrimary"
      id="home"
    >
      {/* Hero Content */}
      <div className="hero-content space-y-6 z-10 px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight to-secondary"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Decode Your Destiny with AI and Vedic Wisdom
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-textSecondary max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Unlock Your Potential with Garg.AI's Advanced Astrological Analysis
        </motion.p>
        <motion.button
          className="cta-button bg-secondary hover:bg-highlight text-white text-lg px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Discover Your Cosmic Path"
          onClick={() => navigate("/signup")}
        >
          Discover Your Cosmic Path
        </motion.button>
      </div>

      {/* Hero Background */}
      <div className="hero-background absolute inset-0 z-0 overflow-hidden">
        {zodiacSymbols.map((symbol, index) => (
          <motion.div
            key={index}
            className="zodiac-symbol absolute text-textSecondary text-xl md:text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 5,
            }}
          >
            <img
              src={symbol.Image}
              alt="Zodiac symbol"
              className="w-8 h-8 md:w-12 md:h-12 opacity-30"
            />
          </motion.div>
        ))}
        {/* <motion.div
          className="ai-icon absolute bottom-10 right-10 text-highlight text-6xl"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          aria-label="Rotating AI Icon"
        >
          <FaRobot />
        </motion.div> */}
      </div>
    </section>
  );
};

export default Hero;
