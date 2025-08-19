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
import { getGemstoneReport } from "../../api/Report";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { Button } from "antd";
import { GemstoneTable } from "./ReportTable";

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

const Gemstone = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [gemstoneData, setGemstoneData] = useState(null);
  const [isLoadingGemstone, setIsLoadingGemstone] = useState(false);
  const [isGemstoneOpen, setIsGemstoneOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Gemstone Report - ${userName}`;

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

  const fetchReport = async () => {
    setIsLoadingGemstone(true);
    try {
      // load astrology data from local storage
      const storedData = localStorage.getItem("gemstoneData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setGemstoneData(parsedData);
          setIsLoadingGemstone(false);
        } catch (err) {
          console.error("Error parsing gemstone data:", err);
          setIsLoadingGemstone(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingGemstone(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingGemstone(false);
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
          setIsLoadingGemstone(false);
          return;
        }
        //Prepare data for API call
        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          timeOfBirth: userData.user.timeOfBirth, // Format: HH:MM
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
        };

        //console.log("API Parameters:", apiParams);
        //console.log("User ID:", userData.user._id);
        //if no data found, navigate to login page
        const response = await getGemstoneReport(userData.user._id, apiParams);
        //console.log("Fetched gemstone data:", response);
        if (response && response.success) {
          setGemstoneData(response);
          localStorage.setItem("gemstoneData", JSON.stringify(response));
          toast.success("Gemstone report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setIsLoadingGemstone(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch gemstone report:", err);
      toast.error("Failed to load gemstone report. Please try again.");
      setIsLoadingGemstone(false);
    } finally {
      setIsLoadingGemstone(false);
    }
  };

  if (isLoadingGemstone) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Gemstone Data........ </p>
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
                {"Gemstone Report"}
              </motion.h1>
              {gemstoneData && (
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
              )}
            </div>

            {!gemstoneData && !isLoadingGemstone && (
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

            {gemstoneData && (
              <motion.div className="favorable-section">
                <div
                  className="favorable-header"
                  onClick={() => setIsGemstoneOpen(!isGemstoneOpen)}
                >
                  <h2 className="favorable-title">
                    <Gem className="icon" /> {"Gemstones"}
                  </h2>
                  {isGemstoneOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isGemstoneOpen && (
                    <motion.div className="favorable-content">
                      <div className="favorable-detail">
                        {/* <span className="favorable-label">
                          {"Gemstone Details"}
                        </span> */}
                        <span className="favorable-value">
                          <GemstoneTable gemstoneData={gemstoneData} />
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">{"Mantra"}</span>
                        <span className="favorable-value">
                          {gemstoneData?.gemstoneReport?.response?.mantra ||
                            "Om Namah Shivaya"}
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">
                          {"Time to Wear"}
                        </span>
                        <span className="favorable-value">
                          {gemstoneData?.gemstoneReport?.response
                            ?.time_to_wear || "Unknown"}
                        </span>
                      </div>
                      <div className="favorable-detail">
                        <span className="favorable-label">{"Methods"}</span>
                        <span className="favorable-value">
                          {gemstoneData?.gemstoneReport?.response?.methods ||
                            "Unknown"}
                        </span>
                      </div>

                      <div className="favorable-detail">
                        <span className="favorable-label">
                          {"Important Information"}
                        </span>
                        <span className="favorable-value">
                          <p style={{ color: "#cbd5e1" }}>
                            While wearing a gem please keep certain things in
                            mind. Purchase only original gemstones as wearing
                            those that are not original will have no effect. You
                            also need to wear the prescribed weight, what is
                            commonly known as "Ratti". Now days markets are
                            flooded with fake gems. To give our readers genuine
                            assistance Vedic Vedang.AI brings to you our unique
                            genuine collection of Gemstones. To know more about
                            it please contact us!
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

export default Gemstone;
