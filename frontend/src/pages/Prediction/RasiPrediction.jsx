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
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { getRasiPrediction } from "../../api/UserAstrologyData";
import { getUserDetails } from "../../api/user";
import "./Prediction.css";
import { useNavigate } from "react-router-dom";
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

const RasiPrediction = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [rasiPredictionData, setRasiPredictionData] = useState(null);
  const [isLoadingRasiPrediction, setIsLoadingRasiPrediction] = useState(false);
  const [isRasiPredictionOpen, setIsRasiPredictionOpen] = useState(true);
  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Rasi-Prediction Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    setIsLoadingRasiPrediction(true);

    try {
      const storedData = localStorage.getItem("rasiPredictionData");
      if (storedData) {
        setRasiPredictionData(JSON.parse(storedData));
        setIsLoadingRasiPrediction(false);
      } else {
        //Get user's astrology data from database
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingRasiPrediction(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingRasiPrediction(false);
          return;
        }

        //Fetch location data (latitude, longitude, GMT offset)
        const locationData = await fetchLocationData(
          userData.user.placeOfBirth
        );
        //console.log("Fetched location data:", locationData);

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
          setIsLoadingRasiPrediction(false);
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

        //console.log("API Parameters:", apiParams);
        //console.log("User ID:", userData.user._id);

        //Call your rasi prediction API
        const rasiPrediction = await getRasiPrediction(
          userData.user._id,
          apiParams
        );
        //console.log("Rasi Prediction Data:", rasiPrediction);
        localStorage.setItem(
          "rasiPredictionData",
          JSON.stringify(rasiPrediction)
        );
        // toast.success("Rasi prediction data fetched successfully");

        setRasiPredictionData(rasiPrediction);
        setIsLoadingRasiPrediction(false);
      }
    } catch (error) {
      console.error("Failed to fetch rasi prediction:", error);
      toast.error("Failed to load rasi prediction. Please try again.");
      setIsLoadingRasiPrediction(false);
    } finally {
      setIsLoadingRasiPrediction(false);
    }
  };

  // const translatePrerdiction = (prediction) => {
  //   if (!prediction) return "";
  //   // Try to translate, fallback to original if translation doesn't exist
  //   const translated = t(prediction.toLowerCase().replace(/\s+/g, ""));
  //   return translated !== prediction.toLowerCase().replace(/\s+/g, "")
  //     ? translated
  //     : prediction;
  // };

  if (isLoadingRasiPrediction) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Rasi Prediction Data........ </p>
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
                {"Rasi Prediction"}
              </motion.h1>
              <div className="action-buttons">
                {/* <button
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
                </button> */}
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

            {!rasiPredictionData && !isLoadingRasiPrediction && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No charts available"}</h3>
                  <p>
                    {"completeProfile" ||
                      "Please complete your profile to generate charts."}
                  </p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/login")}
                  >
                    {"Go to Login"}
                  </button>
                </div>
              </motion.div>
            )}

            {rasiPredictionData && (
              <motion.div className="prediction-section">
                <div
                  className="prediction-header"
                  onClick={() => setIsRasiPredictionOpen(!isRasiPredictionOpen)}
                >
                  <h2 className="prediction-title">
                    <Star className="icon" /> {"Prediction Insights"}
                  </h2>
                  {isRasiPredictionOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>

                <AnimatePresence>
                  {isRasiPredictionOpen && (
                    <motion.div className="prediction-content">
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Zodiac Sign"}:
                        </span>
                        <span className="prediction-value">
                          {rasiPredictionData?.astrologyInsights?.response
                            ?.zodiac || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Explanation"}:
                        </span>
                        <span className="prediction-value">
                          {rasiPredictionData?.astrologyInsights?.response
                            ?.explanation || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">{"Health"}:</span>
                        <span className="prediction-value">
                          {rasiPredictionData?.astrologyInsights?.response
                            ?.health || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">{"Physical"}:</span>
                        <span className="prediction-value">
                          {rasiPredictionData?.astrologyInsights?.response
                            ?.physical || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Temperature"}:
                        </span>
                        <span className="prediction-value">
                          {rasiPredictionData?.astrologyInsights?.response
                            ?.temp || "N/A"}
                        </span>
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

export default RasiPrediction;
