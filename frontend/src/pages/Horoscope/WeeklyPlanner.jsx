import React, { use } from "react";
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
} from "lucide-react";
import { Form, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import "./Horoscope.css";
import AppContext from "../../context/AppContext";
import { weeklyHoroscope } from "../../api/UserHoroscope";
import { toast, ToastContainer } from "react-toastify";
import NavigationMenu from "../NavigationMenu/NavigationMenu";

const WeeklyHoroscope = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedZodiacSign, setSelectedZodiacSign] = useState(null);
  //const [selectedDay, setSelectedDay] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [isHoroscopeOpen, setIsHoroscopeOpen] = useState(true);
  const [showForm, setShowForm] = useState(true);
  //const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      localStorage.removeItem("weeklyHoroscope");
      // Load user-specific data or perform actions based on user context
    }
  }, [user]);

  const handleZodiacChange = (value) => {
    console.log("Selected Zodiac Sign:", value);
    setSelectedZodiacSign(value);
  };

  // const handleDayChange = (value) => {
  //   console.log("Selected Day:", value);
  //   setSelectedDay(value);
  // };

  const handleBackToForm = () => {
    setShowForm(true);
    setHoroscope(null);
    form.resetFields();
    localStorage.removeItem("weeklyHoroscope");
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Weekly Horoscope Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { zodiacSign } = values;
      const storedDay = localStorage.getItem("weeklyHoroscope");
      if (storedDay) {
        const parsedDay = JSON.parse(storedDay);

        setHoroscope(parsedDay);

        console.log("Stored weekly Horoscope Data:", parsedDay);

        setShowForm(false);
        setLoading(false);
      } else {
        const horoscopeData = await weeklyHoroscope(zodiacSign);
        console.log("Horoscope Data:", horoscopeData);
        localStorage.setItem("weeklyHoroscope", JSON.stringify(horoscopeData));
        setHoroscope(horoscopeData);
        form.resetFields();
        setShowForm(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      toast.error("Error fetching weekly Horoscope Data", {
        position: "top-right",
      });
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          {/* weekly horoscope form */}

          <div className="dashboard-container">
            {!showForm && (
              <div className="welcome-section">
                <motion.h1 className="welcome-title">
                  {"Weekly Horoscope"}
                </motion.h1>
                <div className="action-buttons">
                  {/* <button
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
                </button> */}
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
                  Weekly Horoscope
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
                    {/* <Form.Item
                      label={
                        <span className="form-label">
                          <Calendar className="form-icon" /> Day
                        </span>
                      }
                      name="day"
                      rules={[
                        { required: true, message: "Please select a day!" },
                      ]}
                    >
                      <Select
                        placeholder="Day"
                        className="cosmic-input"
                        onChange={handleDayChange}
                      >
                        <Select.Option value="today">Today</Select.Option>
                        <Select.Option value="tomorrow">Tomorrow</Select.Option>
                        <Select.Option value="yesterday">
                          Yesterday
                        </Select.Option>
                      </Select>
                    </Form.Item> */}

                    <Button
                      htmlType="submit"
                      className="horoscope-submit-button"
                      loading={loading}
                    >
                      Get Weekly Horoscope
                    </Button>
                  </Form>
                ) : (
                  <div className="loading-container">
                    <Star className="loading-icon" />
                    <p>Loading Weekly Horoscope........ </p>
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
                  loading={loading}
                  onClick={handleBackToForm}
                >
                  <ArrowLeft className="icon" /> Back to Weekly Horoscope
                </Button>

                <AnimatePresence>
                  {isHoroscopeOpen && (
                    <motion.div className="horoscope-content">
                      <div className="horoscope-detail">
                        <span className="horoscope-label">{"Week"}:</span>
                        <span className="horoscope-value">
                          {horoscope?.data?.response?.week || "N/A"}
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
                              {"Finance"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.finance || "N/A"}{" "}
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
                            <span className="prediction-label">
                              {"Lucky Color"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.lucky_color || "N/A"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Lucky Numbers"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.lucky_numbers.map(
                                (number, index) => {
                                  return (
                                    <span key={index}>
                                      {number}
                                      {index <
                                      horoscope?.data?.response?.lucky_numbers
                                        .length -
                                        1
                                        ? ", "
                                        : ""}
                                    </span>
                                  );
                                }
                              ) || "N/A"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Physique"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.physique || "N/A"}{" "}
                              {"%"}
                            </span>
                          </div>
                          <div className="prediction-detail">
                            <span className="prediction-label">
                              {"Relationship"}:
                            </span>
                            <span className="prediction-value">
                              {horoscope?.data?.response?.relationship || "N/A"}{" "}
                              {"%"}
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

export default WeeklyHoroscope;
