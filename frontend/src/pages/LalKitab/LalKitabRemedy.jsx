import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  Printer,
  Languages,
  Sun,
  Moon,
  Headphones,
} from "lucide-react";
import { FaBook, FaMars, FaMercury, FaVenus } from "react-icons/fa";
import { RiPlanetFill } from "react-icons/ri";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LalKitab.css";
import { getLalkitabRemedies } from "../../api/LalKitab";
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

const LalKitabRemedy = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [lalkitabRemedyData, setLalkitabRemedyData] = useState(null);
  const [isLoadingLalKitabRemedy, setIsLoadingLalKitabRemedy] = useState(false);
  const [isLalKitabRemedyOpen, setIsLalKitabRemedyOpen] = useState(true);
  const [isSunOpen, setIsSunOpen] = useState(true);
  const [isMoonOpen, setIsMoonOpen] = useState(true);
  const [isMarsOpen, setIsMarsOpen] = useState(true);
  const [isMercuryOpen, setIsMercuryOpen] = useState(true);
  const [isJupiterOpen, setIsJupiterOpen] = useState(true);
  const [isVenusOpen, setIsVenusOpen] = useState(true);
  const [isSaturnOpen, setIsSaturnOpen] = useState(true);
  const [isRahuOpen, setIsRahuOpen] = useState(true);
  const [isKetuOpen, setIsKetuOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Lal Kitab Remedy Report - ${userName}`;

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
    setIsLoadingLalKitabRemedy(true);
    try {
      // load astrology data from local storage
      const cacheKey = `lalkitabRemedyData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setLalkitabRemedyData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingLalKitabRemedy(false);
        } catch (err) {
          console.error("Error parsing lal kitab remedy data:", err);
          setIsLoadingLalKitabRemedy(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingLalKitabRemedy(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingLalKitabRemedy(false);
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
          setIsLoadingLalKitabRemedy(false);
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

        const response = await getLalkitabRemedies(
          userData.user._id,
          apiParams
        );
        //console.log("Fetched dasha data:", response);
        if (response && response.success) {
          setLalkitabRemedyData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Lal Kitab Remedy report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingLalKitabRemedy(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch lal kitab remedy report:", err);
      toast.error("Failed to load lal kitab remedy report. Please try again.");
      setIsLoadingLalKitabRemedy(false);
    } finally {
      setIsLoadingLalKitabRemedy(false);
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
    setIsLoadingLalKitabRemedy(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingLalKitabRemedy(false);
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

  if (isLoadingLalKitabRemedy) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Lal Kitab Remedy Data........ </p>
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
                {"Lal Kitab Remedy"}
              </motion.h1>
              {lalkitabRemedyData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingLalKitabRemedy}
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

            {!lalkitabRemedyData && !isLoadingLalKitabRemedy && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No Lal Kitab Remedy available"}</h3>
                  <p>
                    {
                      "Please complete your profile to generate Lal Kitab Remedy."
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

            {lalkitabRemedyData && (
              <motion.div className="lalkitab-section">
                <div
                  className="lalkitab-header"
                  onClick={() => setIsLalKitabRemedyOpen(!isLalKitabRemedyOpen)}
                >
                  <h2 className="lalkitab-title">
                    <FaBook className="icon" /> {"Lal Kitab Remedy"}
                  </h2>
                  {isLalKitabRemedyOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isLalKitabRemedyOpen && (
                    <motion.div className="lalkitab-content">
                      {/* Sun Details */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsSunOpen(!isSunOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <Sun className="icon" /> {"Sun"}
                          </h2>
                          {isSunOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isSunOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.sun?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.sun?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.sun?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.sun?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Moon Details */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsMoonOpen(!isMoonOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <Moon className="icon" /> {"Moon"}
                          </h2>
                          {isMoonOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isMoonOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.moon?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.moon?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.moon?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.moon?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Mars Details */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsMarsOpen(!isMarsOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <FaMars className="icon" /> {"Mars"}
                          </h2>
                          {isMarsOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isMarsOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.mars?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.mars?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.mars?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.mars?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Mercury  */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsMercuryOpen(!isMercuryOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <FaMercury className="icon" /> {"Mercury"}
                          </h2>
                          {isMercuryOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isMercuryOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.mercury?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.mercury?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.mercury?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.mercury?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Jupiter */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsJupiterOpen(!isJupiterOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <RiPlanetFill className="icon" /> {"Jupiter"}
                          </h2>
                          {isJupiterOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isJupiterOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.jupiter?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.jupiter?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.jupiter?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.jupiter?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Saturn */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsSaturnOpen(!isSaturnOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <RiPlanetFill
                              className="icon"
                              style={{ transform: "rotate(90deg)" }}
                            />{" "}
                            {"Saturn"}
                          </h2>
                          {isSaturnOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isSaturnOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.saturn?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.saturn?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.saturn?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.saturn?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Venus */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsVenusOpen(!isVenusOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <FaVenus className="icon" /> {"Venus"}
                          </h2>
                          {isVenusOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isVenusOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.venus?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.venus?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.venus?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.venus?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Rahu */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsRahuOpen(!isRahuOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <Headphones className="icon" /> {"Rahu"}
                          </h2>
                          {isRahuOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isRahuOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.rahu?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.rahu?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.rahu?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.rahu?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Ketu */}
                      <div className="lalkitab-detail">
                        <div
                          className="lalkitab-header"
                          onClick={() => setIsKetuOpen(!isKetuOpen)}
                        >
                          <h2 className="lalkitab-title">
                            <Headphones
                              className="icon"
                              style={{ transform: "rotate(180deg)" }}
                            />{" "}
                            {"Ketu"}
                          </h2>
                          {isKetuOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isKetuOpen && (
                            <motion.div className="lalkitab-content">
                              <div className="lalkitab-detail">
                                <div className="lalkitab-details-grid">
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"Planet Name"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.ketu?.planet || "N/A"}
                                    </span>
                                  </div>
                                  <div className="lalkitab-detail">
                                    <span className="lalkitab-label">
                                      {"House"}:
                                    </span>
                                    <span className="lalkitab-value">
                                      {lalkitabRemedyData?.lalkitabRemedies
                                        ?.response?.ketu?.house || "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Effects"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies
                                      ?.response?.ketu?.effects || "N/A"}
                                  </span>
                                </div>
                                <div className="lalkitab-detail">
                                  <span className="lalkitab-label">
                                    {"Remedy"}:
                                  </span>
                                  <span className="lalkitab-value">
                                    {lalkitabRemedyData?.lalkitabRemedies?.response?.ketu?.remedies.map(
                                      (remedy, index) => {
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
                                      }
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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

export default LalKitabRemedy;
