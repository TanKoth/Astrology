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
import { RiAlipayLine } from "react-icons/ri";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign.css";
import { getRasiSign } from "../../api/Calculator";
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

const RasiSign = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [rasiSignData, setRasiSignData] = useState(null);
  const [isLoadingRasiSign, setIsLoadingRasiSign] = useState(false);
  const [isRasiSignOpen, setIsRasiSignOpen] = useState(true);

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
          (key) => key.startsWith(`rashiData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingRasiSign(true);
    try {
      // load astrology data from local storage
      const cacheKey = `rashiData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setRasiSignData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingRasiSign(false);
        } catch (err) {
          console.error("Error parsing rasi sign data:", err);
          setIsLoadingRasiSign(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingRasiSign(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingRasiSign(false);
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
          setIsLoadingRasiSign(false);
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

        const response = await getRasiSign(userData.user._id, apiParams);
        //console.log("Fetched rasi sign data:", response);
        if (response && response.success) {
          setRasiSignData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Rashi Sign report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingRasiSign(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch rashi sign report:", err);
      toast.error("Failed to load rashi sign report. Please try again.");
      setIsLoadingRasiSign(false);
    } finally {
      setIsLoadingRasiSign(false);
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
    setIsLoadingRasiSign(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingRasiSign(false);
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

  if (isLoadingRasiSign) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading RashiSign Data........ </p>
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
              <motion.h1 className="welcome-title">{"Rashi Sign"}</motion.h1>
              {rasiSignData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingRasiSign}
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

            {!rasiSignData && !isLoadingRasiSign && (
              <motion.div className="sign-content">
                <div className="sign-detail">
                  <span className="sign-label">
                    {"Importance of Rashi Sign"}:
                  </span>
                  <h4 style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    You may have questions in your mind, like, What is my rashi?
                    Why do we calculate Rashi Sign? Rasi Calculator can give you
                    the brief idea about your rashi sign. You can easily find
                    your janma rashi through this rashi calculator. Rashi can
                    also provide you information related to your Moon sign.
                    Let’s understand the Importance of Rashi Sign:
                    <br />
                    <br />
                    <ul>
                      <li>
                        It reveals many information related to personality,
                        character, nature, behaviour, likes and dislikes and
                        your inherent attributes.
                      </li>
                      <li>
                        Rashi Sign can help you to determine your fate in order
                        to drive yourself towards the right path.
                      </li>
                      <li>
                        Rashi Sign plays pivotal role in finding your
                        compatibility with other people, especially with your
                        partner. It can be your mother, brother, friends,
                        father, lover, wives or anyone running into your life.
                      </li>
                      <li>
                        It enables you to sustain the long lasting and
                        harmonical relation with everyone.
                      </li>
                      <li>
                        It derives your life path, luck, mental compatibility
                        with the second person born under certain Moon sign.
                      </li>
                      <li>
                        You must know your rashi sign to proceed through Indian
                        Vedic Astrology. Indian Astrologers predict events or
                        day to day life scenarios based on Rashi Sign.
                      </li>
                      <li>
                        Indian Astrologers consider Rashi Sign as first house
                        and then provide the prediction based on the Gocher or
                        Transit of this planet into various houses.
                      </li>
                    </ul>
                  </h4>
                </div>
                <div className="sign-detail">
                  <span className="sign-label">
                    {"12 Rashi Signs based on Zodiac"}:
                  </span>
                  <h4 style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Rashi sign can be of 12 types as we have only 12 Rashis or
                    Zodiacs defined in Vedic Astrology. Let’s understand below
                    how your mind and emotions will behave if Moon is placed in
                    various listed signs:
                    <br />
                    <br />
                    <ul>
                      <li>
                        Aries: You may be very eccentric, impulsive, impatient
                        and active learner.
                      </li>
                      <li>
                        Taurus: Moon gets exalted in this sign. It is a
                        favourable sign of Moon. Person will be mentally stable.
                      </li>
                      <li>
                        Gemini: You will be very dual in nature through your
                        mind.
                      </li>
                      <li>
                        Cancer: You will be like a mother for all, who takes
                        care of everyone like a Mother.
                      </li>
                      <li>
                        Leo: You will carry attitude like a Lion. You are born
                        leader and royal minded person.
                      </li>
                      <li>Virgo: You are very practical in your approach.</li>
                      <li>
                        Libra: You are balanced through mind. However, you need
                        to balance things in order to get satisfaction.
                      </li>
                      <li>
                        Scorpio: It is not a favourable position of Moon. It
                        indicates lots of fluctuations in human mind depending
                        on the other aspects and planetary alignment present in
                        one's horoscope.
                      </li>
                      <li>
                        Sagittarius: You are inclined towards religion as it is
                        dharma house.
                      </li>
                      <li>
                        Capricorn: You are very stable with your thoughts and
                        also very rigid in your approach.
                      </li>
                      <li>
                        Aquarius: You are social, communicative and want to be
                        the part of many different societies or communities.
                      </li>
                      <li>
                        Pisces: You are inclined towards spirituality and your
                        mind will be indulged into some different worlds.
                      </li>
                    </ul>
                    Therefore, Rashi Sign is very important with regards to
                    every aspect of your life. If you are happy through your
                    mind, then everything out in the world makes you more happy.
                    If you are happy inside then you can spread the same
                    happiness to the world around you. So it keeps on
                    encouraging like a cycle of happiness.
                  </h4>
                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Calculate Rashi Sign
                  </Button>
                </div>
              </motion.div>
            )}

            {rasiSignData && (
              <motion.div className="sign-section">
                <div
                  className="sign-header"
                  onClick={() => setIsRasiSignOpen(!isRasiSignOpen)}
                >
                  <h2 className="sign-title">
                    <RiAlipayLine className="icon" /> {"Rashi Sign"}
                  </h2>
                  {isRasiSignOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isRasiSignOpen && (
                    <motion.div className="sign-content">
                      <div className="sign-detail">
                        <span className="sign-label">{"Rashi Sign"}:</span>
                        <span className="sign-value">
                          {rasiSignData?.rasiSignReport?.response?.ascendant ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="sign-detail">
                        <span className="sign-label">{"Prediction"}:</span>
                        <span className="sign-value">
                          {rasiSignData?.rasiSignReport?.response?.prediction ||
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

export default RasiSign;
