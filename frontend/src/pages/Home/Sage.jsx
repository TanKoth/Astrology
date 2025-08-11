import { motion } from "framer-motion";
import { FaOm } from "react-icons/fa";
import "./home_css/Sage.css";

const Sage = () => {
  return (
    <section className="sage-inspiration" id="sage-inspiration">
      <div className="sage-bg"></div>
      <div className="container">
        <motion.div
          className="sage-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="om-symbol"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaOm />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Inspired by the Sage Who Defined the Stars
          </motion.h2>
          <motion.div
            className="sage-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>
              Vedic Vedang.AI draws inspiration from Maharishi Parashara, the
              ancient sage renowned as the pioneer of Vedic astrology. His
              groundbreaking work laid the foundation for understanding
              planetary influences on human life, guiding individuals toward
              self-awareness and harmony with the universe.
            </p>
            <p>
              By combining the wisdom of Maharishi Parashara's teachings with
              the power of artificial intelligence, Vedic Vedang.AI delivers
              precise, personalized astrological insights. Our platform honors
              this timeless knowledge while making it accessible for today's
              world, empowering you to decode your destiny with authenticity and
              foresight.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sage;
