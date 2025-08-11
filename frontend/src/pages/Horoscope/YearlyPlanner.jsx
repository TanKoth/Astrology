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
  TableOfContents,
} from "lucide-react";
import { Form, Button, Select, Input } from "antd";
import "./Horoscope.css";
import AppContext from "../../context/AppContext";
import { yearlyHoroscope } from "../../api/UserHoroscope";
import { toast, ToastContainer } from "react-toastify";
import NavigationMenu from "../NavigationMenu/NavigationMenu";

const YearlyHoroscope = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedZodiacSign, setSelectedZodiacSign] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [horoscope, setHoroscope] = useState(null);
  const [isHoroscopeOpen, setIsHoroscopeOpen] = useState(true);
  const [isPhase1Open, setIsPhase1Open] = useState(true);
  const [isPhase2Open, setIsPhase2Open] = useState(true);
  const [isPhase3Open, setIsPhase3Open] = useState(true);
  const [isPhase4Open, setIsPhase4Open] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  //const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      localStorage.removeItem("yearlyHoroscope");
      // Load user-specific data or perform actions based on user context
    }
  }, [user]);

  const handleZodiacChange = (value) => {
    console.log("Selected Zodiac Sign:", value);
    setSelectedZodiacSign(value);
  };

  const currentYear = new Date().getFullYear();

  const handleYearChange = (event) => {
    const value = event.target.value;
    const inputYear = parseInt(value);

    // if (value && inputYear !== currentYear) {
    //   toast.warning("Please enter the current year only!", {
    //     position: "top-right",
    //   });
    //   return;
    // }
    console.log("Selected Year:", inputYear);
    setSelectedYear(inputYear);
    handleSubmit(inputYear);
  };

  const handleSubmit = (year) => {
    const isYearValid = year;
    if (isYearValid === currentYear) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setHoroscope(null);
    form.resetFields();
    localStorage.removeItem("yearlyHoroscope");
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Yearly Horoscope Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { zodiacSign, year } = values;
      const storedYear = localStorage.getItem("yearlyHoroscope");
      if (storedYear) {
        const parsedYear = JSON.parse(storedYear);

        setHoroscope(parsedYear);

        console.log("Stored yearly Horoscope Data:", parsedYear);

        setShowForm(false);
        setLoading(false);
      } else {
        const horoscopeData = await yearlyHoroscope(zodiacSign, year);
        console.log("Horoscope Data:", horoscopeData);
        localStorage.setItem("yearlyHoroscope", JSON.stringify(horoscopeData));
        setHoroscope(horoscopeData);
        form.resetFields();
        setShowForm(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      toast.error("Error fetching yearly Horoscope Data", {
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
          {/* yearly horoscope form */}

          <div className="dashboard-container">
            {!showForm && (
              <div className="welcome-section">
                <motion.h1 className="welcome-title">
                  {"Yearly Horoscope"}
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
                  Yearly Horoscope
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
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Calendar className="form-icon" /> Year
                        </span>
                      }
                      name="year"
                      rules={[
                        {
                          required: true,
                          message: "Please enter current year only!",
                        },
                        {
                          pattern: new RegExp(`^${currentYear}$`),
                          message: `Please enter the current year: ${currentYear}`,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Year"
                        className="cosmic-input"
                        onChange={handleYearChange}
                      />
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      className="horoscope-submit-button"
                      loading={loading}
                      disabled={isDisabled}
                    >
                      Get Yearly Horoscope
                    </Button>
                  </Form>
                ) : (
                  <div className="loading-container">
                    <Star className="loading-icon" />
                    <p>Loading Yearly Horoscope........ </p>
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
                  <ArrowLeft className="icon" /> Back to Yearly Horoscope
                </Button>

                <AnimatePresence>
                  {isHoroscopeOpen && (
                    <motion.div className="horoscope-content">
                      {/* Phase 1 */}
                      <div className="horoscope-detail">
                        <div
                          className="phase-header"
                          onClick={() => setIsPhase1Open(!isPhase1Open)}
                        >
                          <h2 className="phase-title">
                            <TableOfContents className="icon" /> {"Phase 1"}
                          </h2>
                          {isPhase1Open ? (
                            <ChevronUp className="icon" />
                          ) : (
                            <ChevronDown className="icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isPhase1Open && (
                            <motion.div className="phase-content">
                              <div className="phase-detail">
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.period ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Prediction"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.score ||
                                    "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Health"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.health
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.health
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Career"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.career
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.career
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Education"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.education
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.education
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Finances"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.finances
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.finances
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Status"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.status
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.status
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Family"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.family
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.family
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Relationship"} :{" "}
                                  {horoscope?.data?.response?.phase_1
                                    ?.relationship?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1
                                    ?.relationship?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Friends"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.friends
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.friends
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Travel"} :{" "}
                                  {horoscope?.data?.response?.phase_1?.travel
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_1?.travel
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Phase 2 */}
                      <div className="horoscope-detail">
                        <div
                          className="phase-header"
                          onClick={() => setIsPhase2Open(!isPhase2Open)}
                        >
                          <h2 className="phase-title">
                            <TableOfContents className="icon" /> {"Phase 2"}
                          </h2>
                          {isPhase2Open ? (
                            <ChevronUp className="icon" />
                          ) : (
                            <ChevronDown className="icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {!isPhase2Open && (
                            <motion.div className="phase-content">
                              <div className="phase-detail">
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.period ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Prediction"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.score ||
                                    "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Health"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.health
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.health
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Career"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.career
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.career
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Education"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.education
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.education
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Finances"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.finances
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.finances
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Status"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.status
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.status
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Family"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.family
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.family
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Relationship"} :{" "}
                                  {horoscope?.data?.response?.phase_2
                                    ?.relationship?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2
                                    ?.relationship?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Friends"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.friends
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.friends
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Travel"} :{" "}
                                  {horoscope?.data?.response?.phase_2?.travel
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_2?.travel
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Phase 3 */}
                      <div className="horoscope-detail">
                        <div
                          className="phase-header"
                          onClick={() => setIsPhase3Open(!isPhase3Open)}
                        >
                          <h2 className="phase-title">
                            <TableOfContents className="icon" /> {"Phase 3"}
                          </h2>
                          {isPhase3Open ? (
                            <ChevronUp className="icon" />
                          ) : (
                            <ChevronDown className="icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {!isPhase3Open && (
                            <motion.div className="phase-content">
                              <div className="phase-detail">
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.period ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Prediction"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.score ||
                                    "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Health"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.health
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.health
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Career"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.career
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.career
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Education"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.education
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.education
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Finances"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.finances
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.finances
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Status"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.status
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.status
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Family"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.family
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.family
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Relationship"} :{" "}
                                  {horoscope?.data?.response?.phase_3
                                    ?.relationship?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3
                                    ?.relationship?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Friends"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.friends
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.friends
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Travel"} :{" "}
                                  {horoscope?.data?.response?.phase_3?.travel
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_3?.travel
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Phase 4 */}
                      <div className="horoscope-detail">
                        <div
                          className="phase-header"
                          onClick={() => setIsPhase4Open(!isPhase4Open)}
                        >
                          <h2 className="phase-title">
                            <TableOfContents className="icon" /> {"Phase 4"}
                          </h2>
                          {isPhase4Open ? (
                            <ChevronUp className="icon" />
                          ) : (
                            <ChevronDown className="icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {!isPhase4Open && (
                            <motion.div className="phase-content">
                              <div className="phase-detail">
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.period ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Prediction"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.score ||
                                    "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Health"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.health
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.health
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Career"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.career
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.career
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Education"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.education
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.education
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Finances"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.finances
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.finances
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Status"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.status
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.status
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Family"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.family
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.family
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Relationship"} :{" "}
                                  {horoscope?.data?.response?.phase_4
                                    ?.relationship?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4
                                    ?.relationship?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Friends"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.friends
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.friends
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                              <div className="phase-detail">
                                <span className="horoscope-label">
                                  {"Travel"} :{" "}
                                  {horoscope?.data?.response?.phase_4?.travel
                                    ?.score || "N/A"}
                                </span>
                                <span className="horoscope-value">
                                  {horoscope?.data?.response?.phase_4?.travel
                                    ?.prediction || "N/A"}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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

export default YearlyHoroscope;
