import React from "react";
import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  Calendar,
  ArrowLeft,
  Star,
  Printer,
  ChevronUp,
  ChevronDown,
  Languages,
} from "lucide-react";
import { Form, Button, Select } from "antd";

import "./Horoscope.css";
import AppContext from "../../context/AppContext";
import { monthlyHoroscope } from "../../api/UserHoroscope";
import { toast, ToastContainer } from "react-toastify";
import NavigationMenu from "../NavigationMenu/NavigationMenu";

const MonthlyHoroscope = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedZodiacSign, setSelectedZodiacSign] = useState(null);
  //const [selectedDay, setSelectedDay] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [isHoroscopeOpen, setIsHoroscopeOpen] = useState(true);
  const [showForm, setShowForm] = useState(true);
  //const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [lastFormValues, setLastFormValues] = useState(null);

  useEffect(() => {
    if (user) {
      ["en", "hi", "mr"].forEach((lang) => {
        const keys = Object.keys(localStorage).filter(
          (key) =>
            key.startsWith(`monthlyHoroscope_`) && key.endsWith(`_${lang}`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
      });
    }
  }, [user]);

  const handleZodiacChange = (value) => {
    console.log("Selected Zodiac Sign:", value);
    setSelectedZodiacSign(value);
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setHoroscope(null);
    form.resetFields();
    setLastFormValues(null);
    // Clear all language-specific cache
    ["en", "hi", "mr"].forEach((lang) => {
      const keys = Object.keys(localStorage).filter(
        (key) => key.startsWith(`monthlyHoroscope_`) && key.endsWith(`_${lang}`)
      );
      keys.forEach((key) => localStorage.removeItem(key));
    });
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Monthly Horoscope Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onFinish = async (values, lang = "en", forceRefresh = false) => {
    setLoading(true);
    try {
      const formValues = values || lastFormValues;

      if (!formValues) {
        toast.error("Please fill the form first");
        setLoading(false);
        return;
      }

      const { zodiacSign } = formValues;
      setLastFormValues(formValues);
      const cacheKey = `monthlyHoroscope_${zodiacSign}_${lang}`;
      const storedDay = localStorage.getItem(cacheKey);
      if (
        storedDay &&
        storedDay !== "undefined" &&
        storedDay !== "null" &&
        !forceRefresh
      ) {
        const parsedDay = JSON.parse(storedDay);

        setCurrentLanguage(lang);
        setHoroscope(parsedDay);

        console.log("Stored monthly Horoscope Data:", parsedDay);

        setShowForm(false);
        setLoading(false);
      } else {
        const horoscopeData = await monthlyHoroscope(zodiacSign, lang);
        console.log("Horoscope Data:", horoscopeData);
        if (horoscopeData && typeof horoscopeData === "object") {
          localStorage.setItem(cacheKey, JSON.stringify(horoscopeData));
        }
        setCurrentLanguage(lang);
        setHoroscope(horoscopeData);
        if (values) {
          // Only reset form if this is initial submission
          form.resetFields();
        }
        setShowForm(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      toast.error("Error fetching monthly Horoscope Data", {
        position: "top-right",
      });
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async () => {
    if (!lastFormValues) {
      toast.error("Please submit the form first before changing language");
      return;
    }

    const languageMap = {
      en: "hi",
      hi: "mr",
      mr: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";

    // Show loading state
    setLoading(true);

    try {
      await onFinish(lastFormValues, newLanguage, true); // Force refresh for new language
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setLoading(false);
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

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          {/* monthly horoscope form */}

          <div className="dashboard-container">
            {!showForm && (
              <div className="welcome-section">
                <motion.h1 className="welcome-title">
                  {"Monthly Horoscope"}
                </motion.h1>
                <div className="action-buttons">
                  <button
                    className="translate-button"
                    onClick={handleLanguageChange}
                    title="Translate"
                    disabled={loading}
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
            )}

            {!horoscope && !loading && (
              <motion.div
                className="horoscope-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="horoscope-title"
                >
                  Monthly Horoscope
                </motion.h1>

                {showForm ? (
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    className="login-form"
                    form={form}
                  >
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Atom className="form-icon" /> Zodiac Sign
                        </span>
                      }
                      name="zodiacSign"
                      rules={[
                        {
                          required: true,
                          message: "Please select your zodiac sign!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Your Zodiac Sign"
                        className="cosmic-input"
                        onChange={handleZodiacChange}
                      >
                        <Select.Option value="1">Aries - (1)</Select.Option>
                        <Select.Option value="2">Taurus - (2)</Select.Option>
                        <Select.Option value="3">Gemini - (3)</Select.Option>
                        <Select.Option value="4">Cancer - (4)</Select.Option>
                        <Select.Option value="5">Leo - (5)</Select.Option>
                        <Select.Option value="6">Virgo - (6)</Select.Option>
                        <Select.Option value="7">Libra - (7)</Select.Option>
                        <Select.Option value="8">Scorpio - (8)</Select.Option>
                        <Select.Option value="9">
                          Sagittarius - (9)
                        </Select.Option>
                        <Select.Option value="10">
                          Capricorn - (10)
                        </Select.Option>
                        <Select.Option value="11">
                          Aquarius - (11)
                        </Select.Option>
                        <Select.Option value="12">Pisces - (12)</Select.Option>
                      </Select>
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      className="horoscope-submit-button"
                      loading={loading}
                    >
                      Get Monthly Horoscope
                    </Button>
                  </Form>
                ) : (
                  <div className="loading-container">
                    <Star className="loading-icon" />
                    <p>Loading Monthly Horoscope........ </p>
                  </div>
                )}
              </motion.div>
            )}

            {horoscope && (
              <motion.div className="horoscope-section">
                <div
                  className="horoscope-header"
                  onClick={() => setIsHoroscopeOpen(!isHoroscopeOpen)}
                >
                  <h2 className="horoscope-title">
                    <Star className="icon" /> {"Horoscope Insights"}
                  </h2>
                  {isHoroscopeOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <Button
                  htmlType="submit"
                  className="back-button"
                  onClick={handleBackToForm}
                >
                  <ArrowLeft className="icon" /> Back to Monthly Horoscope
                </Button>

                <AnimatePresence>
                  {isHoroscopeOpen && (
                    <motion.div className="horoscope-content">
                      <div className="horoscope-detail">
                        <span className="horoscope-label">{"Month"}:</span>
                        <span className="horoscope-value">
                          {horoscope?.data?.response?.month || "N/A"}
                        </span>
                      </div>
                      <div className="horoscope-detail">
                        <span className="horoscope-label">{"Overall %"}:</span>
                        <div className="horoscope-details-grid">
                          <div className="horoscope-detail">
                            <span className="horoscope-label">{"Career"}:</span>
                            <span className="horoscope-value">
                              {horoscope?.data?.response?.career || "N/A"} {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Family"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.family || "N/A"} {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Finances"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.finances || "N/A"}{" "}
                              {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Friends"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.friends || "N/A"}{" "}
                              {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Health"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.health || "N/A"} {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">{"Love"}:</span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.love || "N/A"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Standout Days"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.standout_days ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Challenging Days"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.challenging_days ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Status"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.status || "N/A"} {"%"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="horoscope-detail">
                        <span className="horoscope-label">
                          {"Horoscope Data"}:
                        </span>
                        <span className="horoscope-value">
                          {horoscope?.data?.response?.horoscope_data || "N/A"}
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

export default MonthlyHoroscope;
