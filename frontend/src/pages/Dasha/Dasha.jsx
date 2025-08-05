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
// import { getUserInsights } from "../../api/user";
// import { sendMessageToAI } from "../../api/chatApi";
import "./Dasha.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

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

const Dasha = () => {
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

  const fetchInsights = async () => {
    // try {
    //   const data = await getUserInsights(user._id);
    //   setInsights(data);
    //   setIsLoadingInsights(false);
    // } catch (error) {
    //   console.error("Failed to load insights.");
    //   setIsLoadingInsights(false);
    // }
  };

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

            {/* {!astrologyData && !isLoadingChart && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{t("noDataAvailable")}</h3>
                  <p>{t("completeProfile")}</p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/profile")}
                  >
                    {t("completeProfileButton")}
                  </button>
                </div>
              </motion.div>
            )} */}

            {/* Charts Section */}
            {/* {astrologyData && ( */}
            <motion.div className="insights-section">
              <div className="insights-header">
                <h2 className="insights-title">
                  <Navigation className="icon" /> Dasha
                </h2>
              </div>
              <motion.p className="welcome-subtitle">
                Dasha are generated based on your birth details. If you have not
                provided your birth details, please complete your profile to
                generate Dosh.
              </motion.p>
              <div className="insights-content">
                <div className="charts-grid">
                  {/* {astrologyData.charts.slice(0, 3).map((chart, index) => (
                      <div key={index} className="chart-item">
                        <h4 className="chart-title">
                          {chartNameMapping[index] ||
                            chart.name ||
                            `Chart ${index + 1}`}
                        </h4> */}
                  {/* <div className="chart-container"> */}
                  {/* <img
                            src={chart.url}
                            // alt={chartNameMapping[index + 1] || chart.name}
                            className="chart-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="chart-placeholder"
                            style={{ display: "none" }}
                          >
                            <Star className="chart-placeholder-icon" />
                            <span>Chart Loading.......</span>
                          </div>
                        </div>
                      </div>
                    ))} */}
                </div>
              </div>
            </motion.div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dasha;
