import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  Printer,
  Languages,
} from "lucide-react";
import { FaBook } from "react-icons/fa";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LalKitab.css";
import { getLalkitabDebt } from "../../api/LalKitab";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { Button } from "antd";

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

const LalKitabDebt = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [lalkitabDebtData, setLalkitabDebtData] = useState(null);
  const [isLoadingLalKitabDebt, setIsLoadingLalKitabDebt] = useState(false);
  const [isLalKitabDebtOpen, setIsLalKitabDebtOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Lal Kitab Debt Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingLalKitabDebt(true);
    try {
      // load astrology data from local storage
      const cacheKey = `lalkitabDebtData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setLalkitabDebtData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingLalKitabDebt(false);
        } catch (err) {
          console.error("Error parsing lal kitab debt data:", err);
          setIsLoadingLalKitabDebt(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingLalKitabDebt(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingLalKitabDebt(false);
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
          setIsLoadingLalKitabDebt(false);
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

        const response = await getLalkitabDebt(userData.user._id, apiParams);
        //console.log("Fetched dasha data:", response);
        if (response && response.success) {
          setLalkitabDebtData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Lal Kitab Debt report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingLalKitabDebt(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch lal kitab debt report:", err);
      toast.error("Failed to load lal kitab debt report. Please try again.");
      setIsLoadingLalKitabDebt(false);
    } finally {
      setIsLoadingLalKitabDebt(false);
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
    setIsLoadingLalKitabDebt(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingLalKitabDebt(false);
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

  if (isLoadingLalKitabDebt) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Lal Kitab Debt Data........ </p>
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
                {"Lal Kitab Debt"}
              </motion.h1>
              {lalkitabDebtData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingLalKitabDebt}
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

            {!lalkitabDebtData && !isLoadingLalKitabDebt && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No Lal Kitab Debt available"}</h3>
                  <p>
                    {"Please complete your profile to generate Lal Kitab Debt."}
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

            {lalkitabDebtData && (
              <motion.div className="lalkitab-section">
                <div
                  className="lalkitab-header"
                  onClick={() => setIsLalKitabDebtOpen(!isLalKitabDebtOpen)}
                >
                  <h2 className="lalkitab-title">
                    <FaBook className="icon" /> {"Lal Kitab Debt"}
                  </h2>
                  {isLalKitabDebtOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isLalKitabDebtOpen && (
                    <motion.div className="lalkitab-content">
                      {lalkitabDebtData?.lalkitabDebt?.response.map(
                        (responses, index) => {
                          return (
                            <div className="lalkitab-detail" key={index}>
                              <span className="lalkitab-label">
                                {"Debt Name"}:
                              </span>
                              <span className="lalkitab-value">
                                {responses?.debt_name || "N/A"}
                              </span>
                              <br />
                              <span className="lalkitab-label">
                                {"Reason of Debt"}:
                              </span>
                              <span className="lalkitab-value">
                                {responses?.planetory || "N/A"}
                              </span>
                              <br />
                              <span className="lalkitab-label">
                                {"Indications"}:
                              </span>
                              <span className="lalkitab-value">
                                {responses?.indications.map(
                                  (indication, index) => {
                                    return (
                                      <div key={index}>
                                        <ul
                                          style={{
                                            color: "#cbd5e1",
                                            fontSize: "1.2rem",
                                          }}
                                        >
                                          <li>{indication}</li>
                                        </ul>
                                      </div>
                                    );
                                  }
                                ) || "N/A"}
                              </span>
                              <br />
                              <span className="lalkitab-label">
                                {"Events"}:
                              </span>
                              <span className="lalkitab-value">
                                {responses?.events.map((event, index) => {
                                  return (
                                    <div key={index}>
                                      <ul
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "1.2rem",
                                        }}
                                      >
                                        <li>{event}</li>
                                      </ul>
                                    </div>
                                  );
                                }) || "N/A"}
                              </span>
                              <br />
                              <span className="lalkitab-label">
                                {"Remedies"}:
                              </span>
                              <span className="lalkitab-value">
                                {responses?.remedies.map((remedy, index) => {
                                  return (
                                    <div key={index}>
                                      <ul
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "1.2rem",
                                        }}
                                      >
                                        <li>{remedy}</li>
                                      </ul>
                                    </div>
                                  );
                                }) || "N/A"}
                              </span>
                            </div>
                          );
                        }
                      )}
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

export default LalKitabDebt;
