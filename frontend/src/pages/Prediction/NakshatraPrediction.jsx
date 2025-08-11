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
import { getNakshatraPrediction } from "../../api/UserAstrologyData";
import { getUserDetails } from "../../api/user";
import "./Prediction.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const NakshatraPrediction = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [nakshatraPredictionData, setNakshatraPredictionData] = useState(null);
  const [isLoadingNakshatraPrediction, setIsLoadingNakshatraPrediction] =
    useState(false);
  const [isNakshatraPredictionOpen, setIsNakshatraPredictionOpen] =
    useState(true);
  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Nakshatra-Prediction Report - ${userName}`;

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
    setIsLoadingNakshatraPrediction(true);

    try {
      const storedData = localStorage.getItem("nakshatraPredictionData");
      if (storedData) {
        setNakshatraPredictionData(JSON.parse(storedData));
        setIsLoadingNakshatraPrediction(false);
      } else {
        //Get user's astrology data from database
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingNakshatraPrediction(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingNakshatraPrediction(false);
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
          setIsLoadingNakshatraPrediction(false);
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

        //Call your nakshatra prediction API
        const nakshatraPrediction = await getNakshatraPrediction(
          userData.user._id,
          apiParams
        );
        //console.log("Nakshatra Prediction Data:", nakshatraPrediction);
        localStorage.setItem(
          "nakshatraPredictionData",
          JSON.stringify(nakshatraPrediction)
        );
        // toast.success("Nakshatra prediction data fetched successfully");

        setNakshatraPredictionData(nakshatraPrediction);
        setIsLoadingNakshatraPrediction(false);
      }
    } catch (error) {
      console.error("Failed to fetch nakshatra prediction:", error);
      toast.error("Failed to load nakshatra prediction. Please try again.");
      setIsLoadingNakshatraPrediction(false);
    } finally {
      setIsLoadingNakshatraPrediction(false);
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

  if (isLoadingNakshatraPrediction) {
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
                {"Nakshatra Prediction"}
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

            {!nakshatraPredictionData && !isLoadingNakshatraPrediction && (
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

            {nakshatraPredictionData && (
              <motion.div className="prediction-section">
                <div
                  className="prediction-header"
                  onClick={() =>
                    setIsNakshatraPredictionOpen(!isNakshatraPredictionOpen)
                  }
                >
                  <h2 className="prediction-title">
                    <Star className="icon" /> {"Prediction Insights"}
                  </h2>
                  {isNakshatraPredictionOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>

                <AnimatePresence>
                  {isNakshatraPredictionOpen && (
                    <motion.div className="prediction-content">
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Nakshatra Name"}:
                        </span>
                        <span className="prediction-value">
                          {nakshatraPredictionData?.astrologyInsights?.response
                            ?.name || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Explanation"}:
                        </span>
                        <span className="prediction-value">
                          {nakshatraPredictionData?.astrologyInsights?.response
                            ?.explanation || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">{"Education"}:</span>
                        <span className="prediction-value">
                          {nakshatraPredictionData?.astrologyInsights?.response
                            ?.education || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">{"Family"}:</span>
                        <span className="prediction-value">
                          {nakshatraPredictionData?.astrologyInsights?.response
                            ?.family || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Prediction"}:
                        </span>
                        <span className="prediction-value">
                          {nakshatraPredictionData?.astrologyInsights?.response
                            ?.prediction || "N/A"}
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

export default NakshatraPrediction;
