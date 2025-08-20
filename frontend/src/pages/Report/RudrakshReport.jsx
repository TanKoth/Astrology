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
import "./Favorable.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRudrakshReport } from "../../api/Report";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { Button } from "antd";
import { RudrakshTable } from "./ReportTable";

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

const RudrakshReport = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [rudrakshData, setRudrakshData] = useState(null);
  const [isLoadingRudraksh, setIsLoadingRudraksh] = useState(false);
  const [isRudrakshOpen, setIsRudrakshOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Rudraksh Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Helper function to translate gemstone names
  // const translateGemstone = (gemstoneName) => {
  //   if (!gemstoneName) return "";
  //   // Try to translate, fallback to original if translation doesn't exist
  //   const translated = t(gemstoneName.toLowerCase().replace(/\s+/g, ""));
  //   return translated !== gemstoneName.toLowerCase().replace(/\s+/g, "")
  //     ? translated
  //     : gemstoneName;
  // };

  useEffect(() => {
    if (user) {
      fetchReport();
    }
  }, [user]);

  const fetchReport = async (lang = "en", forceRefresh = false) => {
    setIsLoadingRudraksh(true);
    try {
      // load astrology data from local storage
      const cacheKey = `rudrakshData_${user._id}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setRudrakshData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingRudraksh(false);
        } catch (err) {
          console.error("Error parsing rudraksh data:", err);
          setIsLoadingRudraksh(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingRudraksh(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingRudraksh(false);
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
          setIsLoadingRudraksh(false);
          return;
        }
        //Prepare data for API call
        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          timeOfBirth: userData.user.timeOfBirth, // Format: HH:MM
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
          lang: lang,
        };

        //console.log("API Parameters:", apiParams);
        //console.log("User ID:", userData.user._id);
        //if no data found, navigate to login page
        const response = await getRudrakshReport(userData.user._id, apiParams);
        //console.log("Fetched rudraksh data:", response);
        if (response && response.success) {
          setRudrakshData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Rudraksh report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingRudraksh(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch rudraksh report:", err);
      toast.error("Failed to load rudraksh report. Please try again.");
      setIsLoadingRudraksh(false);
    } finally {
      setIsLoadingRudraksh(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "mr",
      mr: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingRudraksh(true);

    try {
      await fetchReport(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingRudraksh(false);
    }
  };

  // Get language display name
  const getLanguageDisplayName = () => {
    const languageNames = {
      en: "हिंदी",
      hi: "मराठी",
      mr: "English",
    };
    return languageNames[currentLanguage] || "हिंदी";
  };

  if (isLoadingRudraksh) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Rudraksh Data........ </p>
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
                {"Rudraksh Report"}
              </motion.h1>
              {rudrakshData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingRudraksh}
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
              )}
            </div>

            {!rudrakshData && !isLoadingRudraksh && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No charts available"}</h3>
                  <p>{"Please complete your profile to generate charts."}</p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/login")}
                  >
                    {"Go to Login"}
                  </button>
                </div>
              </motion.div>
            )}

            {rudrakshData && (
              <motion.div className="favorable-section">
                <div
                  className="favorable-header"
                  onClick={() => setIsRudrakshOpen(!isRudrakshOpen)}
                >
                  <h2 className="favorable-title">
                    <Gem className="icon" /> {"Rudraksh"}
                  </h2>
                  {isRudrakshOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isRudrakshOpen && (
                    <motion.div className="favorable-content">
                      <div className="favorable-detail">
                        {/* <span className="favorable-label">
                          {"Rudraksh Details"}
                        </span> */}
                        <span className="favorable-value">
                          <RudrakshTable rudrakshData={rudrakshData} />
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">{"Mantra"}</span>
                        <span className="favorable-value">
                          {rudrakshData?.rudrakshReport?.response?.mantra ||
                            "Om Namah Shivaya"}
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">
                          {"Purification"}
                        </span>
                        <span className="favorable-value">
                          {rudrakshData?.rudrakshReport?.response
                            ?.purification || "Unknown"}
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">
                          {"Important Information"}
                        </span>
                        <span className="favorable-value">
                          <p style={{ color: "#cbd5e1" }}>
                            While wearing a rudraksh please keep certain things
                            in mind. Purchase only original rudraksh as wearing
                            those that are not original will have no effect. You
                            also need to wear the prescribed weight, what is
                            commonly known as "Ratti". Now days markets are
                            flooded with fake rudraksh. To give our readers
                            genuine assistance Vedic Vedang.AI brings to you our
                            unique genuine collection of Rudraksh. To know more
                            about it please contact us!
                          </p>
                          <Button
                            htmlType="submit"
                            className="favorable-submit-button"
                            onClick={() => navigate("/contactUS")}
                          >
                            Contact Us!
                          </Button>
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

export default RudrakshReport;

//export default RudrakshReport;
