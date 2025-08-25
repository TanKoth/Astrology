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
import { Form, Button, Select, Table } from "antd";
import { getNakshatraMatchingReport } from "../../api/Matching";
import "./Matching.css";
import AppContext from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { NakshatraMatchingTable } from "./NakshatraMatchingTable";

const NakshatraMatching = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedBoyNakshatra, setSelectedBoyNakshatra] = useState(null);
  const [selectedGirlNakshatra, setSelectedGirlNakshatra] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [nakshatraMatchingData, setNakshatraMatchingData] = useState(null);
  const [isnakshatraMatchingOpen, setIsnakshatraMatchingOpen] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const { user } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.removeItem("nakshatraMatchingData");
      // Load user-specific data or perform actions based on user context
    }
  }, [user]);

  const nakshatraName = [
    { value: "1", label: "Ashwini" },
    { value: "2", label: "Bharani" },
    { value: "3", label: "Krittika" },
    { value: "4", label: "Rohini" },
    { value: "5", label: "Mrigashira" },
    { value: "6", label: "Ardra" },
    { value: "7", label: "Punarvasu" },
    { value: "8", label: "Pushya" },
    { value: "9", label: "Ashlesha" },
    { value: "10", label: "Magha" },
    { value: "11", label: "Purva Phalguni" },
    { value: "12", label: "Uttara Phalguni" },
    { value: "13", label: "Hasta" },
    { value: "14", label: "Chitra" },
    { value: "15", label: "Swati" },
    { value: "16", label: "Vishakha" },
    { value: "17", label: "Anuradha" },
    { value: "18", label: "Jyeshta" },
    { value: "19", label: "Moola" },
    { value: "20", label: "Poorva Ashadha" },
    { value: "21", label: "Uttara Ashadha" },
    { value: "22", label: "Shravana" },
    { value: "23", label: "Dhanishtha" },
    { value: "24", label: "Shatabhisha" },
    { value: "25", label: "Poorva Bhadrapada" },
    { value: "26", label: "Uttara Bhadrapada" },
    { value: "27", label: "Revati" },
  ];

  const handleBoyNakshatraChange = (value) => {
    console.log("Selected Boy Nakshatra:", value);
    setSelectedBoyNakshatra(value);
  };

  const handleGirlNakshatraChange = (value) => {
    console.log("Selected Girl Nakshatra:", value);
    setSelectedGirlNakshatra(value);
  };
  const handleLangChange = (value) => {
    console.log("Selected Language:", value);
    setSelectedLanguage(value);
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setNakshatraMatchingData(null);
    form.resetFields();
    localStorage.removeItem("nakshatraMatchingData");
    navigate("/nakshatra-matching");
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Nakshatra Matching Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { boyNakshatra, girlNakshatra, lang } = values;
      const storedData = localStorage.getItem("nakshatraMatchingData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        setNakshatraMatchingData(parsedData);

        console.log("Stored Nakshatra Matching Data:", parsedData);

        setShowForm(false);
        setLoading(false);
      } else {
        const response = await getNakshatraMatchingReport(
          boyNakshatra,
          girlNakshatra,
          lang
        );
        console.log("Nakshatra Data:", response);
        localStorage.setItem("nakshatraMatchingData", JSON.stringify(response));
        setNakshatraMatchingData(response);
        form.resetFields();
        setShowForm(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching nakshatra matching Data:", error);
      toast.error("Error fetching Nakshatra Matching Data", {
        position: "top-right",
      });
      setShowForm(true);
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Nakshatra Matching Data........ </p>
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
          {/* daily horoscope form */}

          <div className="dashboard-container">
            {!showForm && (
              <div className="welcome-section">
                <motion.h1 className="welcome-title">
                  {"Nakshatra Matching"}
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

            {!nakshatraMatchingData && !loading && (
              <motion.div
                className="matching-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="matching-title"
                >
                  Nakshatra Matching
                </motion.h1>

                {showForm ? (
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    className="matching-form"
                    form={form}
                  >
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Atom className="form-icon" /> Boy Nakshatra
                        </span>
                      }
                      name="boyNakshatra"
                      rules={[
                        {
                          required: true,
                          message: "Please select boy nakshatra!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Enter Boy Nakshatra"
                        className="cosmic-input"
                        onChange={handleBoyNakshatraChange}
                        value={selectedBoyNakshatra}
                      >
                        <Select.Option value="">
                          --Select Boy Nakshatra--
                        </Select.Option>
                        {nakshatraName.map((nakshatra, index) => (
                          <Select.Option key={index} value={nakshatra.value}>
                            {nakshatra.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Atom className="form-icon" /> Girl Nakshatra
                        </span>
                      }
                      name="girlNakshatra"
                      rules={[
                        {
                          required: true,
                          message: "Please select girl nakshatra!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Enter Girl Nakshatra"
                        className="cosmic-input"
                        onChange={handleGirlNakshatraChange}
                        value={selectedGirlNakshatra}
                      >
                        <Select.Option value="">
                          --Select Girl Nakshatra--
                        </Select.Option>
                        {nakshatraName.map((nakshatra, index) => (
                          <Select.Option key={index} value={nakshatra.value}>
                            {nakshatra.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Calendar className="form-icon" /> Language
                        </span>
                      }
                      name="lang"
                      rules={[
                        {
                          message: "Please select a language!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Language"
                        className="cosmic-input"
                        onChange={handleLangChange}
                      >
                        <Select.Option value="en">English</Select.Option>
                        <Select.Option value="hi">हिंदी</Select.Option>
                      </Select>
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      className="matching-submit-button"
                      loading={loading}
                    >
                      Get Nakshatra Matching
                    </Button>
                  </Form>
                ) : (
                  <div className="loading-container">
                    <Star className="loading-icon" />
                    <p>Loading Nakshatra Matching........ </p>
                  </div>
                )}
              </motion.div>
            )}

            {nakshatraMatchingData && (
              <motion.div className="matching-section">
                <div
                  className="matching-header"
                  onClick={() =>
                    setIsnakshatraMatchingOpen(!isnakshatraMatchingOpen)
                  }
                >
                  <h2 className="matching-title">
                    <Star className="icon" /> {"Nakshatra Matching Insights"}
                  </h2>
                  {isnakshatraMatchingOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>
                <Button
                  htmlType="submit"
                  className="nakshatra-matching-button"
                  loading={loading}
                  onClick={handleBackToForm}
                >
                  <ArrowLeft className="icon" /> Back to Nakshatra Matching
                </Button>

                <AnimatePresence>
                  {isnakshatraMatchingOpen && (
                    <motion.div className="nakshatra-matching-content">
                      <div className="nakshatra-matching-details-grid">
                        <div className="nakshatra-matching-detail">
                          <span className="nakshatra-matching-label">
                            {"Boy Nakshatra"}:
                          </span>
                          <span className="nakshatra-matching-value">
                            {nakshatraMatchingData?.report?.response?.dina
                              ?.boy_star || "N/A"}
                          </span>
                        </div>
                        <div className="nakshatra-matching-detail">
                          <span className="nakshatra-matching-label">
                            {"Girl Nakshatra"}:
                          </span>
                          <span className="nakshatra-matching-value">
                            {nakshatraMatchingData?.report?.response?.dina
                              ?.girl_star || "N/A"}
                          </span>
                        </div>
                        <div className="nakshatra-matching-detail">
                          <span className="nakshatra-matching-label">
                            {"Obtained Marks"}:
                          </span>
                          <span className="nakshatra-matching-value">
                            {nakshatraMatchingData?.report?.response?.score ??
                              "N/A"}{" "}
                            {"/"} {"10"}
                          </span>
                        </div>
                      </div>
                      {/* Table */}
                      <NakshatraMatchingTable
                        nakshatraMatchingData={nakshatraMatchingData}
                      />
                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Nakshatra Matching Result"}:
                        </span>
                        <span className="nakshatra-matching-value">
                          <ul>
                            <li>
                              {nakshatraMatchingData?.report?.response
                                ?.bot_response || "N/A"}
                            </li>
                            <br />
                            <li>
                              <p>
                                To get quick and more accurate Nakshatra
                                Matching results, Do you want to know if your
                                Nakshatra is compatible with your partner's and
                                you are choosing Mr. Right or Mrs. Right? Get in
                                touch with us for personalized insights! Get all
                                the answer in one call/chat.
                              </p>
                            </li>
                          </ul>
                          <Button
                            htmlType="submit"
                            className="matching-submit-button"
                            loading={loading}
                            onClick={() => navigate("/contactUS")}
                          >
                            Contact Us!
                          </Button>
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

export default NakshatraMatching;
