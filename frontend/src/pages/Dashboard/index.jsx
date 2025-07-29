"use frontend";

import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  MessageCircle,
  Crown,
  Send,
  Sparkles,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import { getUserInsights } from "../../api/user";
//import { sendMessageToAI } from "../../api/chatApi";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const TypingIndicator = () => (
  <div className="message ai">
    <div className="typing-indicator">
      <Sparkles className="crystal-ball" />
      <span className="typing-indicator-text">
        Vedic Vedang AI is consulting the stars
      </span>
      <div className="typing-indicator-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const [insights, setInsights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [freeChatsLeft, setFreeChatsLeft] = useState(3);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const locationData = JSON.parse(localStorage.getItem("locationData"));
      const data = await getUserInsights(user._id, locationData);
      console.log("Fetched insights:", data);
      setInsights(data);
      setIsLoadingInsights(false);
    } catch (error) {
      console.error("Failed to load insights.");
      setIsLoadingInsights(false);
    }
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

    // try {
    //   const recentHistory = [...updatedMessages].slice(-6); // Last 3 rounds
    //   //const aiResponse = await sendMessageToAI(newMessage, recentHistory);

    //   setMessages([
    //     ...updatedMessages,
    //     { role: "assistant", content: aiResponse },
    //   ]);
    //   setFreeChatsLeft((prev) => prev - 1);
    // } catch (error) {
    //   console.error("Chat request failed.");
    // } finally {
    //   setIsTyping(false);
    // }
  };

  return (
    <div className="dashboard-page">
      <div className="stars" />
      <div className="dashboard-container">
        <div className="welcome-section">
          <motion.h1 className="welcome-title">
            Welcome, {user?.name} ⭐
          </motion.h1>
          <motion.p className="welcome-subtitle">
            Your cosmic journey continues...
          </motion.p>
        </div>

        {/* Insights Section */}
        <motion.div className="insights-section">
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
        </motion.div>

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
        </motion.div> */}

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
        </motion.div> */}

        {/* Chat Section */}
        <motion.div className="chat-section">
          <h2 className="chat-title">
            <MessageCircle className="icon" /> Chat with AI Astrologer
          </h2>
          <p
            className="text-sm text-gray-400 mb-2"
            style={{ color: "#e2e8f0" }}
          >
            Free chats left today:{" "}
            <span className="text-yellow-300 font-semibold">
              {freeChatsLeft}
            </span>
          </p>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-4">
                <Sparkles className="mx-auto mb-2" /> Ask me anything about your
                cosmic journey!
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
              placeholder="Type your question..."
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
                  <Send className="icon" /> Send
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
