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
} from "lucide-react";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign.css";
import { getSunSign } from "../../api/Calculator";
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

const SunSign = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [sunSignData, setSunSignData] = useState(null);
  const [isLoadingSunSign, setIsLoadingSunSign] = useState(false);
  const [isSunSignOpen, setIsSunSignOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `SunSign Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) => key.startsWith(`sunSignData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingSunSign(true);
    try {
      // load astrology data from local storage
      const cacheKey = `sunSignData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setSunSignData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingSunSign(false);
        } catch (err) {
          console.error("Error parsing sun sign data:", err);
          setIsLoadingSunSign(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingSunSign(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingSunSign(false);
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
          setIsLoadingSunSign(false);
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

        const response = await getSunSign(userData.user._id, apiParams);
        //console.log("Fetched sun sign data:", response);
        if (response && response.success) {
          setSunSignData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Sun Sign report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingSunSign(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch sun sign report:", err);
      toast.error("Failed to load sun sign report. Please try again.");
      setIsLoadingSunSign(false);
    } finally {
      setIsLoadingSunSign(false);
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
    setIsLoadingSunSign(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingSunSign(false);
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

  if (isLoadingSunSign) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading SunSign Data........ </p>
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
              <motion.h1 className="welcome-title">{"Sun Sign"}</motion.h1>
              {sunSignData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingSunSign}
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

            {!sunSignData && !isLoadingSunSign && (
              <motion.div className="sign-content">
                <div className="sign-detail">
                  <span className="sign-label">
                    {"Sun Signs in Vedic Astrology"}:
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Vedic or Hindu Astrology, also called as Jyotish, is one of
                    the six auxiliary limbs in Vedic culture used to evaluate
                    and prepare a calendar or panchang and highlight auspicious
                    and inauspicious occasions. Sun, one of the navagrahas in
                    the universe, holds of a great significance and represents
                    life and soul. The movement of Sun apparently creates 12
                    zodiac signs with Aditya (sons of Mother Aditi and Sage
                    Kashyap) governing each one of them. Sun present in zodiac
                    signs highlights inner characteristics influenced by Aditya
                    governing the house and showcases to the outer world.
                  </p>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Aries"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Apr 14th - May 14th</li>
                      <li>Vedic Name: Mesha</li>
                      <li>Symbol: Ram</li>
                      <li>Ruling Energy: Dhatr Aditya</li>
                      <li>
                        Characteristics: Creative, idealistic in nature,
                        headstrong, good leader, compassionate, knowledgeable,
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Taurus"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: May 15th - June 14th</li>
                      <li>Vedic Name: Vrishabha</li>
                      <li>Symbol: Bull</li>
                      <li>Ruling Energy: Aryaman Aditya</li>
                      <li>
                        Characteristics: Value family, traditions, distinguished
                        in nature
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Gemini"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: June 15th - July 17th</li>
                      <li>Vedic Name: Mithuna</li>
                      <li>Symbol: Twins</li>
                      <li>Ruling Energy: Mitra Aditya</li>
                      <li>
                        Characteristics: Compassionate, value friendship and
                        agreements, inclined towards working in groups, liberal,
                        possess an inclusive view of world, intelligent
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Cancer"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: July 18th - Aug 15th</li>
                      <li>Vedic Name: Karka</li>
                      <li>Symbol: Crab</li>
                      <li>Ruling Energy: Varuna Aditya</li>
                      <li>
                        Characteristics: Work ethic, goal oriented,
                        authoritative, can fight to uphold their values
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Leo"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Aug 17th - Sep 16th</li>
                      <li>Vedic Name: Simha</li>
                      <li>Symbol: Lion</li>
                      <li>Ruling Energy: Aditya Indra</li>
                      <li>
                        Characteristics: Intellectual, able to show restraint,
                        comfortable with power, indulge in political games,
                        manipulative
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Virgo"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Sept 17th - Oct 17th</li>
                      <li>Vedic Name: Kanya</li>
                      <li>Symbol: Virgin</li>
                      <li>Ruling Energy: Aditya Vivaswan</li>
                      <li>
                        Characteristics: Look for perfection, devoted towards
                        work and service, sometimes controlling, interested in
                        spiritual upliftment
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Libra"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Oct 18th - Nov 16th</li>
                      <li>Vedic Name: Tula</li>
                      <li>Symbol: Balance</li>
                      <li>Ruling Energy: Pusan Aditya</li>
                      <li>
                        Characteristics: Successful in business, seekers of
                        wealth, materialistic, good sense of direction,
                        traveling soul, challenging
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Scorpio"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Nov 17th - Dec 15th</li>
                      <li>Vedic Name: Vrishchika</li>
                      <li>Symbol: Scorpion</li>
                      <li>Ruling Energy: Parjanya Aditya</li>
                      <li>
                        Characteristics: Knowledgeable, skilled, able to take
                        huge challenges, good at research work, healers, love to
                        help others.
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Sagittarius"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Dec 16th - Jan 15th</li>
                      <li>Vedic Name: Dhanu</li>
                      <li>Symbol: Bow & Arrow</li>
                      <li>Ruling Energy: Anshuman Aditya</li>
                      <li>
                        Characteristics: Respectful towards religion and
                        spiritual matters, intelligent, excel in chosen subject,
                        liberal attitude, fair.
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Capricorn"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Jan 16th - Feb 12th</li>
                      <li>Vedic Name: Makara</li>
                      <li>Symbol: Sea Monster</li>
                      <li>Ruling Energy: Bhaga Aditya</li>
                      <li>
                        Characteristics: Industrious in their goals, love to
                        live good and comfortable life, perfect karma yogis,
                        sometimes overly concerned about inheritance.
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Aquarius"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Feb 13th - Mar 14th</li>
                      <li>Vedic Name: Kumbha</li>
                      <li>Symbol: Water Carrier</li>
                      <li>Ruling Energy: Tvashtra Aditya</li>
                      <li>
                        Characteristics: Creatively intelligent, skillful,
                        perfect with their karma, diplomatic, engaging, good
                        with hands and tools.
                      </li>
                    </ul>
                  </h4>

                  <h4 style={{ color: "gold", fontSize: "1.2rem" }}>
                    {"Sun in Pisces"}
                    <br />
                    <br />
                    <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                      <li>Date of Birth: Mar 15th - April 13th</li>
                      <li>Vedic Name: Meen</li>
                      <li>Symbol: Fish</li>
                      <li>Ruling Energy: Vishnu Aditya</li>
                      <li>
                        Characteristics: Calm, intelligent, creative, dreamer,
                        risk taker, deceptive.
                      </li>
                    </ul>
                  </h4>
                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Calculate Sun Sign
                  </Button>
                </div>
              </motion.div>
            )}

            {sunSignData && (
              <motion.div className="sign-section">
                <div
                  className="sign-header"
                  onClick={() => setIsSunSignOpen(!isSunSignOpen)}
                >
                  <h2 className="sign-title">
                    <Sun className="icon" /> {"Sun Sign"}
                  </h2>
                  {isSunSignOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isSunSignOpen && (
                    <motion.div className="sign-content">
                      <div className="sign-detail">
                        <span className="sign-label">{"Sun Sign"}:</span>
                        <span className="sign-value">
                          {sunSignData?.sunSignReport?.response?.sun_sign ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="sign-detail">
                        <span className="sign-label">{"Prediction"}:</span>
                        <span className="sign-value">
                          {sunSignData?.sunSignReport?.response?.prediction ||
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

export default SunSign;
