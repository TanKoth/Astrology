import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, time } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  Sparkles,
  Printer,
  Languages,
  ScrollText,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { getPanchangPrediction } from "../../api/UserAstrologyData";
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

const PanchangPrediction = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [panchangPredictionData, setPanchangPredictionData] = useState(null);
  const [isLoadingPanchangPrediction, setIsLoadingPanchangPrediction] =
    useState(false);
  const [isPanchangPredictionOpen, setIsPanchangPredictionOpen] =
    useState(true);
  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Panchang-Prediction Report - ${userName}`;

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
    setIsLoadingPanchangPrediction(true);

    try {
      const storedData = localStorage.getItem("panchangPredictionData");
      if (storedData) {
        setPanchangPredictionData(JSON.parse(storedData));
        setIsLoadingPanchangPrediction(false);
      } else {
        //Get user's astrology data from database
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingPanchangPrediction(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingPanchangPrediction(false);
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
          setIsLoadingPanchangPrediction(false);
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

        //Call your panchang prediction API
        const panchangPrediction = await getPanchangPrediction(
          userData.user._id,
          apiParams
        );
        //console.log("Panchang Prediction Data:", panchangPrediction);
        localStorage.setItem(
          "panchangPredictionData",
          JSON.stringify(panchangPrediction)
        );
        // toast.success("Panchang prediction data fetched successfully");

        setPanchangPredictionData(panchangPrediction);
        setIsLoadingPanchangPrediction(false);
      }
    } catch (error) {
      console.error("Failed to fetch panchang prediction:", error);
      toast.error("Failed to load panchang prediction. Please try again.");
      setIsLoadingPanchangPrediction(false);
    } finally {
      setIsLoadingPanchangPrediction(false);
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

  if (isLoadingPanchangPrediction) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Panchang Prediction Data........ </p>
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
                {"Panchang Prediction"}
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

            {!panchangPredictionData && !isLoadingPanchangPrediction && (
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

            {panchangPredictionData && (
              <motion.div className="prediction-section">
                <div
                  className="prediction-header"
                  onClick={() =>
                    setIsPanchangPredictionOpen(!isPanchangPredictionOpen)
                  }
                >
                  <h2 className="prediction-title">
                    <Star className="icon" /> {"Prediction Insights"}
                  </h2>
                  {isPanchangPredictionOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>

                <AnimatePresence>
                  {isPanchangPredictionOpen && (
                    <motion.div className="prediction-content">
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Explanation"} :
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.explantion || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Karan"} :{" "}
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.karan?.name || "N/A"}
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.karan?.prediction || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Nakshatra"} :{" "}
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.nakshatra?.name || "N/A"}
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.nakshatra?.prediction || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Tithi"} :{" "}
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.tithi?.name || "N/A"}
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.tithi?.prediction || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Weekday"} : {"  "}
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.weekday?.name || "N/A"}
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.weekday?.prediction || "N/A"}
                        </span>
                      </div>
                      <div className="prediction-detail">
                        <span className="prediction-label">
                          {"Yoga"} : {"  "}
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.yoga?.name || "N/A"}
                        </span>
                        <span className="prediction-value">
                          {panchangPredictionData?.astrologyInsights?.response
                            ?.yoga?.prediction || "N/A"}
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

export default PanchangPrediction;
