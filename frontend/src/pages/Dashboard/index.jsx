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
import { sendMessageToAI, getChatLimit } from "../../api/ChatWithAI";
import "./Dashboard.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { convertHtmlToAstrologyJson } from "../../utilityFunction/utilityFunction";
import { useTranslation } from "../../context/TranslationContext";
import { toast, ToastContainer } from "react-toastify";
//import Header from "../../component/Header";
import D1 from "../Charts/D1";
import D9 from "../Charts/D9";
import MoonChart from "../Charts/Moon";
import SarvashtakvargaChart from "../Charts/SarvashtakvargaChart";
import LazyChartLoading from "../../utilityFunction/LazyChartLoading";

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
  const [freeChatsLeft, setFreeChatsLeft] = useState(5);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [isPlanetaryOpen, setIsPlanetaryOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useTranslation();
  // const [isNavOpen, setIsNavOpen] = useState(false);

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

  // const handleToggleNav = () => {
  //   setIsNavOpen(!isNavOpen);
  // };

  // const handleCloseNav = () => {
  //   setIsNavOpen(false);
  // };

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
      // Load user-specific astrology data from localStorage
      const currentUser = user || JSON.parse(storedUser);
      if (currentUser && currentUser._id) {
        // Try to load user-specific astrology data first
        const userSpecificData = localStorage.getItem(
          `astrologyData_${currentUser._id}`
        );
        if (userSpecificData) {
          try {
            const parsedData = JSON.parse(userSpecificData);
            setAstrologyData(parsedData);
            // Also set it in the general astrologyData key for current session
            localStorage.setItem("astrologyData", userSpecificData);
            setIsLoadingChart(false);
          } catch (err) {
            //console.log("Error parsing user-specific astrology data:", err);
            // Fallback to general astrology data
            loadGeneralAstrologyData();
          }
        } else {
          // Fallback to general astrology data or fetch from API
          loadGeneralAstrologyData();
        }
      } else {
        loadGeneralAstrologyData();
      }
    }
    setIsLoadingInsights(false);
  }, [user, location.pathname]);

  const loadGeneralAstrologyData = () => {
    const storedAstrologyData = localStorage.getItem("astrologyData");
    if (storedAstrologyData) {
      try {
        const parsedData = JSON.parse(storedAstrologyData);
        setAstrologyData(parsedData);
        setIsLoadingChart(false);
      } catch (err) {
        //console.log("Error parsing astrology data:", err);
        setIsLoadingChart(false);
      }
    } else {
      // If no stored data, Fetch astrology data from API
      fetchInsights();
    }
  };

  const fetchInsights = async () => {
    try {
      if (!user || !user._id) {
        //console.log("User Id not available");
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
        localStorage.setItem(
          `astrologyData_${user._id}`,
          JSON.stringify(parsedData)
        );
      }
      setIsLoadingChart(false);
    } catch (error) {
      console.error("Failed to load insights.");
      setIsLoadingChart(false);
    }
  };

  // const chartNameMapping = {
  //   0: t("lagnaChart"), // Lagna Chart
  //   1: t("chandraChart"), // Chandra Chart
  //   2: t("navamsaChart"), // Navamsa Chart
  //   16: t("ashtakvargaChart"), // Ashtakvarga Chart
  // };

  // Load user chat limit on component mount
  useEffect(() => {
    const loadChatLimit = async () => {
      if (user?._id) {
        try {
          const limitData = await getChatLimit(user._id);
          if (limitData.success) {
            setFreeChatsLeft(limitData.chatLimit);
          }
        } catch (error) {
          console.error("Failed to load chat limit:", error);
          // Set default limit if API fails
          //setFreeChatsLeft(5);
        }
      } else {
        // Default limit for guests
        setFreeChatsLeft(5);
      }
    };

    loadChatLimit();
  }, [user?._id]);

  const sendMessage = async () => {
    // Checking the limit of the chat with AI
    if (!newMessage.trim()) return;
    if (freeChatsLeft <= 0) {
      toast.error("You've reached your free chat limit. Upgrade to continue.", {
        position: "top-right",
      });
      return;
    }

    const newChat = { role: "user", content: String(newMessage.trim()) };
    const updatedMessages = [...messages, newChat];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsTyping(true);
    setIsLoadingChat(true);

    try {
      const recentHistory = [...updatedMessages].slice(-6); // Last 3 rounds
      const aiResponse = await sendMessageToAI(
        newMessage,
        recentHistory,
        astrologyData
      );
      //console.log("AI Response received:", aiResponse, typeof aiResponse);

      const aiMessage = {
        role: "assistant",
        content: String(aiResponse || "Sorry, I couldn't generate a response."),
      };

      //console.log("AI Message object:", aiMessage);

      setMessages([...updatedMessages, aiMessage]);
      // const newLimit = freeChatsLeft - 1;
      // setFreeChatsLeft(newLimit);
      // if (user?._id) {
      //   localStorage.setItem(`chatLimit_${user._id}`, newLimit.toString());
      // }

      setFreeChatsLeft((prev) => prev - 1);

      const chatKey = `chatHistory_${user?._id || "guest"}`;
      localStorage.setItem(
        chatKey,
        JSON.stringify([...updatedMessages, aiMessage])
      );
    } catch (error) {
      console.error("Chat request failed.", error);
      toast.error("Failed to get response from AI. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Remove the user message if AI response failed
      setMessages(updatedMessages.slice(0, -1));
    } finally {
      setIsTyping(false);
      setIsLoadingChat(false);
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    if (user?._id) {
      const chatKey = `chatHistory_${user._id}`;
      const savedMessages = localStorage.getItem(chatKey);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Ensure all loaded messages have string content
          const validMessages = parsedMessages.map((msg) => ({
            ...msg,
            content:
              typeof msg.content === "string"
                ? msg.content
                : String(msg.content || ""),
          }));
          setMessages(validMessages);
        } catch (error) {
          console.error("Failed to load chat history:", error);
        }
      }
    }
  }, [user]);

  // Add welcome message when astrology data is loaded
  useEffect(() => {
    if (astrologyData && messages.length === 0) {
      const welcomeMessage = {
        role: "assistant",
        content: `🌟 Namaste! I'm Vedic Vedang.AI, your personal astrology guide. I can see your birth chart and planetary positions. Feel free to ask me about:

        • Your personality traits based on your planets
        • Career and relationship guidance
        • Auspicious times for important decisions
        • Remedies for planetary influences
        • Spiritual insights from your Nakshatra

        What would you like to explore about your cosmic blueprint today?`,
      };
      setMessages([welcomeMessage]);
    }
  }, [astrologyData]);

  // Clear chat data when user logs out
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setFreeChatsLeft(5);
      setAstrologyData(null);
    }
  }, [user]);

  const clearChatHistory = () => {
    setMessages([]);
    if (user?._id) {
      localStorage.removeItem(`chatHistory_${user._id}`);
    }
    toast.success("Chat history cleared!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Add suggested questions
  const suggestedQuestions = [
    "What does my birth chart say about my personality?",
    "When is a good time for me to start new ventures?",
    "What remedies can help improve my life?",
    "Tell me about my Nakshatra and its significance",
    "How do current planetary transits affect me?",
  ];

  return (
    <div className="dashboard-layout">
      {/* <Header onToggleNav={handleToggleNav} isNavOpen={isNavOpen} />
      <NavigationMenu isOpen={isNavOpen} onClose={handleCloseNav} /> */}
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
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
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
                    <LazyChartLoading
                      delay={0}
                      loadingText="Loading Lagna Chart..."
                    >
                      <D1
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>
                    <LazyChartLoading
                      delay={0}
                      loadingText="Loading Moon Chart..."
                    >
                      <MoonChart
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>
                    <LazyChartLoading
                      delay={500}
                      loadingText="Loading Navamsa Chart..."
                    >
                      <D9
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                    </LazyChartLoading>
                    <LazyChartLoading
                      delay={500}
                      loadingText="Loading Sarvashtakvarga Chart..."
                    >
                      <SarvashtakvargaChart />
                    </LazyChartLoading>
                    {/* <AshtakvargaChart /> */}
                    {/* {astrologyData.charts
                      .filter(
                        (chart, index) =>
                          index < 3 || index === astrologyData.charts.length - 1
                      )
                      .map((chart, originalIndex) => {
                        // Get the actual index from the original array
                        const actualIndex =
                          originalIndex < 3
                            ? originalIndex
                            : astrologyData.charts.length - 1;

                        return (
                          <div key={actualIndex} className="chart-item">
                            <h4 className="chart-title">
                              {chartNameMapping[actualIndex] ||
                                chart.name ||
                                `Chart ${actualIndex + 1}`}
                            </h4>
                            <div className="chart-container">
                              <img
                                src={chart.url}
                                alt={
                                  chartNameMapping[actualIndex] || chart.name
                                }
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
                        );
                      })} */}
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
                    <ChevronUp className="chev-icon" />
                  ) : (
                    <ChevronDown className="chev-icon" />
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
                    {messages.map((msg, index) => {
                      // Validate message structure
                      if (!msg || typeof msg !== "object") {
                        console.warn("Invalid message at index", index, msg);
                        return null;
                      }

                      const content =
                        typeof msg.content === "string"
                          ? msg.content
                          : String(msg.content || "Invalid message content");

                      return (
                        <div
                          key={index}
                          className={`message ${msg.role || "user"}`}
                        >
                          <div className="message-content">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
                {messages.length === 0 && (
                  <div className="suggested-questions">
                    <p className="suggested-title">Suggested questions:</p>
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="suggested-question"
                        onClick={() => setNewMessage(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="chat-input">
                <textarea
                  placeholder={t("typeQuestion")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="2"
                  disabled={isLoadingChat}
                />
                <div className="chat-buttons">
                  <button
                    className="clear-button"
                    onClick={clearChatHistory}
                    title="Clear chat history"
                  >
                    Clear
                  </button>
                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={isLoadingChat || !newMessage.trim()}
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
