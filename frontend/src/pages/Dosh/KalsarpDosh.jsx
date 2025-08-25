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
import { GiSnake } from "react-icons/gi";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dosh.css";
import { getKaalsarpDosh } from "../../api/Dosh";
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

const KalsarpDosh = () => {
  const { user } = useContext(AppContext);
  // const { t, toggleLanguage, language } = useTranslation();
  const [kalsarpDoshData, setKalsarpDoshData] = useState(null);
  const [isLoadingKalsarpDosh, setIsLoadingKalsarpDosh] = useState(false);
  const [isKalsarpDoshOpen, setIsKalsarpDoshOpen] = useState(true);

  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Kalsarp Dosh Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) =>
            key.startsWith(`kalsarpDoshData_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleCalculate = () => {
    fetchInsights(currentLanguage);
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingKalsarpDosh(true);
    try {
      // load astrology data from local storage
      const cacheKey = `kalsarpDoshData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);
      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setKalsarpDoshData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingKalsarpDosh(false);
        } catch (err) {
          console.error("Error parsing kalsarp dosh data:", err);
          setIsLoadingKalsarpDosh(false);
        }
      } else {
        const userData = await getUserDetails(user._id);
        //console.log("Fetched user data:", userData);

        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingKalsarpDosh(false);
          return;
        }

        //Check if birth place exists
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingKalsarpDosh(false);
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
          setIsLoadingKalsarpDosh(false);
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

        const response = await getKaalsarpDosh(userData.user._id, apiParams);
        //console.log("Fetched kalsarp dosh data:", response);
        if (response && response.success) {
          setKalsarpDoshData(response);
          localStorage.setItem(cacheKey, JSON.stringify(response));
          toast.success("Kalsarp Dosh report fetched successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setCurrentLanguage(lang);
          setIsLoadingKalsarpDosh(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch kalsarp dosh report:", err);
      toast.error("Failed to load kalsarp dosh report. Please try again.");
      setIsLoadingKalsarpDosh(false);
    } finally {
      setIsLoadingKalsarpDosh(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setIsLoadingKalsarpDosh(true);

    try {
      await fetchInsights(newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingKalsarpDosh(false);
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

  if (isLoadingKalsarpDosh) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Kalsarp Dosh Data........ </p>
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
              <motion.h1 className="welcome-title">{"Kalsarp Dosh"}</motion.h1>
              {kalsarpDoshData && (
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={isLoadingKalsarpDosh}
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

            {!kalsarpDoshData && !isLoadingKalsarpDosh && (
              <motion.div className="dosh-content">
                <div className="dosh-detail">
                  <span className="dosh-label">
                    {"What is Kaal Sarp Yog?"}:
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    This Yoga is formed when all the seven major planets Sun,
                    Moon, Mercury, Venus, Mars, Jupiter, and Saturn are hemmed
                    between the shadow planets-Rahu and Ketu. As we know that
                    Rahu and Ketu are 180 degree apart from each other, hence
                    there is a possibility that all the other seven planets can
                    occupy the place in between these two. This positioning of
                    planets in a horoscope is known as Kaal Sarp Yog.
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    It is also necessary to check the degrees of the planets
                    while analysing the chart for Kaal Sarp Dosh. Let's suppose
                    if Mars and Rahu are in the same sign and Mars has 10
                    degrees while Rahu has 10.5 degrees, it will be considered
                    the Kala Sarpa Dosha. Whereas if Mars has 10.5 degree and
                    Rahu has 10 Degree, it will not be a Kaal Sarp Yog as Mars
                    is not lying within Rahu and Ketu axis. The degree of Rahu
                    and Ketu must be more than the other seven planets in the
                    same sign for its formation.
                  </p>
                  <span className="dosh-label">
                    {"Different types of Kaal Sarp Yog"} :
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    We have already discussed about the formation of this Yog.
                    It can be formed in various ways. There are 12 houses
                    defined in Vedic Astrology. Hence, it can be formed in 12
                    ways in one's natal chart. Let's find the names below of
                    different Kaal Sarp Yog formations:
                  </p>
                  <ul style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    <li>Anant.</li>
                    <li>Kulik.</li>
                    <li>Vasuki.</li>
                    <li>Shankhpal.</li>
                    <li>Padam</li>
                    <li>Maha Padam</li>
                    <li>Takshak</li>
                    <li>Karkotak</li>
                    <li>Shankhnaad</li>
                    <li>Ghatak</li>
                    <li>Vishdhar</li>
                    <li>Sheshnaag</li>
                  </ul>

                  <span className="dosh-label">
                    {"Effects of Kaal Sarp Dosh"} :
                  </span>

                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem " }}>
                    Generally, it is considered that this yog creates misfortune
                    in every aspect of life. However, it is not always true.
                    Although it may create hurdles in all matters of life like
                    health, wealth, career, profession, love, marriage, children
                    and many more events related to you, but ultimately you will
                    rise through adversity in your life. It is also very
                    important to know the exact effect of Kala Sarpa Dosha for
                    an individual. For that, the exact positioning of shadow
                    planets Rahu and Ketu are observed in any horoscope.
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    For example, if Rahu sits in first house and Ketu in seventh
                    house, it may create hurdles for self and also to accumulate
                    you wealth. If the same alignment falls in the second house
                    and eighth house respectively, then native may suffer from
                    family relations, wealth and other things related to second
                    house. Hence this Yoga can be judged through the 12 houses
                    in the horoscope by the placement of shadow planets.
                  </p>

                  <span className="dosh-label">
                    {"Myths about Kaal Sarp Yog"} :
                  </span>

                  <p style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>
                    People often think about it as a bad combination or
                    alignment of planets in their birth charts. However, there
                    is nothing mentioned about this Yog in any of the ancient
                    astrological texts. Nevertheless, this yog is none other
                    than the creation of the modern astrologers. As the passage
                    of time, astrologers found some planetary alignments
                    influencing the events of life either adversely or
                    favourably. Therefore, it can be auspicious and inauspicious
                    both, depending on the other positions of the planets in
                    Natal Chart. Let's understand how it can be inauspicious for
                    a person:
                  </p>

                  <Button
                    type="primary"
                    className="calculate-button"
                    onClick={handleCalculate}
                  >
                    Check Kalsarp Dosh
                  </Button>
                </div>
              </motion.div>
            )}

            {kalsarpDoshData && (
              <motion.div className="dosh-section">
                <div
                  className="dosh-header"
                  onClick={() => setIsKalsarpDoshOpen(!isKalsarpDoshOpen)}
                >
                  <h2 className="sign-title">
                    <GiSnake className="icon" /> {"Kalsarp Dosh"}
                  </h2>
                  {isKalsarpDoshOpen ? (
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {isKalsarpDoshOpen && (
                    <motion.div className="dosh-content">
                      <div className="dosh-detail">
                        <span className="dosh-label">
                          {"Kalsarp Dosh Present"}:
                        </span>
                        <span className="dosh-value">
                          {kalsarpDoshData?.kaalsarpDosh?.response
                            ?.is_dosha_present !== undefined
                            ? kalsarpDoshData?.kaalsarpDosh?.response
                                ?.is_dosha_present
                              ? `Yes, ${user?.name} has Kalsarp Dosh`
                              : `No, ${user?.name} does not have Kalsarp Dosh`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="dosh-detail">
                        <span className="dosh-label">{"Response"}:</span>
                        <span className="dosh-value">
                          {kalsarpDoshData?.kaalsarpDosh?.response
                            ?.bot_response || "N/A"}
                        </span>
                      </div>
                      {kalsarpDoshData?.kaalsarpDosh?.response
                        ?.is_dosha_present && (
                        <>
                          <div className="dosh-detail">
                            <span className="dosh-label">{"Remedies"}:</span>
                            <span className="dosh-value">
                              {kalsarpDoshData?.kaalsarpDosh?.response?.remedies.map(
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

export default KalsarpDosh;
