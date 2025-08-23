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
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign.css";
import { getMoonSign } from "../../api/Calculator";
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

const MoonSign = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [moonSignData, setMoonSignData] = useState(null);
  const [isLoadingMoonSign, setIsLoadingMoonSign] = useState(false);
  const [isMoonSignOpen, setIsMoonSignOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `MoonSign Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) => key.startsWith(`moonSignData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingMoonSign(true);
    try {
      // load astrology data from local storage
      const cacheKey = `moonSignData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setMoonSignData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingMoonSign(false);
        } catch (err) {
          console.error("Error parsing moon sign data:", err);
          setIsLoadingMoonSign(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingMoonSign(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingMoonSign(false);
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
          setIsLoadingMoonSign(false);
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

        const response = await getMoonSign(userData.user._id, apiParams);
        //console.log("Fetched moon sign data:", response);
        if (response && response.success) {
          setMoonSignData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Moon Sign report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingMoonSign(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch moon sign report:", err);
      toast.error("Failed to load moon sign report. Please try again.");
      setIsLoadingMoonSign(false);
    } finally {
      setIsLoadingMoonSign(false);
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
    setIsLoadingMoonSign(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingMoonSign(false);
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

  if (isLoadingMoonSign) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading MoonSign Data........ </p>
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
              <motion.h1 className="welcome-title">{"Moon Sign"}</motion.h1>
              {moonSignData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingMoonSign}
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

            {!moonSignData && !isLoadingMoonSign && (
              <motion.div className="sign-content">
                <div className="sign-detail">
                  <span className="sign-label">
                    {"Importance of Moon Sign"}:
                  </span>
                  <h4 style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Some questions may often arise into your mind. For example:
                    What is my Moon sign? What is that mean? Why do we calculate
                    Moon sign? Let's have a look about Importance of Moon Sign
                    in order to understand it better:
                    <br />
                    <br />
                    <ul>
                      <li>
                        It can reveal many information related to personality,
                        character, nature, behaviour, likes and dislikes and
                        your inherent attributes.
                      </li>
                      <li>
                        It helps you to determine your fate in order to drive
                        yourself towards the right path.
                      </li>
                      <li>
                        It plays pivotal role in finding your compatibility with
                        other people, especially with your partner. It may be
                        your mother, brother, friends, father, lover, wives or
                        anyone running into your life.
                      </li>
                      <li>
                        It helps you to sustain the long lasting and harmonical
                        relation with everyone.
                      </li>
                      <li>
                        It determines your life path, luck, mental compatibility
                        with the second person born under certain Moon sign.
                      </li>
                      <li>
                        You can't proceed through Indian Vedic Astrology without
                        knowing your Moon Sign.
                      </li>
                      <li>
                        Indian Astrologer predicts the day to day life scenarios
                        based on the Moon Sign.
                      </li>
                      <li>
                        Indian Astrologer consider Moon sign as first house and
                        then provide the prediction based on the Gocher or
                        Transit of this planet into various houses.
                      </li>
                    </ul>
                  </h4>

                  {/* <span className="sign-value">
                          
                        </span> */}
                </div>
                <div className="sign-detail">
                  <span className="sign-label">
                    {"12 Moon Signs based on Zodiac"}:
                  </span>
                  <h4 style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Moon sign can be of 12 types as we have only 12 Rashis or
                    Zodiacs defined in Vedic Astrology. Let's understand how
                    your mind and emotions will behave if Moon is placed in
                    various listed below signs:
                    <br />
                    <br />
                    <ul>
                      <li>
                        Taurus: It is a favourite position of moon. Person will
                        be mentally stable.
                      </li>
                      <li>Gemini: Your mind will be very dual in nature.</li>
                      <li>
                        Cancer: You will be very motherly kind of figure who
                        takes care of everyone like a Mother.
                      </li>
                      <li>
                        Leo: You want to roar like a Lion. You will be born
                        leader and royal minded person.
                      </li>
                      <li>
                        Virgo: You will be very practical in your approach.
                      </li>
                      <li>
                        Libra: You will have balanced mind. However, you need to
                        balance things in order to get satisfaction.
                      </li>
                      <li>
                        Scorpio: Moon doesn't feel good in this sign. It creates
                        lots of fluctuations in human mind depending on the
                        other aspects and planetary alignment present in one's
                        horoscope.
                      </li>
                      <li>
                        Sagittarius: You will be inclined towards religion as it
                        is dharma house.
                      </li>
                      <li>
                        Capricorn: You will be very stable with your thoughts
                        and also very rigid in your approach.
                      </li>
                      <li>
                        Aquarius: You will be social, communicative and want to
                        be the part of many different societies or communities.
                      </li>
                      <li>
                        Pisces: You will be inclined towards spirituality and
                        your mind will be indulged into some different worlds..
                      </li>
                    </ul>
                  </h4>
                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Calculate Moon Sign
                  </Button>
                </div>
              </motion.div>
            )}

            {moonSignData && (
              <motion.div className="sign-section">
                <div
                  className="sign-header"
                  onClick={() => setIsMoonSignOpen(!isMoonSignOpen)}
                >
                  <h2 className="sign-title">
                    <Moon className="icon" /> {"Moon Sign"}
                  </h2>
                  {isMoonSignOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isMoonSignOpen && (
                    <motion.div className="sign-content">
                      <div className="sign-detail">
                        <span className="sign-label">{"Moon Sign"}:</span>
                        <span className="sign-value">
                          {moonSignData?.moonSignReport?.response?.moon_sign ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="sign-detail">
                        <span className="sign-label">{"Prediction"}:</span>
                        <span className="sign-value">
                          {moonSignData?.moonSignReport?.response?.prediction ||
                            "N/A"}
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

export default MoonSign;
