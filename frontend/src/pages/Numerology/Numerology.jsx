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
import { getNumerology } from "../../api/Numerology";
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

const Numerology = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [numerologyData, setNumerologyData] = useState(null);
  const [isLoadingNumerology, setIsLoadingNumerology] = useState(false);
  const [isNumerologyOpen, setIsNumerologyOpen] = useState(true);
  const [isDestinyNumberOpen, setIsDestinyNumberOpen] = useState(true);
  const [isPersonalityNumberOpen, setIsPersonalityNumberOpen] = useState(false);
  const [isSoulNumberOpen, setIsSoulNumberOpen] = useState(false);
  const [isAgendaNumberOpen, setIsAgendaNumberOpen] = useState(false);
  const [isAttitudeNumberOpen, setIsAttitudeNumberOpen] = useState(false);
  const [isCharacterNumberOpen, setIsCharacterNumberOpen] = useState(false);
  const [isPurposeNumberOpen, setIsPurposeNumberOpen] = useState(false);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Numerology Report - ${userName}`;

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
    setIsLoadingNumerology(true);
    try {
      // load astrology data from local storage
      const cacheKey = `numerologyData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setNumerologyData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingNumerology(false);
        } catch (err) {
          console.error("Error parsing numerology data:", err);
          setIsLoadingNumerology(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingNumerology(false);
          return;
        }
        if (!userData.user.name) {
          toast.error("Name not found. Please update your profile.");
          setIsLoadingNumerology(false);
          return;
        }
        //Prepare data for API call
        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          name: userData.user.name,
          lang: lang,
        };

        const response = await getNumerology(userData.user._id, apiParams);
        //console.log("Fetched numerology data:", response);
        if (response && response.success) {
          setNumerologyData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Numerology report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingNumerology(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch numerology report:", err);
      toast.error("Failed to load numerology report. Please try again.");
      setIsLoadingNumerology(false);
    } finally {
      setIsLoadingNumerology(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingNumerology(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingNumerology(false);
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

  if (isLoadingNumerology) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Numerology Data........ </p>
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
              <motion.h1 className="welcome-title">{"Numerology"}</motion.h1>
              {numerologyData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingNumerology}
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

            {!numerologyData && !isLoadingNumerology && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No Numerology Data available"}</h3>
                  <p>
                    {
                      "Please complete your profile to generate Numerology Data."
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

            {numerologyData && (
              <motion.div className="numerology-section">
                <div
                  className="numerology-header"
                  onClick={() => setIsNumerologyOpen(!isNumerologyOpen)}
                >
                  <h2 className="numerology-title">
                    <GoNumber className="icon" /> {"Numerology"}
                  </h2>
                  {isNumerologyOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isNumerologyOpen && (
                    <motion.div className="numerology-content">
                      {/* Destiny Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsDestinyNumberOpen(!isDestinyNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Destiny Number"}
                          </h2>
                          {isDestinyNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isDestinyNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.destiny?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.destiny?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.destiny?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.destiny?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Personality Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsPersonalityNumberOpen(!isPersonalityNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Personality Number"}
                          </h2>
                          {isPersonalityNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isPersonalityNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.personality?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.personality?.number ??
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.personality?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.personality?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Soul Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() => setIsSoulNumberOpen(!isSoulNumberOpen)}
                        >
                          <h2 className="numerology-title">{"Soul Number"}</h2>
                          {isSoulNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isSoulNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.soul?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.soul?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.soul?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.soul?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Agenda Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsAgendaNumberOpen(!isAgendaNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Agenda Number"}
                          </h2>
                          {isAgendaNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isAgendaNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.agenda?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.agenda?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.agenda?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.agenda?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Attitude Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsAttitudeNumberOpen(!isAttitudeNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Attitude Number"}
                          </h2>
                          {isAttitudeNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isAttitudeNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.attitude?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.attitude?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.attitude?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.attitude?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Character Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsCharacterNumberOpen(!isCharacterNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Character Number"}
                          </h2>
                          {isCharacterNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isCharacterNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.character?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.character?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.character?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.character?.description || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Purpose Number */}
                      <div className="numerology-detail">
                        <div
                          className="numerology-header"
                          onClick={() =>
                            setIsPurposeNumberOpen(!isPurposeNumberOpen)
                          }
                        >
                          <h2 className="numerology-title">
                            {"Purpose Number"}
                          </h2>
                          {isPurposeNumberOpen ? (
                            <ChevronUp className="chev-icon" />
                          ) : (
                            <ChevronDown className="chev-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isPurposeNumberOpen && (
                            <motion.div className="numerology-content">
                              <div className="numerology-detail">
                                <div className="numerology-details-grid">
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Title"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.purpose?.title || "N/A"}
                                    </span>
                                  </div>
                                  <div className="numerology-detail">
                                    <span className="numerology-label">
                                      {"Number"}:
                                    </span>
                                    <span className="numerology-value">
                                      {numerologyData?.numerologyReport
                                        ?.response?.purpose?.number ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Meaning"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.purpose?.meaning || "N/A"}
                                  </span>
                                </div>
                                <div className="numerology-detail">
                                  <span className="numerology-label">
                                    {"Description"}:
                                  </span>
                                  <span className="numerology-value">
                                    {numerologyData?.numerologyReport?.response
                                      ?.purpose?.description || "N/A"}
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

export default Numerology;
