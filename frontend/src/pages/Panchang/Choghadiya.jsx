import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, time } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  Printer,
  Languages,
  ArrowLeft,
} from "lucide-react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import "./Panchang.css";
import { getChoghadiyaReport } from "../../api/Panchang";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  Select,
  Table,
} from "antd";

import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";

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

const Choghadiya = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [choghadiyaData, setChoghadiyaData] = useState(null);
  const [isLoadingChoghadiya, setIsLoadingChoghadiya] = useState(false);
  const [isChoghadiyaOpen, setIsChoghadiyaOpen] = useState(true);
  const navigate = useNavigate(); // Initialize navigation
  const [form] = Form.useForm();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Panchang Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    if (user) {
      // fetchInsights();
      localStorage.removeItem("ChoghadiyaData");
    }
  }, [user]);

  const dayColumns = [
    {
      title: "S.No.",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Muhurat",
      dataIndex: "muhurat",
      key: "muhurat",
      width: "10%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "10%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "10%",
    },
  ];

  const dayData = (choghadiyaData) => {
    if (
      !choghadiyaData ||
      !choghadiyaData.report ||
      !choghadiyaData.report?.response ||
      !choghadiyaData?.report?.response?.day
    ) {
      return null;
    }

    const response = choghadiyaData.report.response.day;
    return response.map((item, index) => ({
      key: index,
      start: item.start,
      end: item.end,
      type: item.type,
      muhurat: item.muhurat,
    }));
  };

  const nightColumns = [
    {
      title: "S.No.",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Muhurat",
      dataIndex: "muhurat",
      key: "muhurat",
      width: "10%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "10%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "10%",
    },
  ];

  const nightData = (choghadiyaData) => {
    if (
      !choghadiyaData ||
      !choghadiyaData.report ||
      !choghadiyaData.report?.response ||
      !choghadiyaData?.report?.response?.night
    ) {
      return null;
    }

    const response = choghadiyaData.report.response.night;
    return response.map((item, index) => ({
      key: index,
      start: item.start,
      end: item.end,
      type: item.type,
      muhurat: item.muhurat,
    }));
  };

  const handleLanguageChange = (value) => {
    // Change the language in your app context or state
    console.log("Selected language:", value);
    setSelectedLanguage(value);
    form.setFieldsValue({ lang: value });
  };

  const handleDateChange = (value) => {
    console.log("Selected date:", value);
    setSelectedDate(value);
    form.setFieldsValue({ date: value });
  };

  const handleTimeChange = (value) => {
    console.log("Selected time:", value);
    setSelectedTime(value);
    form.setFieldsValue({ time: value });
  };

  const handleCitySelect = async (value) => {
    console.log("Selected city:", value);
    setAddress(value);
    form.setFieldsValue({ city: value });
  };

  const handleBackToForm = () => {
    setChoghadiyaData(null);
    localStorage.removeItem("choghadiyaData");
    form.resetFields();
    navigate("/choghadiya");
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem("choghadiyaData");
      if (storedData) {
        setChoghadiyaData(JSON.parse(storedData));
        setIsLoadingChoghadiya(false);
      } else {
        const fieldData = form.getFieldsValue();
        console.log("Received form data:", fieldData);
        if (!fieldData.date || !fieldData.time || !fieldData.city) {
          toast.error("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        const locationData = await fetchLocationData(fieldData.city);
        if (!locationData) {
          toast.error("Failed to fetch location data.");
          setLoading(false);
          return;
        }
        const formattedDate = formateDate(fieldData.date);

        const formattedTime = fieldData.time
          ? fieldData.time.format("HH:mm")
          : null;
        console.log(
          "Location data,formatted date, formatted time:",
          locationData,
          formattedDate,
          formattedTime
        );

        const apiParams = {
          date: formattedDate,
          time: formattedTime,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
          lang: fieldData.lang || "en",
        };

        const response = await getChoghadiyaReport(apiParams);
        console.log("Choghadiya report response:", response);
        if (response && response.success) {
          setChoghadiyaData(response);
          localStorage.setItem("choghadiyaData", JSON.stringify(response));
          setIsLoadingChoghadiya(false);
          toast.success("Choghadiya report fetched successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching Choghadiya report:", err);
      toast.error("Failed to fetch Choghadiya report.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
      setIsLoadingChoghadiya(false);
      form.resetFields();
    }
  };

  // const translatePrerdiction = (prediction) => {
  //   if (!prediction) return "";
  //   // Try to translate, fallback to original if translation doesn't exist
  //   const translated = t(prediction.toLowerCase().replace(/\s+/g, ""));
  //   return translated !== prediction.toLowerCase().replace(/\s+/g, "")
  //     ? translated
  //     : prediction;
  // };

  if (isLoadingChoghadiya) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Choghadiya Data........ </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // <section className="panchang-section">

    //   <ToastContainer />
    // </section>

    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          <div className="dashboard-container">
            {/* <div className="stars"></div> */}
            {!choghadiyaData && (
              <div className="form-container">
                <motion.div
                  className="panchang-form-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="panchang-form-title"
                  >
                    Choghadiya Report
                  </motion.h1>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="panchang-form-form"
                  >
                    <div className="form-row two-column">
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Date
                          </span>
                        }
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your date!",
                          },
                        ]}
                      >
                        <DatePicker
                          className="cosmic-input"
                          placeholder="YYYY-MM-DD"
                          format="YYYY-MM-DD"
                          showTime={false}
                          onChange={handleDateChange}
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Time
                          </span>
                        }
                        name="time"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your time",
                          },
                        ]}
                      >
                        <TimePicker
                          use24Hours
                          format="HH:mm"
                          className="cosmic-input"
                          placeholder="Select Time"
                          showNow={false}
                          onChange={handleTimeChange}
                        />
                      </Form.Item>
                    </div>

                    <div className="form-row">
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaMapMarkerAlt className="form-icon" />
                            City
                          </span>
                        }
                        name="city"
                        rules={[
                          {
                            required: true,
                            message: "Please select your city!",
                          },
                        ]}
                      >
                        <PlacesAutocomplete
                          value={address}
                          onChange={setAddress}
                          onSelect={handleCitySelect}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div className="places-autocomplete-container">
                              <Input
                                {...getInputProps({
                                  placeholder: "Search your city",
                                  className: "cosmic-input",
                                })}
                              />
                              <div className="autocomplete-dropdown-container">
                                {loading && (
                                  <div className="suggestion-item">
                                    Loading...
                                  </div>
                                )}
                                {suggestions.map((suggestion) => (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className: `suggestion-item ${
                                        suggestion.active ? "active" : ""
                                      }`,
                                    })}
                                    key={suggestion.placeId}
                                  >
                                    {suggestion.description}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      </Form.Item>
                    </div>
                    <Form.Item
                      label={
                        <span className="form-label">
                          <Languages className="form-icon" /> Language
                        </span>
                      }
                      name="lang"
                      rules={[
                        {
                          message: "Please select your language!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Your Language"
                        className="cosmic-input"
                        onSelect={handleLanguageChange}
                      >
                        <Select.Option value="en">English</Select.Option>
                        <Select.Option value="hi">हिंदी</Select.Option>
                        <Select.Option value="mr">मराठी</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="panchang-submit-button"
                        loading={loading}
                      >
                        Get Choghadiya
                      </Button>
                    </Form.Item>
                  </Form>

                  {message && <p className="error-message">{message}</p>}
                </motion.div>
              </div>
            )}

            {/* {!panchangData && !isLoadingPanchang && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No charts available"}</h3>
                  <p>
                    {"completeProfile" ||
                      "Please complete your profile to generate charts."}
                  </p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/login")}
                  >
                    {"Go to Login"}
                  </button>
                </div>
              </motion.div>
            )} */}

            {choghadiyaData && (
              <>
                <div className="welcome-section">
                  <motion.h1 className="welcome-title">
                    {"Choghadiya Report"}
                  </motion.h1>
                  {choghadiyaData && (
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
                  )}
                </div>
                <motion.div className="panchang-section">
                  <div
                    className="panchang-header"
                    onClick={() => setIsChoghadiyaOpen(!isChoghadiyaOpen)}
                  >
                    <h2 className="panchang-title">
                      <Star className="icon" /> {"Choghadiya"}
                    </h2>
                    {isChoghadiyaOpen ? (
                      <ChevronUp className="icon" />
                    ) : (
                      <ChevronDown className="icon" />
                    )}
                  </div>
                  <Button
                    htmlType="submit"
                    className="panchang-back-button"
                    loading={loading}
                    onClick={handleBackToForm}
                  >
                    <ArrowLeft className="icon" /> Back to Choghadiya
                  </Button>

                  <AnimatePresence>
                    {isChoghadiyaOpen && (
                      <motion.div className="panchang-content">
                        <div className="panchang-details-grid">
                          <div className="panchang-detail">
                            <span className="panchang-label">{"Day"}:</span>
                            <span className="panchang-value">
                              {choghadiyaData?.report?.response?.day_of_week ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="panchang-detail">
                            <span className="panchang-label">{"Date"}:</span>
                            <span className="panchang-value">
                              {selectedDate
                                ? selectedDate.format("DD/MM/YYYY")
                                : "N/A"}
                            </span>
                          </div>
                          <div className="panchang-detail">
                            <span className="panchang-label">{"City"}:</span>
                            <span className="panchang-value">
                              {address || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="panchang-detail">
                          <motion.div
                            className="panchang-details-table"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <h3 className="panchang-table-title">Day</h3>
                            <Table
                              columns={dayColumns}
                              dataSource={dayData(choghadiyaData)}
                              pagination={false}
                              bordered
                              size="middle"
                              className="panchang-table"
                              scroll={{ x: 800 }}
                            />
                            <br />
                            <h3 className="panchang-table-title">Night</h3>
                            <Table
                              columns={nightColumns}
                              dataSource={nightData(choghadiyaData)}
                              pagination={false}
                              bordered
                              size="middle"
                              className="panchang-table"
                              scroll={{ x: 800 }}
                            />
                          </motion.div>
                        </div>

                        {/* table components */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Choghadiya;
