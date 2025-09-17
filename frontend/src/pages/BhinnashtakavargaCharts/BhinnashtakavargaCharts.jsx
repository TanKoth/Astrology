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
  Sun,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import "../../pages/Charts/Charts.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SunChart from "./SunChart";
import MoonChart from "./MoonChart";
import MarsChart from "./MarsChart";
import MercuryChart from "./MercuryChart";
import JupiterChart from "./JupiterChart";
import VenusChart from "./VenusChart";
import SaturnChart from "./SaturnChart";

import LazyChartLoading from "../../utilityFunction/LazyChartLoading";

const BhinnashtakavargaCharts = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [astrologyData, setAstrologyData] = useState(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState(language || "en");

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setCurrentLanguage(newLanguage);

    try {
      // Call the global language toggle function
      toggleLanguage();

      // Show success message
      toast.success(
        `Language changed to ${newLanguage === "hi" ? "Hindi" : "English"}`,
        {
          position: "top-right",
        }
      );
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
    }
  };

  const getLanguageDisplayName = () => {
    const languageNames = {
      en: "हिंदी",
      hi: "English",
    };
    return languageNames[currentLanguage] || "हिंदी";
  };

  // Update currentLanguage when language context changes
  useEffect(() => {
    setCurrentLanguage(language || "en");
  }, [language]);

  const handlePrint = () => {
    //const originalTitle = document.title;
    const userName = user?.name || "User";
    document.title = `Charts Report-${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  // const chartNameMapping = {
  //   0: t("horaChart") || "Hora (Wealth - D2)",
  //   1: t("drekkanaChart") || "Drekkana (Sibling - D3)",
  //   2: t("chaturtamshaChart") || "Chaturtamsha (Luck - D4)",
  //   3: t("saptamshaChart") || "Saptamsha (Children - D7)",
  //   4: t("navamshaChart") || "Navamsha (Spouse - D9)",
  //   5: t("dashamshaChart") || "Dashamsha (Profession - D10)",
  //   6: t("dwadashamshaChart") || "Dwadashamsha (Parents - D12)",
  //   7: t("shodasamshaChart") || "Shodasamsha (Vehicles - D16)",
  //   8: t("vimshamshaChart") || "Vimshamsha (Religious Inclinations - D20)",
  //   9: t("chaturvimshamshaChart") || "Chaturvimshamsha (Education - D24)",
  //   10: t("saptavimshaChart") || "Saptavimsha (Strength - D27)",
  //   11: t("trimsamshaChart") || "Trimsamsha (Misfortune - D30)",
  //   12: t("khavedamshaChart") || "Khavedamsha (Auspicious Results - D40)",
  //   13: t("shashtiamshaChart") || "Shashtiamsha (General Well-being - D60)",
  // };

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
                {t("charts") || "Charts"}
              </motion.h1>
              <div className="action-buttons">
                <button
                  className="translate-button"
                  onClick={handleLanguageChange}
                  title="Translate"
                >
                  <Languages className="icon" />
                  {getLanguageDisplayName()}
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
                <div className="insights-content">
                  <div className="charts-grid">
                    <LazyChartLoading
                      delay={0}
                      loadingText="Loading Sun chart..."
                    >
                      <SunChart />
                    </LazyChartLoading>
                    <LazyChartLoading
                      delay={0}
                      loadingText="Loading Moon chart..."
                    >
                      <MoonChart />
                    </LazyChartLoading>
                    <MarsChart />
                    <MercuryChart />
                    <JupiterChart />
                    <VenusChart />
                    <SaturnChart />
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

export default BhinnashtakavargaCharts;
