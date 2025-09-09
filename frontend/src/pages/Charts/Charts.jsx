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
import "./Charts.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BhavChalit from "./BhavChalit";
import D3 from "./D3";
import D4 from "./D4";
import D6 from "./D6";
import D7 from "./D7";
import D8 from "./D8";
import D10 from "./D10";
import D12 from "./D12";
import D16 from "./D16";
import D20 from "./D20";
import D24 from "./D24";
import D27 from "./D27";
import D30 from "./D30";
import D40 from "./D40";
import D45 from "./D45";
import D60 from "./D60";
import LazyChartLoading from "../../utilityFunction/LazyChartLoading";

const Charts = () => {
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
                <div className="insights-header">
                  {/* <h2 className="insights-title">{t("charts") || "Charts"}</h2> */}
                </div>
                {/* <motion.p className="welcome-subtitle">
                  {t("chartsDescription") ||
                    "Kundli is the term used for Birth Chart in Vedic Astrology. Twelve houses of Kundli show ascendant and planet position in various zodiac signs at the time of birth."}
                </motion.p> */}
                <div className="insights-content">
                  <div className="charts-grid">
                    <LazyChartLoading
                      delay={0}
                      loadingText="Loading Bhav Chalit chart..."
                    >
                      <BhavChalit
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={500}
                      loadingText="Loading D3 chart..."
                    >
                      <D3
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={1000}
                      loadingText="Loading D4 chart..."
                    >
                      <D4
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={1500}
                      loadingText="Loading D6 chart..."
                    >
                      <D6
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={2000}
                      loadingText="Loading D7 chart..."
                    >
                      <D7
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={2500}
                      loadingText="Loading D8 chart..."
                    >
                      <D8
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={3000}
                      loadingText="Loading D10 chart..."
                    >
                      <D10
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={3500}
                      loadingText="Loading D12 chart..."
                    >
                      <D12
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={4000}
                      loadingText="Loading D16 chart..."
                    >
                      <D16
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={4500}
                      loadingText="Loading D20 chart..."
                    >
                      <D20
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={5000}
                      loadingText="Loading D24 chart..."
                    >
                      <D24
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={5500}
                      loadingText="Loading D27 chart..."
                    >
                      <D27
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={6000}
                      loadingText="Loading D30 chart..."
                    >
                      <D30
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={6500}
                      loadingText="Loading D40 chart..."
                    >
                      <D40
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={7000}
                      loadingText="Loading D45 chart..."
                    >
                      <D45
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>

                    <LazyChartLoading
                      delay={7500}
                      loadingText="Loading D60 chart..."
                    >
                      <D60
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>
                    {/* {astrologyData.charts.slice(3, 16).map((chart, index) => (
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
                    ))} */}
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
