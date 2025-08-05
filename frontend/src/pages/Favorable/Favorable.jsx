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
  Gem,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
// import { getUserInsights } from "../../api/user";
// import { sendMessageToAI } from "../../api/chatApi";
import "./Favorable.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Favorable = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [astrologyData, setAstrologyData] = useState(null);
  const [isLoadingFavorable, setIsLoadingFavorable] = useState(false);
  const [isFavorableOpen, setIsFavorableOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Favorable Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Helper function to translate gemstone names
  const translateGemstone = (gemstoneName) => {
    if (!gemstoneName) return "";
    // Try to translate, fallback to original if translation doesn't exist
    const translated = t(gemstoneName.toLowerCase().replace(/\s+/g, ""));
    return translated !== gemstoneName.toLowerCase().replace(/\s+/g, "")
      ? translated
      : gemstoneName;
  };

  useEffect(() => {
    if (user) {
      // load astrology data from local storage
      const storedData = localStorage.getItem("astrologyData");
      if (storedData) {
        try {
          setIsLoadingFavorable(true);
          const parsedData = JSON.parse(storedData);
          setAstrologyData(parsedData);
          setIsLoadingFavorable(false);
        } catch (err) {
          console.error("Error parsing astrology data:", err);
          setIsLoadingFavorable(false);
        }
      } else {
        //if no data found, navigate to login page
        toast.error(
          "Error loading astrology data. Please try again later. Please ensure you have provided accurate birth details.",
          {
            position: "top-right",
            autoClose: 3000,
            color: "red",
          }
        );
        navigate("/login");
        setIsLoadingFavorable(false);
      }
    }
  }, [user]);

  if (isLoadingFavorable) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Favorable Data........ </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          <div className="dashboard-container">
            <div className="welcome-section">
              <motion.h1 className="welcome-title">
                {t("favorableGemstone") || "Favorable Gemstone"}
              </motion.h1>
              <div className="action-buttons">
                <button
                  className="translate-button"
                  onClick={toggleLanguage}
                  title="Translate"
                >
                  <Languages className="icon" />
                  {language === "en"
                    ? "हिंदी"
                    : language === "hi"
                    ? "मराठी"
                    : "English"}
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

            {!astrologyData && !isLoadingFavorable && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{t("noDataAvailable") || "No charts available"}</h3>
                  <p>
                    {t("completeProfile") ||
                      "Please complete your profile to generate charts."}
                  </p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/login")}
                  >
                    {t("goToLogin") || "Go to Login"}
                  </button>
                </div>
              </motion.div>
            )}

            {astrologyData && (
              <motion.div className="favorable-section">
                <div
                  className="favorable-header"
                  onClick={() => setIsFavorableOpen(!isFavorableOpen)}
                >
                  <h2 className="favorable-title">
                    <Gem className="icon" /> {t("gemStones")}
                  </h2>
                  {isFavorableOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isFavorableOpen && (
                    <motion.div className="favorable-content">
                      <div className="favorable-details-grid">
                        <div className="favorable-detail">
                          <span className="favorable-label">
                            {t("beneficGemstone")}
                          </span>
                          <span className="favorable-value">
                            {translateGemstone(
                              astrologyData.gemstones["Benefic Gemstone"]
                            )}
                          </span>
                        </div>
                        <div className="favorable-detail">
                          <span className="favorable-label">
                            {t("lifeGemstone")}
                          </span>
                          <span className="favorable-value">
                            {translateGemstone(
                              astrologyData.gemstones["Life Gemstone"]
                            )}
                          </span>
                        </div>
                        <div className="favorable-detail">
                          <span className="favorable-label">
                            {t("luckyGemstone")}
                          </span>
                          <span className="favorable-value">
                            {translateGemstone(
                              astrologyData.gemstones["Lucky Gemstone"]
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Favorable;
