import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, color } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  MessageCircle,
  Crown,
  Send,
  Sparkles,
  Navigation,
  Calendar,
  MapPin,
  Clock,
  Moon,
  Sun,
  Activity,
  Printer,
  Languages,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import { userLogin } from "../../api/UserLogin";
import "./Dashboard.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { convertHtmlToAstrologyJson } from "../../utilityFunction/utilityFunction";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";

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

const formatDate = (date) => {
  if (!date) return "";
  // Fix the date formatting to show correct format
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
};

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const [insights, setInsights] = useState([]);
  const [astrologyData, setAstrologyData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [freeChatsLeft, setFreeChatsLeft] = useState(3);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [isPlanetaryOpen, setIsPlanetaryOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useTranslation();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollToChat = searchParams.get("section");

    if (scrollToChat === "chat-section") {
      const timer = setTimeout(() => {
        const chatSection = document.getElementById("chat-section");
        if (chatSection) {
          chatSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const userName = user?.name || "User";
    document.title = `${userName}-Astrology Report`;

    // Small delay to ensure title is set
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    // Only check authentication if we're actually on the dashboard route
    if (!location.pathname.includes("/dashboard")) {
      return null;
    }

    const storedUser = localStorage.getItem("user");
    if (!user && !storedUser) {
      toast.warning("No user logged in. Please log in.", {
        position: "top-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        if (window.location.pathname === "/dashboard") {
          navigate("/login", { replace: true });
        }
      }, 5000);
    } else {
      // Load astrology data from localStorage
      const storedAstrologyData = localStorage.getItem("astrologyData");
      if (storedAstrologyData) {
        try {
          const parsedData = JSON.parse(storedAstrologyData);
          setAstrologyData(parsedData);
          setIsLoadingChart(false);
        } catch (err) {
          console.log("Error parsing astrology data:", err);
          setIsLoadingChart(false);
        }
      } else {
        // If no stored data, Fetch astrology data from API
        fetchInsights();
      }
      setIsLoadingInsights(false);
    }
  }, [user, location.pathname]);

  const fetchInsights = async () => {
    try {
      if (!user || !user._id) {
        console.log("User Id not available");
        setIsLoadingChart(false);
        return;
      }
      const response = await userLogin(user._id);
      if (response && response.astrologyData) {
        const parsedData = convertHtmlToAstrologyJson(
          response.astrologyData.data
        );
        setAstrologyData(parsedData);
        localStorage.setItem("astrologyData", JSON.stringify(parsedData));
      }
      setIsLoadingChart(false);
    } catch (error) {
      console.error("Failed to load insights.");
      setIsLoadingChart(false);
    }
  };

  const chartNameMapping = {
    0: t("lagnaChart"), // Lagna Chart
    1: t("chandraChart"), // Chandra Chart
    2: t("navamsaChart"), // Navamsa Chart
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (freeChatsLeft <= 0) {
      alert("You've reached your free chat limit. Upgrade to continue.");
      return;
    }

    const newChat = { role: "user", content: newMessage };
    const updatedMessages = [...messages, newChat];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsTyping(true);

    try {
      // const recentHistory = [...updatedMessages].slice(-6); // Last 3 rounds
      // const aiResponse = await sendMessageToAI(newMessage, recentHistory);

      // setMessages([
      //   ...updatedMessages,
      //   { role: "assistant", content: aiResponse },
      // ]);
      setFreeChatsLeft((prev) => prev - 1);
    } catch (error) {
      console.error("Chat request failed.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          <div className="dashboard-container">
            <div className="welcome-section">
              <motion.h1 className="welcome-title">
                {t("welcome")} {user?.name}
              </motion.h1>
              {!astrologyData && !isLoadingChart && (
                <motion.div className="no-data-section">
                  <div className="no-data-message">
                    <Star className="icon" />
                    <h3>{t("noDataAvailable")}</h3>
                    <p>{t("completeProfile")}</p>
                    <button
                      className="generate-button"
                      onClick={() => navigate("/login")}
                    >
                      {t("completeProfileButton")}
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="action-buttons">
                <button
                  className="translate-button"
                  onClick={toggleLanguage}
                  title="Translate"
                >
                  <Languages className="icon" />
                  {language === "en"
                    ? "हिंदी"
                    : language === "hi"
                    ? "मराठी"
                    : "English"}
                </button>
                <button
                  className="print-button"
                  onClick={handlePrint}
                  title="Print Dashboard"
                >
                  <Printer className="icon" />
                  {t("print")}
                </button>
              </div>
            </div>

            {/* Birth Details Section */}
            {astrologyData && (
              <motion.div className="insights-section">
                <div
                  className="insights-header"
                  onClick={() => setIsPlanetaryOpen(!isPlanetaryOpen)}
                >
                  <h2 className="insights-title">
                    <Calendar className="icon" /> {t("birthDetails")}
                  </h2>
                  {isPlanetaryOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>

                <AnimatePresence>
                  {isPlanetaryOpen && (
                    <motion.div className="insights-content">
                      <div className="birth-details-grid">
                        <div className="birth-detail">
                          <span className="detail-label">
                            {t("dateOfBirth")}
                          </span>
                          <span className="detail-value">
                            {user?.dob
                              ? formatDate(user.dob)
                              : astrologyData.personalInfo.birthDetails[
                                  "Date Of Birth"
                                ]}
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">{t("birthTime")}</span>
                          <span className="detail-value">
                            {user?.timeOfBirth ||
                              astrologyData.personalInfo.birthDetails[
                                "Birth Time"
                              ]}
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">
                            {t("birthPlace")}
                          </span>
                          <span className="detail-value">
                            {user?.placeOfBirth ||
                              astrologyData.personalInfo.birthDetails[
                                "Birth Place"
                              ]}
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">{t("nakshatra")}</span>
                          <span className="detail-value">
                            {
                              astrologyData.personalInfo.birthDetails.Nakshtra.replace(
                                /(\D)(\d)/g,
                                "$1-$2"
                              ).split(" ")[0]
                              // .replace(/[0-9]/g, "")
                              // .replace(/[^\w\s]/g, "")
                              // .trim()
                            }
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">
                            {t("nakshatraLord")}
                          </span>
                          <span className="detail-value">
                            {
                              astrologyData.personalInfo.birthDetails[
                                "Nakshtra-Lord"
                              ]
                            }
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">{t("gana")}</span>
                          <span className="detail-value">
                            {astrologyData.personalInfo.birthDetails.Gana}
                          </span>
                        </div>
                        <div className="birth-detail">
                          <span className="detail-label">{t("yoni")}</span>
                          <span className="detail-value">
                            {astrologyData.personalInfo.birthDetails.Yoni}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Charts Section */}
            {astrologyData && (
              <motion.div className="insights-section">
                <div className="insights-header">
                  <h2 className="insights-title">
                    <Navigation className="icon" /> {t("astrologyCharts")}
                  </h2>
                </div>
                <motion.p className="welcome-subtitle">
                  {t("chartsDescription")}
                </motion.p>
                <div className="insights-content">
                  <div className="charts-grid">
                    {astrologyData.charts.slice(0, 3).map((chart, index) => (
                      <div key={index} className="chart-item">
                        <h4 className="chart-title">
                          {chartNameMapping[index] ||
                            chart.name ||
                            `Chart ${index + 1}`}
                        </h4>
                        <div className="chart-container">
                          <img
                            src={chart.url}
                            alt={chartNameMapping[index + 1] || chart.name}
                            className="chart-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="chart-placeholder"
                            style={{ display: "none" }}
                          >
                            <Star className="chart-placeholder-icon" />
                            <span>{t("chartLoading")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Planetary Positions Section */}
            {astrologyData && (
              <motion.div className="insights-section">
                <div
                  className="insights-header"
                  onClick={() => setIsChartsOpen(!isChartsOpen)}
                >
                  <h2 className="insights-title">
                    <Sun className="icon" /> {t("planetaryPositions")}
                  </h2>
                  {isChartsOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <motion.p className="welcome-subtitle">
                  {t("planetaryDescription")}
                </motion.p>

                <AnimatePresence>
                  {isChartsOpen && (
                    <motion.div className="insights-content">
                      <div className="planetary-positions">
                        {astrologyData.planetaryPositions.map(
                          (position, index) => (
                            <div key={index} className="planetary-item">
                              <div className="planet-name">
                                {position.planet === "Sun" && (
                                  <Sun className="planet-icon" />
                                )}
                                {position.planet === "Moon" && (
                                  <Moon className="planet-icon" />
                                )}
                                {position.planet !== "Sun" &&
                                  position.planet !== "Moon" && (
                                    <Star className="planet-icon" />
                                  )}
                                {position.planet}
                              </div>
                              <div className="planet-details">
                                <div className="planet-degree">
                                  {position.degreeSign}
                                </div>
                                <div className="planet-house">
                                  {t("house")} {position.house}
                                </div>
                                <div className="planet-nakshatra">
                                  {position.nakshatra}
                                </div>
                                <div
                                  className={`planet-motion ${position.motion.toLowerCase()}`}
                                >
                                  {position.motion}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Chat Section */}
            <motion.div className="chat-section" id="chat-section">
              <h2 className="chat-title">
                <MessageCircle className="icon" /> {t("chatWithAI")}
              </h2>
              <p
                className="text-sm text-gray-400 mb-2"
                style={{ color: "white" }}
              >
                Free chats left today:{" "}
                <span className="text-yellow-300 font-semibold">
                  {freeChatsLeft}
                </span>
              </p>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-4">
                    <Sparkles className="mx-auto mb-2" /> {t("askQuestion")}
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.role}`}>
                        <ReactMarkdown className="message-content prose prose-invert max-w-none text-white">
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder={t("typeQuestion")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={isLoadingChat}
                >
                  {isLoadingChat ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="icon" /> {t("send")}
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Insights Section */}
            {/* <motion.div className="insights-section">
              <div
                className="insights-header"
                onClick={() => setIsInsightsOpen(!isInsightsOpen)}
              >
                <h2 className="insights-title">
                  <Star className="icon" /> Your Astrology Insights
                </h2>
                {isInsightsOpen ? (
                  <ChevronUp className="icon" />
                ) : (
                  <ChevronDown className="icon" />
                )}
              </div>

              <AnimatePresence>
                {isInsightsOpen && (
                  <motion.div className="insights-content">
                    {isLoadingInsights ? (
                      <div className="loading">
                        Generating Insights... Please wait.
                      </div>
                    ) : (
                      insights.length > 0 && (
                        <div>
                          {insights
                            .filter(
                              (insight) =>
                                insight.category !== "Unlock More Insights 🔓"
                            )
                            .map((insight, index) => (
                              <div key={index} className="insight-item">
                                <div className="insight-label">
                                  {insight.category}
                                </div>
                                <ReactMarkdown>{insight.insight}</ReactMarkdown>
                              </div>
                            ))}
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div> */}

            {/* Locked Insights Section */}
            {/* <motion.div className="locked-insights-section">
          <h3 className="locked-title">
            <Lock className="icon" /> Unlock Deeper Insights
          </h3>
          <p className="unlock-description">
            Explore exclusive astrology insights available in the premium
            report:
          </p>

          <div className="locked-feature">
            <Lock className="icon" /> Karmic Lessons & Thought Patterns
          </div>
          <div className="locked-feature">
            <Lock className="icon" /> Remedies & Personalized Guidance
          </div>
        </motion.div>

        {/* Upgrade CTA */}
            {/* <motion.div className="upgrade-cta">
          <h3 className="upgrade-title">Unlock Your Cosmic Potential</h3>
          <p className="text-gray-300 mb-4">
            Access deeper insights, unlimited consultations, and personalized
            remedies.
          </p>
          <button
            className="upgrade-button"
            onClick={() => navigate("/subscription")}
          >
            <Crown className="icon" /> Upgrade to Premium
          </button>
        </motion.div>  */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
