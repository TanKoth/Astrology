import { useState, useEffect, useContext, lazy, Suspense } from "react";
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

// Lazy load all table and chart components
const SunTable = lazy(() => import("./SunTable"));
const MoonTable = lazy(() => import("./MoonTable"));
const MarsTable = lazy(() => import("./MarsTable"));
const MercuryTable = lazy(() => import("./MercuryTable"));
const VenusTable = lazy(() => import("./VenusTable"));
const JupiterTable = lazy(() => import("./JupiterTable"));
const SaturnTable = lazy(() => import("./SaturnTable"));
const MoonChart = lazy(() => import("../BhinnashtakavargaCharts/MoonChart"));
const SunChart = lazy(() => import("../BhinnashtakavargaCharts/SunChart"));
const MarsChart = lazy(() => import("../BhinnashtakavargaCharts/MarsChart"));
const MercuryChart = lazy(() =>
  import("../BhinnashtakavargaCharts/MercuryChart")
);
const VenusChart = lazy(() => import("../BhinnashtakavargaCharts/VenusChart"));
const JupiterChart = lazy(() =>
  import("../BhinnashtakavargaCharts/JupiterChart")
);
const SaturnChart = lazy(() =>
  import("../BhinnashtakavargaCharts/SaturnChart")
);

// Loading component for charts and tables
const ComponentLoader = ({ type = "chart" }) => (
  <div className="component-loading">
    <div className="loading-spinner"></div>
    <p>Loading {type}...</p>
  </div>
);

const Bhinnashtakavarga = () => {
  const { user } = useContext(AppContext);
  const { t, toggleLanguage, language } = useTranslation();
  const [bhinnashtakavargaData, setBhinnashtakavargaData] = useState(null);
  const [isLoadingBhinnashtakavarga, setIsLoadingBhinnashtakavarga] =
    useState(true);
  const [isSunTableOpen, setIsSunTableOpen] = useState(true);
  const [isMoonTableOpen, setIsMoonTableOpen] = useState(true);
  const [isMarsTableOpen, setIsMarsTableOpen] = useState(false);
  const [isMercuryTableOpen, setIsMercuryTableOpen] = useState(false);
  const [isVenusTableOpen, setIsVenusTableOpen] = useState(false);
  const [isJupiterTableOpen, setIsJupiterTableOpen] = useState(false);
  const [isSaturnTableOpen, setIsSaturnTableOpen] = useState(false);

  // Track which components have been loaded
  const [loadedComponents, setLoadedComponents] = useState(new Set());

  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState(language || "en");

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingBhinnashtakavarga(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Mark component as loaded when section is opened
  const markComponentLoaded = (component) => {
    setLoadedComponents((prev) => new Set(prev).add(component));
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setCurrentLanguage(newLanguage);

    try {
      toggleLanguage();
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

  useEffect(() => {
    setCurrentLanguage(language || "en");
  }, [language]);

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Charts Report-${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSectionToggle = (section, isOpen, setOpen) => {
    setOpen(!isOpen);
    if (!isOpen) {
      markComponentLoaded(section);
    }
  };

  if (isLoadingBhinnashtakavarga) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <div className="main-loading-spinner">
                <Star className="loading-icon rotating" />
              </div>
              <h2>Loading Bhinnashtakavarga</h2>
              <p>Preparing your astrological charts and tables...</p>
              <div className="loading-progress">
                <div className="progress-bar"></div>
              </div>
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
              <motion.h1
                className="welcome-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
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
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle("sun", isSunTableOpen, setIsSunTableOpen)
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <SunTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <SunChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Moon Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "moon",
                    isMoonTableOpen,
                    setIsMoonTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <MoonTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <MoonChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mars Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "mars",
                    isMarsTableOpen,
                    setIsMarsTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <MarsTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <MarsChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mercury Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "mercury",
                    isMercuryTableOpen,
                    setIsMercuryTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <MercuryTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <MercuryChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Jupiter Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "jupiter",
                    isJupiterTableOpen,
                    setIsJupiterTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <JupiterTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <JupiterChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Venus Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "venus",
                    isVenusTableOpen,
                    setIsVenusTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <VenusTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <VenusChart />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Saturn Table */}
            <motion.div
              className="bhinnashtakavarga-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div
                className="bhinnashtakavarga-header"
                onClick={() =>
                  handleSectionToggle(
                    "saturn",
                    isSaturnTableOpen,
                    setIsSaturnTableOpen
                  )
                }
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
                  <motion.div
                    className="bhinnashtakavarga-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bhinnashtakavarga-detail">
                      <Suspense fallback={<ComponentLoader type="table" />}>
                        <SaturnTable
                          currentLanguage={currentLanguage}
                          onLanguageChange={handleLanguageChange}
                        />
                      </Suspense>
                      <div className="chart">
                        <div className="bhinnashtakavarga-chart-container">
                          <Suspense fallback={<ComponentLoader type="chart" />}>
                            <SaturnChart />
                          </Suspense>
                        </div>
                      </div>
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
