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
import { GoNumber } from "react-icons/go";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Numerology.css";
import { getBirthdateNumber } from "../../api/Numerology";
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

const BirthdateNumber = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [birthdateNumberData, setBirthdateNumberData] = useState(null);
  const [isLoadingBirthdateNumber, setIsLoadingBirthdateNumber] =
    useState(false);
  const [isBirthdateNumberOpen, setIsBirthdateNumberOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Birthdate Number Report - ${userName}`;

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
    setIsLoadingBirthdateNumber(true);
    try {
      // load astrology data from local storage
      const cacheKey = `birthdateNumberData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setBirthdateNumberData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingBirthdateNumber(false);
        } catch (err) {
          console.error("Error parsing birthdate number data:", err);
          setIsLoadingBirthdateNumber(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingBirthdateNumber(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingBirthdateNumber(false);
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
          setIsLoadingBirthdateNumber(false);
          return;
        }
        //Prepare data for API call
        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          timeOfBirth: userData.user.timeOfBirth, // Format: HH:MM
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
          la: lang,
        };

        const response = await getBirthdateNumber(userData.user._id, apiParams);
        //console.log("Fetched birthdate number data:", response);
        if (response && response.success) {
          setBirthdateNumberData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Birthdate Number report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingBirthdateNumber(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch birthdate number report:", err);
      toast.error("Failed to load birthdate number report. Please try again.");
      setIsLoadingBirthdateNumber(false);
    } finally {
      setIsLoadingBirthdateNumber(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingBirthdateNumber(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingBirthdateNumber(false);
    }
  };

  // Get language display name
  const getLanguageDisplayName = () => {
    const languageNames = {
      en: "हिंदी",
      hi: "English",
    };
    return languageNames[currentLanguage] || "हिंदी";
  };

  if (isLoadingBirthdateNumber) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Birthdate Number Data........ </p>
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
                {"Birthdate Number"}
              </motion.h1>
              {birthdateNumberData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingBirthdateNumber}
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

            {!birthdateNumberData && !isLoadingBirthdateNumber && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No Birthdate Number available"}</h3>
                  <p>
                    {
                      "Please complete your profile to generate Birthdate Number."
                    }
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

            {birthdateNumberData && (
              <motion.div className="numerology-section">
                <div
                  className="numerology-header"
                  onClick={() =>
                    setIsBirthdateNumberOpen(!isBirthdateNumberOpen)
                  }
                >
                  <h2 className="numerology-title">
                    <GoNumber className="icon" /> {"Birthdate Number"}
                  </h2>
                  {isBirthdateNumberOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isBirthdateNumberOpen && (
                    <motion.div className="numerology-content">
                      <div className="numerology-detail">
                        <span className="numerology-label">{"Number"}:</span>
                        <span className="numerology-value">
                          {birthdateNumberData?.data?.data?.birthday_number
                            ?.number ?? "N/A"}
                        </span>
                      </div>
                      <div className="numerology-detail">
                        <span className="numerology-label">
                          {"Description"}:
                        </span>
                        <span className="numerology-value">
                          {birthdateNumberData?.data?.data?.birthday_number
                            ?.description ?? "N/A"}
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

export default BirthdateNumber;
