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
import { getPanchangReport } from "../../api/Panchang";
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
import moment from "moment";

import { TithiTable } from "./PanchangTable";

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

const Panchang = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [panchangData, setPanchangData] = useState(null);
  const [isLoadingPanchang, setIsLoadingPanchang] = useState(false);
  const [isPanchangOpen, setIsPanchangOpen] = useState(true);
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
      localStorage.removeItem("panchangData");
    }
  }, [user]);

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
    setPanchangData(null);
    localStorage.removeItem("panchangData");
    form.resetFields();
    navigate("/panchang");
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem("panchangData");
      if (storedData) {
        setPanchangData(JSON.parse(storedData));
        setIsLoadingPanchang(false);
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

        const response = await getPanchangReport(apiParams);
        console.log("Panchang report response:", response);
        if (response && response.success) {
          setPanchangData(response);
          localStorage.setItem("panchangData", JSON.stringify(response));
          setIsLoadingPanchang(false);
          toast.success("Panchang report fetched successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching Panchang report:", err);
      toast.error("Failed to fetch Panchang report.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
      setIsLoadingPanchang(false);
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

  if (isLoadingPanchang) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Panchang Data........ </p>
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
            {!panchangData && (
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
                    Panchang Report
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
                        Get Panchang
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

            {panchangData && (
              <>
                <div className="welcome-section">
                  <motion.h1 className="welcome-title">
                    {"Panchang Report"}
                  </motion.h1>
                  {panchangData && (
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
                    onClick={() => setIsPanchangOpen(!isPanchangOpen)}
                  >
                    <h2 className="panchang-title">
                      <Star className="icon" /> {"Panchang"}
                    </h2>
                    {isPanchangOpen ? (
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
                    <ArrowLeft className="icon" /> Back to Panchang
                  </Button>

                  <AnimatePresence>
                    {isPanchangOpen && (
                      <motion.div className="panchang-content">
                        <div className="panchang-detail">
                          <span className="panchang-label">{"Details"}:</span>
                          <div className="panchang-details-grid">
                            <div className="panchang-detail">
                              <span className="panchang-label">{"Date"}:</span>
                              <span className="panchang-value">
                                {panchangData?.report?.response?.date || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">{"Rasi"}:</span>
                              <span className="panchang-value">
                                {panchangData?.report?.response?.rasi?.name ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">{"Vaara"}:</span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.vaara || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Abhijit Muhurta"}:
                              </span>
                              <span className="panchang-value">
                                <span className="panchang-label">
                                  {"Start"}:{" "}
                                  {panchangData?.report?.response
                                    ?.advanced_details?.abhijitMuhurta?.start ||
                                    "N/A"}
                                </span>
                                <span className="panchang-label">
                                  {"End"}:{" "}
                                  {panchangData?.report?.response
                                    ?.advanced_details?.abhijitMuhurta?.end ||
                                    "N/A"}
                                </span>
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"RahuKaal"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response?.rahukaal ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Gulika"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response?.gulika ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Yamakanta"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response?.yamakanta ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Sun Rise"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.sun_rise || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Sun Set"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.sun_set || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Moon Rise"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.moon_rise || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Moon Set"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.moon_set || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Solar Noon"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.solar_noon || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Next Full Moon"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.next_full_moon || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Next New Moon"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.next_new_moon || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Amanta Name"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.amanta_name ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Purnimanta Name"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.purnimanta_name ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Alternate Amanta Name"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa
                                  ?.alternate_amanta_name || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Adhik Maasa"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.adhik_maasa ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">{"Ayana"}:</span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.ayana || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Moon Phase"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.moon_phase || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Paksha"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.paksha || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">{"Ritu"}:</span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.masa?.ritu || "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Moon Yogini Nivas"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.moon_yogini_nivas ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="panchang-detail">
                              <span className="panchang-label">
                                {"Disha Shool"}:
                              </span>
                              <span className="panchang-value">
                                {panchangData?.report?.response
                                  ?.advanced_details?.disha_shool || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* table components */}
                        <TithiTable panchangData={panchangData} />
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

export default Panchang;
