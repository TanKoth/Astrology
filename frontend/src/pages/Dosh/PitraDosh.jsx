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
import { GiTripleBeak } from "react-icons/gi";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dosh.css";
import { getPitraDosh } from "../../api/Dosh";
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

const PitraDosh = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [pitraDoshData, setPitraDoshData] = useState(null);
  const [isLoadingPitraDosh, setIsLoadingPitraDosh] = useState(false);
  const [isPitraDoshOpen, setIsPitraDoshOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `PitraDosh Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) => key.startsWith(`pitraDoshData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingPitraDosh(true);
    try {
      // load astrology data from local storage
      const cacheKey = `pitraDoshData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setPitraDoshData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingPitraDosh(false);
        } catch (err) {
          console.error("Error parsing pitra dosh data:", err);
          setIsLoadingPitraDosh(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingPitraDosh(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingPitraDosh(false);
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
          setIsLoadingPitraDosh(false);
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

        const response = await getPitraDosh(userData.user._id, apiParams);
        //console.log("Fetched pitra dosh data:", response);
        if (response && response.success) {
          setPitraDoshData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Pitra Dosh report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingPitraDosh(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch pitra dosh report:", err);
      toast.error("Failed to load pitra dosh report. Please try again.");
      setIsLoadingPitraDosh(false);
    } finally {
      setIsLoadingPitraDosh(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingPitraDosh(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingPitraDosh(false);
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

  if (isLoadingPitraDosh) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Pitra Dosh Data........ </p>
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
              <motion.h1 className="welcome-title">{"Pitra Dosh"}</motion.h1>
              {pitraDoshData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingPitraDosh}
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

            {!pitraDoshData && !isLoadingPitraDosh && (
              <motion.div className="dosh-content">
                <div className="dosh-detail">
                  <span className="dosh-label">{"What is Pitra Dosh"}:</span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Pitra Dosha also known as Pitru Dosh is one of the most
                    destructive astrological doshas found in the birth chart of
                    a person. According to Hindu philosophy, it is the karmic
                    debt of the ancestors which needs to be paid by the person
                    affiliated with Pitru Dosha in his/her horoscope. It is easy
                    and simple to understand that a Pitru Dosh is formed in the
                    horoscope of a person when his/her forefathers have
                    committed any mistakes, crimes, or sins in their life
                    journey. According to Indian astrology, it is a very
                    inauspicious aspect and a Pitra Dosh is formed in the
                    horoscope of a person, only if there is a conjunction of
                    Rahu and Sun in the ninth house (also known as the house of
                    father and forefathers) in birth chart.
                  </p>
                  <span className="dosh-label">{"Types of Pitra dosha"} :</span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    According to Indian astrology, there are 14 kinds of
                    Pitra-Dosh based on positions and aspects of malefic
                    planets. Inappropriate position of the planet Rahu is
                    considered the major cause of Pitra Dosh. But, as per the
                    teachings of Hindu mythology, there are mainly 3-types of
                    Pitru Dosha:
                  </p>
                  <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    <li>
                      Due to the curse of the departed souls on their own
                      family, if the family members fail to perform the basic
                      requirement such as shraadh, pinda daan, rituals of the
                      last rite, etc. for their ancestors.
                    </li>
                    <li>
                      {" "}
                      Due to the curse of the outsiders/known or unknown living
                      being who was affected by your living/departed ancestors.
                    </li>
                    <li>
                      {" "}
                      Due to failure to look after the aged peoples (parents or
                      grandparents) and leaving them alone to fend for
                      themselves.
                    </li>
                  </ul>

                  <span className="dosh-label">
                    {"How to find Pitra dosha in Kundli (Horoscope)"} :
                  </span>

                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem " }}>
                    The Sanskrit word Pitra means father/forefather. According
                    to Hindu Vedic astrology Sun is karaka for the father. If
                    Sun is placed in the 9th house or 9th house is afflicted by
                    malefic Sun, then the birth chart of that person clearly
                    indicates Pitra Dosha. Followings are few more planetary
                    combinations that indicate the Pitra Dosha:
                  </p>
                  <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    <li>Sun with Rahu or 9th house lord with Rahu.</li>
                    <li> Sun with Saturn or 9th house lord with Saturn.</li>
                    <li> Rahu in the 9th house.</li>
                    <li>
                      The 5th house lord is either being associated with malefic
                      planets or staying in the 6th, 8th, and 12th houses.
                    </li>
                    <li>
                      The presence of debilitated planets like Mars, Saturn,
                      Rahu, or Ketu in the 5th house.
                    </li>
                  </ul>

                  <span className="dosh-label">{"Summary"} :</span>

                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Vedic astrology clearly defines that “Pitra Dosh” is not the
                    curse of the ancestors, but it is a debt formed as a result
                    of bad deeds done by the ancestors themselves or by their
                    progeny. It is the duty of the present generation to pay off
                    the debt either by bearing the punishment as per “Karmic
                    Law” or by performing some specific good Karmic deeds which
                    would help to repay the debt or reduce the degree of
                    punishment.
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    Sacred scriptures like Garud Purana, Brahma Purana and
                    others clearly describe the various reasons behind pitra
                    dosha and offers several remedies to reduce or nullify the
                    adverse effects of pitra dosha.
                  </p>

                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Check Pitra Dosh
                  </Button>
                </div>
              </motion.div>
            )}

            {pitraDoshData && (
              <motion.div className="dosh-section">
                <div
                  className="dosh-header"
                  onClick={() => setIsPitraDoshOpen(!isPitraDoshOpen)}
                >
                  <h2 className="sign-title">
                    <GiTripleBeak className="icon" /> {"Pitra Dosh"}
                  </h2>
                  {isPitraDoshOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isPitraDoshOpen && (
                    <motion.div className="dosh-content">
                      <div className="dosh-detail">
                        <span className="dosh-label">
                          {"Pitra Dosh Present"}:
                        </span>
                        <span className="dosh-value">
                          {pitraDoshData?.pitraDosh?.response
                            ?.is_dosha_present !== undefined
                            ? pitraDoshData?.pitraDosh?.response
                                ?.is_dosha_present
                              ? `Yes, ${user?.name} has Pitra Dosh`
                              : `No, ${user?.name} does not have Pitra Dosh`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="dosh-detail">
                        <span className="dosh-label">{"Response"}:</span>
                        <span className="dosh-value">
                          {pitraDoshData?.pitraDosh?.response?.bot_response ||
                            "N/A"}
                        </span>
                      </div>
                      {pitraDoshData?.pitraDosh?.response?.is_dosha_present && (
                        <>
                          <div className="dosh-detail">
                            <span className="dosh-label">{"Effects"}:</span>
                            <span className="dosh-value">
                              {pitraDoshData?.pitraDosh?.response?.effects.map(
                                (effect, index) => {
                                  return (
                                    <div key={index}>
                                      <ul
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "1.2rem",
                                        }}
                                      >
                                        <li>{effect}</li>
                                      </ul>
                                    </div>
                                  );
                                }
                              ) || "N/A"}
                            </span>
                          </div>
                          <div className="dosh-detail">
                            <span className="dosh-label">{"Remedies"}:</span>
                            <span className="dosh-value">
                              {pitraDoshData?.pitraDosh?.response?.remedies.map(
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

export default PitraDosh;
