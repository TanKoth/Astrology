import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  MessageCircle,
  Crown,
  Send,
  Sparkles,
  Navigation,
  Printer,
  Languages,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import "./LalKitab.css";
import { useNavigate } from "react-router-dom";

const TypingIndicator = () => (
  <div className="message ai">
    <div className="typing-indicator">
      <Sparkles className="crystal-ball" />
      <span className="typing-indicator-text">
        Vedic Vedang.AI is consulting the stars
      </span>
      <div className="typing-indicator-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  </div>
);

const LalKitab = () => {
  const { user } = useContext(AppContext);
  const [insights, setInsights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [freeChatsLeft, setFreeChatsLeft] = useState(3);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {};

  const handlePrint = () => {};

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {};

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          <div className="dashboard-container">
            <div className="welcome-section">
              <div className="action-buttons">
                <button
                  className="translate-button"
                  onClick={toggleLanguage}
                  title="Translate"
                >
                  <Languages className="icon" />
                  {language === "en" ? "हिंदी" : "English"}
                </button>
                <button
                  className="print-button"
                  onClick={handlePrint}
                  title="Print Dashboard"
                >
                  <Printer className="icon" />
                  Print
                </button>
              </div>
            </div>

            <motion.div className="insights-section">
              <div className="insights-header">
                <h2 className="insights-title">
                  <Navigation className="icon" /> LalKitab
                </h2>
              </div>
              <motion.p className="welcome-subtitle">
                LalKitab are generated based on your birth details. If you have
                not provided your birth details, please complete your profile to
                generate Dosh.
              </motion.p>
              <div className="insights-content">
                <div className="charts-grid"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LalKitab;
