import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  Printer,
  Languages,
  Moon,
} from "lucide-react";
import { FaMars } from "react-icons/fa";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dosh.css";
import { getMangalDosh } from "../../api/Dosh";
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

const MangalDosh = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [mangalDoshData, setMangalDoshData] = useState(null);
  const [isLoadingMangalDosh, setIsLoadingMangalDosh] = useState(false);
  const [isMangalDoshOpen, setIsMangalDoshOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Mangal Dosh Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) => key.startsWith(`mangalDoshData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingMangalDosh(true);
    try {
      // load astrology data from local storage
      const cacheKey = `mangalDoshData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setMangalDoshData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingMangalDosh(false);
        } catch (err) {
          console.error("Error parsing mangal dosh data:", err);
          setIsLoadingMangalDosh(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingMangalDosh(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingMangalDosh(false);
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
          setIsLoadingMangalDosh(false);
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

        const response = await getMangalDosh(userData.user._id, apiParams);
        //console.log("Fetched mangal dosh data:", response);
        if (response && response.success) {
          setMangalDoshData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Mangal Dosh report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingMangalDosh(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch mangal dosh report:", err);
      toast.error("Failed to load mangal dosh report. Please try again.");
      setIsLoadingMangalDosh(false);
    } finally {
      setIsLoadingMangalDosh(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingMangalDosh(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingMangalDosh(false);
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

  if (isLoadingMangalDosh) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Mangal Dosh Data........ </p>
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
              <motion.h1 className="welcome-title">{"Mangal Dosh"}</motion.h1>
              {mangalDoshData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingMangalDosh}
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

            {!mangalDoshData && !isLoadingMangalDosh && (
              <motion.div className="dosh-content">
                <div className="dosh-detail">
                  <span className="dosh-label">{"What is Mangal Dosh?"}:</span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    If the planet Mars is placed in the 12th house, 1st house,
                    4th house, 7th house or 8th house from Lagna or Ascendant,
                    then it forms Mangal Dosha in one's Birth Chart. Second
                    house is also considered for Sevvai Dosham according to
                    South Indian Astrologers.
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Mangal Dosha is seen through the Lagna Chart, Moon Sign
                    Chart and Venus Chart. If Mars occupies above houses in
                    one's natal chart, then it will be considered as "High
                    manglik Dosha". If it is occupying these houses in any one
                    of these charts, then it will be considered as "Low Manglik
                    Dosha".
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Manglik dosha has greater significance at the time of
                    marriage as it is important parameter which needs to be
                    analysed carefully while matching horoscope. By doing so,
                    compatibility between two partner can be ensured in order to
                    have happy married life. It is believed that if a person has
                    any kind of Manglik Dosha present in his birth chart then he
                    may get unhappiness after marriage.
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    The malefic effects of Mars will be cancelled if planet Mars
                    in your Kundali is being aspected by the benefic planets
                    like Jupiter or Venus.
                  </p>
                  <span className="dosh-label">
                    {"Types of Manglik Dosha"} :
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    High Mangal Dosha: If Mars is placed in 1st, 2nd, 4th, 7th,
                    8th or 12th houses from Natal Chart, Moon Chart and Venus
                    Chart, then it will be considered as High Manglik Dosha.
                    Person may go with many hardships in his life.
                  </p>
                  <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    <li>
                      <span className="dosh-label">Low Mangal Dosha: </span>If
                      Mars is placed in 1st, 2nd, 4th, 7th, 8th or 12th houses
                      from any one of these three charts like Natal Chart, Moon
                      Chart and Venus Chart, then it will be considered as Low
                      Manglik Dosha or "Partial Manglik Dosha". It may be
                      nullified after the age of 28, according to some
                      astrologers.
                    </li>
                    <br />
                    <li>
                      <span className="dosh-label">High Mangal Dosha: </span>If
                      Mars is placed in 1st, 2nd, 4th, 7th, 8th or 12th houses
                      from Natal Chart, Moon Chart and Venus Chart, then it will
                      be considered as High Manglik Dosha. Person may go with
                      many hardships in his life.
                    </li>
                  </ul>

                  <span className="dosh-label">
                    {"Effects of Mangal Dosha based on House Placement"} :
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>
                        If it is placed in first house, then it may cause
                        conflicts in marital life.
                      </li>
                      <li>
                        If Mars is placed in second house, it may cause trouble
                        to family and ultimately again the marriage life.
                      </li>
                      <li>
                        If the same planet is placed in fourth house, then it
                        may cause trouble to the professional front.
                      </li>
                      <li>
                        If it is placed in seventh house, then it may increase
                        the dominance within the person which may lead to the
                        disharmony in a relationship.
                      </li>
                      <li>
                        If the same planet occupies the eighth house, it may
                        lead to the loss of paternal property.
                      </li>
                      <li>
                        If it is placed in twelfth house, it may cause to the
                        mental stress and hence the family life would be
                        affected.
                      </li>
                    </ul>
                  </span>

                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Check Mangal Dosh
                  </Button>
                </div>
              </motion.div>
            )}

            {mangalDoshData && (
              <motion.div className="dosh-section">
                <div
                  className="dosh-header"
                  onClick={() => setIsMangalDoshOpen(!isMangalDoshOpen)}
                >
                  <h2 className="sign-title">
                    <FaMars className="icon" /> {"Mangal Dosh"}
                  </h2>
                  {isMangalDoshOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isMangalDoshOpen && (
                    <motion.div className="dosh-content">
                      <div className="dosh-detail">
                        <span className="dosh-label">
                          {"Mangal Dosh Present"}:
                        </span>
                        <span className="dosh-value">
                          {mangalDoshData?.mangalDosh?.data?.has_dosha !==
                          undefined
                            ? mangalDoshData?.mangalDosh?.data?.has_dosha
                              ? `Yes, ${user?.name} has Mangal Dosh`
                              : `No, ${user?.name} does not have Mangal Dosh`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="dosh-detail">
                        <span className="dosh-label">{"Desciption"}:</span>
                        <span className="dosh-value">
                          {mangalDoshData?.mangalDosh?.data?.description ||
                            "N/A"}
                        </span>
                      </div>
                      {mangalDoshData?.mangalDosh?.response
                        ?.is_dosha_present && (
                        <>
                          <div className="dosh-detail">
                            <span className="dosh-label">{"Remedies"}:</span>
                            <span className="dosh-value">
                              {mangalDoshData?.mangalDosh?.data?.remedies.map(
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
                          <div className="dosh-detail">
                            <span className="dosh-label">{"Exceptions"}:</span>
                            <span className="dosh-value">
                              {mangalDoshData?.mangalDosh?.data?.exceptions.map(
                                (exception, index) => {
                                  return (
                                    <div key={index}>
                                      <ul
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "1.2rem",
                                        }}
                                      >
                                        <li>{exception}</li>
                                      </ul>
                                    </div>
                                  );
                                }
                              ) || "N/A"}
                            </span>
                          </div>
                        </>
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

export default MangalDosh;
