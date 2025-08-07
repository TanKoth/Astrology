import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, time } from "framer-motion";
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
  Moon,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { getUserAstrologyData } from "../../api/UserAstrologyData";
import { getUserDetails } from "../../api/user";
import "./Prediction.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";

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

const MoonPrediction = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [moonPredictionData, setMoonPredictionData] = useState(null);
  const [isLoadingMoonPrediction, setIsLoadingMoonPrediction] = useState(false);
  const [isMoonPredictionOpen, setIsMoonPredictionOpen] = useState(true);
  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {};

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    setIsLoadingMoonPrediction(true);

    try {
      const storedData = localStorage.getItem("moonPredictionData");
      if (storedData) {
        setMoonPredictionData(JSON.parse(storedData));
        setIsLoadingMoonPrediction(false);
      } else {
        //Get user's astrology data from database
        const userData = await getUserDetails(user._id);
        console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingMoonPrediction(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingMoonPrediction(false);
          return;
        }

        //Fetch location data (latitude, longitude, GMT offset)
        const locationData = await fetchLocationData(
          userData.user.placeOfBirth
        );
        console.log("Fetched location data:", locationData);

        if (
          !locationData ||
          typeof locationData.latitude === "undefined" ||
          typeof locationData.longitude === "undefined" ||
          typeof locationData.gmtOffset === "undefined"
        ) {
          console.error("Invalid location data structure:", locationData);
          toast.error(
            "Could not fetch complete location data for birth place. Please check your birth place format."
          );
          setIsLoadingMoonPrediction(false);
          return;
        }
        //Prepare data for API call
        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          timeOfBirth: userData.user.timeOfBirth, // Format: HH:MM
          //birthPlace: userData.placeofBirth,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
          //userId: userData.user._id,
        };

        console.log("API Parameters:", apiParams);
        console.log("User ID:", userData.user._id);

        //Call your moon prediction API
        const moonPrediction = await getUserAstrologyData(
          userData.user._id,
          apiParams
        );
        console.log("Moon Prediction Data:", moonPrediction);
        localStorage.setItem(
          "moonPredictionData",
          JSON.stringify(moonPrediction)
        );
        // toast.success("Moon prediction data fetched successfully");

        setMoonPredictionData(moonPrediction);
        setIsLoadingMoonPrediction(false);
      }
    } catch (error) {
      console.error("Failed to fetch moon prediction:", error);
      toast.error("Failed to load moon prediction. Please try again.");
      setIsLoadingMoonPrediction(false);
    } finally {
      setIsLoadingMoonPrediction(false);
    }
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
                  <Moon className="icon" /> MoonPrediction
                </h2>
              </div>
              <motion.p className="welcome-subtitle">
                MoonPrediction are generated based on your birth details. If you
                have not provided your birth details, please complete your
                profile to generate Dosh.
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

export default MoonPrediction;
