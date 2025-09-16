import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Printer,
  Languages,
  Sun,
  Moon,
} from "lucide-react";
import { FaMars, FaMercury, FaVenus } from "react-icons/fa";
import { RiPlanetFill } from "react-icons/ri";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import "./Bhinnashtakavarga.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SunTable from "./SunTable";
import MoonTable from "./MoonTable";
import MarsTable from "./MarsTable";
import MercuryTable from "./MercuryTable";
import VenusTable from "./VenusTable";
import JupiterTable from "./JupiterTable";
import SaturnTable from "./SaturnTable";

//import LazyChartLoading from "../../utilityFunction/LazyChartLoading";

const Bhinnashtakavarga = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [bhinnashtakavargaData, setBhinnashtakavargaData] = useState(null);
  const [isLoadingBhinnashtakavarga, setIsLoadingBhinnashtakavarga] =
    useState(false);
  const [isSunTableOpen, setIsSunTableOpen] = useState(true);
  const [isMoonTableOpen, setIsMoonTableOpen] = useState(true);
  const [isMarsTableOpen, setIsMarsTableOpen] = useState(true);
  const [isMercuryTableOpen, setIsMercuryTableOpen] = useState(true);
  const [isVenusTableOpen, setIsVenusTableOpen] = useState(true);
  const [isJupiterTableOpen, setIsJupiterTableOpen] = useState(true);
  const [isSaturnTableOpen, setIsSaturnTableOpen] = useState(true);
  //
  const navigate = useNavigate(); // Initialize navigation
  const [currentLanguage, setCurrentLanguage] = useState(language || "en");

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setCurrentLanguage(newLanguage);

    try {
      // Call the global language toggle function
      toggleLanguage();

      // Show success message
      toast.success(
        `Language changed to ${newLanguage === "hi" ? "Hindi" : "English"}`,
        {
          position: "top-right",
        }
      );
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
    }
  };

  const getLanguageDisplayName = () => {
    const languageNames = {
      en: "हिंदी",
      hi: "English",
    };
    return languageNames[currentLanguage] || "हिंदी";
  };

  // Update currentLanguage when language context changes
  useEffect(() => {
    setCurrentLanguage(language || "en");
  }, [language]);

  const handlePrint = () => {
    //const originalTitle = document.title;
    const userName = user?.name || "User";
    document.title = `Charts Report-${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (isLoadingBhinnashtakavarga) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Bhinnashtakavarga data...</p>
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
                {t("Bhinnashtakavarga") || "Bhinnashtakavarga"}
              </motion.h1>
              <div className="action-buttons">
                <button
                  className="translate-button"
                  onClick={handleLanguageChange}
                  title="Translate"
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
            </div>

            {/* Sun Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsSunTableOpen(!isSunTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <Sun className="icon" /> {"Sun"}
                </h2>
                {isSunTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isSunTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <SunTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Moon Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsMoonTableOpen(!isMoonTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <Moon className="icon" /> {"Moon"}
                </h2>
                {isMoonTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isMoonTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <MoonTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Mars Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsMarsTableOpen(!isMarsTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <FaMars className="icon" /> {"Mars"}
                </h2>
                {isMarsTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isMarsTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <MarsTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Mercury Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsMercuryTableOpen(!isMercuryTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <FaMercury className="icon" /> {"Mercury"}
                </h2>
                {isMercuryTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isMercuryTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <MercuryTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Jupiter Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsJupiterTableOpen(!isJupiterTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <RiPlanetFill className="icon" /> {"Jupiter"}
                </h2>
                {isJupiterTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isJupiterTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <JupiterTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Venus Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsVenusTableOpen(!isVenusTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <FaVenus className="icon" /> {"Venus"}
                </h2>
                {isVenusTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isVenusTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <VenusTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Saturn Table */}
            <motion.div className="bhinnashtakavarga-section">
              <div
                className="bhinnashtakavarga-header"
                onClick={() => setIsSaturnTableOpen(!isSaturnTableOpen)}
              >
                <h2 className="bhinnashtakavarga-title">
                  <RiPlanetFill
                    className="icon"
                    style={{ transform: "rotate(90deg)" }}
                  />{" "}
                  {"Saturn"}
                </h2>
                {isSaturnTableOpen ? (
                  <ChevronUp className="chev-icon" />
                ) : (
                  <ChevronDown className="chev-icon" />
                )}
              </div>
              <AnimatePresence>
                {isSaturnTableOpen && (
                  <motion.div className="bhinnashtakavarga-content">
                    <div className="bhinnashtakavarga-detail">
                      <SaturnTable
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Bhinnashtakavarga;
