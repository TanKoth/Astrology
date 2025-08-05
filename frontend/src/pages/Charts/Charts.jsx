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
import "./Charts.css";
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

const Charts = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [astrologyData, setAstrologyData] = useState(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const originalTitle = document.title;
    const userName = user?.name || "User";
    document.title = `Charts Report - ${userName}`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  const chartNameMapping = {
    0: t("horaChart") || "Hora (Wealth - D2)",
    1: t("drekkanaChart") || "Drekkana (Sibling - D3)",
    2: t("chaturtamshaChart") || "Chaturtamsha (Luck - D4)",
    3: t("saptamshaChart") || "Saptamsha (Children - D7)",
    4: t("navamshaChart") || "Navamsha (Spouse - D9)",
    5: t("dashamshaChart") || "Dashamsha (Profession - D10)",
    6: t("dwadashamshaChart") || "Dwadashamsha (Parents - D12)",
    7: t("shodasamshaChart") || "Shodasamsha (Vehicles - D16)",
    8: t("vimshamshaChart") || "Vimshamsha (Religious Inclinations - D20)",
    9: t("chaturvimshamshaChart") || "Chaturvimshamsha (Education - D24)",
    10: t("saptavimshaChart") || "Saptavimsha (Strength - D27)",
    11: t("trimsamshaChart") || "Trimsamsha (Misfortune - D30)",
    12: t("khavedamshaChart") || "Khavedamsha (Auspicious Results - D40)",
    13: t("shashtiamshaChart") || "Shashtiamsha (General Well-being - D60)",
  };

  useEffect(() => {
    if (user) {
      // load user astrology chart from localStorage
      const storedAstrologyData = localStorage.getItem("astrologyData");
      if (storedAstrologyData) {
        try {
          setIsLoadingChart(true);
          const parsedData = JSON.parse(storedAstrologyData);
          setAstrologyData(parsedData);
          setIsLoadingChart(false);
        } catch (err) {
          console.log("Error parsing astrology data from localStorage:", err);
          setIsLoadingChart(false);
        }
      } else {
        // if no stored data found, redirect to login page
        toast.error(
          "Error loading astrology data. Please try again later. Please ensure you have provided accurate birth details.",
          {
            position: "top-right",
            color: "red",
          }
        );
        navigate("/login");
        setIsLoadingChart(false);
      }
    }
  }, [user]);

  if (isLoadingChart) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading charts...</p>
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
                {t("astrologyCharts") || "Astrology Charts"} -{" "}
                {user?.name || "User"}
              </motion.h1>
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

            {!astrologyData && !isLoadingChart && (
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

            {/* Charts Section */}
            {astrologyData && astrologyData.charts && (
              <motion.div className="insights-section">
                <div className="insights-header">
                  <h2 className="insights-title">{t("charts") || "Charts"}</h2>
                </div>
                {/* <motion.p className="welcome-subtitle">
                  {t("chartsDescription") ||
                    "Kundli is the term used for Birth Chart in Vedic Astrology. Twelve houses of Kundli show ascendant and planet position in various zodiac signs at the time of birth."}
                </motion.p> */}
                <div className="insights-content">
                  <div className="charts-grid">
                    {astrologyData.charts.slice(3, 16).map((chart, index) => (
                      <div key={index} className="chart-item">
                        <h4 className="chart-title">
                          {chartNameMapping[index] ||
                            chart.name ||
                            `Chart ${index + 1}`}
                        </h4>
                        <div className="chart-container">
                          <img
                            src={chart.url}
                            alt={chartNameMapping[index + 1] || chart.name}
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
                            <span>
                              {t("chartLoading") || "Chart Loading......."}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Charts;
