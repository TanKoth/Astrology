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
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import {
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  Select,
  Table,
} from "antd";
import { getBoyAndGirlMatchingData } from "../../api/Matching";
import "./Matching.css";
import AppContext from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";
import {
  MatchingTable,
  AdvanceDetailsTable,
  LuckyDetailsTable,
  GunaMilanTable,
} from "./MatchingTable";

const Matching = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [boyAddress, setBoyAddress] = useState("");
  const [girlAddress, setGirlAddress] = useState("");
  const [selectedBoyTime, setSelectedBoyTime] = useState(null);
  const [selectedGirlTime, setSelectedGirlTime] = useState(null);
  const [selectedBoyDate, setSelectedBoyDate] = useState(null);
  const [selectedGirlDate, setSelectedGirlDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [matchingData, setMatchingData] = useState(null);
  const [isMatchingOpen, setIsMatchingOpen] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const { user } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.removeItem("matchingData");
    }
  }, [user]);

  const handleLangChange = (value) => {
    console.log("Selected Language:", value);
    setSelectedLanguage(value);
    form.setFieldValue({ lang: value });
  };

  const handleBoyCitySelect = async (value) => {
    console.log("Selected Boy city:", value);
    setBoyAddress(value);
    form.setFieldsValue({ boyCity: value });
  };

  const handleGirlCitySelect = async (value) => {
    console.log("Selected Girl city:", value);
    setGirlAddress(value);
    form.setFieldsValue({ girlCity: value });
  };
  const handleBoyTimeChange = (value) => {
    console.log("Selected boy time:", value);
    setSelectedBoyTime(value);
    form.setFieldValue("boy_time", value); // ✅ Fixed: correct syntax
  };

  const handleGirlTimeChange = (value) => {
    console.log("Selected girl time:", value);
    setSelectedGirlTime(value);
    form.setFieldValue("girl_time", value); // ✅ Fixed: correct syntax
  };
  const handleBoyDateChange = (value) => {
    console.log("Selected boy date:", value);
    setSelectedBoyDate(value);
    form.setFieldValue("boy_date_of_birth", value);
  };

  const handleGirlDateChange = (value) => {
    console.log("Selected girl date:", value);
    setSelectedGirlDate(value);
    form.setFieldValue("girl_date_of_birth", value);
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setMatchingData(null);
    form.resetFields();
    localStorage.removeItem("matchingData");
    navigate("/matching");
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Matching Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem("matchingData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setMatchingData(parsedData);
        console.log("Stored Matching Data:", parsedData);
        setShowForm(false);
        setLoading(false);
      } else {
        // Get form data at the beginning before any async operations
        const fieldData = form.getFieldsValue();
        console.log("All field data:", fieldData);

        // Validate required fields first
        if (!fieldData.boyCity || !fieldData.girlCity) {
          toast.error("Please select birth places for both boy and girl");
          setLoading(false);
          return;
        }

        if (!fieldData.boy_time || !fieldData.girl_time) {
          toast.error("Please select birth times for both boy and girl");
          setLoading(false);
          return;
        }

        if (!fieldData.boy_date_of_birth || !fieldData.girl_date_of_birth) {
          toast.error("Please select birth dates for both boy and girl");
          setLoading(false);
          return;
        }

        // Fetch location data
        const boyLocationData = await fetchLocationData(fieldData.boyCity);
        const girlLocationData = await fetchLocationData(fieldData.girlCity);

        // Format dates
        const boyDateData = formateDate(fieldData.boy_date_of_birth);
        const girlDateData = formateDate(fieldData.girl_date_of_birth);

        // Format times
        const formattedBoyTime = fieldData.boy_time.format("HH:mm");
        const formattedGirlTime = fieldData.girl_time.format("HH:mm");

        console.log("Formatted Boy Time:", formattedBoyTime);
        console.log("Formatted Girl Time:", formattedGirlTime);

        const boyData = {
          boy_dob: boyDateData,
          boy_tob: formattedBoyTime,
          boy_lat: boyLocationData.latitude,
          boy_lon: boyLocationData.longitude,
          boy_tz: boyLocationData.gmtOffset,
          lang: fieldData.lang || "en",
        };

        const girlData = {
          girl_dob: girlDateData,
          girl_tob: formattedGirlTime,
          girl_lat: girlLocationData.latitude,
          girl_lon: girlLocationData.longitude,
          girl_tz: girlLocationData.gmtOffset,
          lang: fieldData.lang || "en",
        };

        const response = await getBoyAndGirlMatchingData(boyData, girlData);
        if (response && response.success) {
          setMatchingData(response);
          localStorage.setItem("matchingData", JSON.stringify(response));
          setShowForm(false);
          toast.success("Fetching Matching Data.....!", {
            position: "top-right",
            autoClose: 3000,
          });
          // Don't reset fields here if you need them later
          // form.resetFields();
        }
      }
    } catch (error) {
      console.error("Error fetching matching Data:", error);
      toast.error("Error fetching Matching Data", {
        position: "top-right",
      });
      setShowForm(true);
    } finally {
      setLoading(false);
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
              <p>Loading Matching Data........ </p>
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
                  {"Matching Report"}
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

            {!matchingData && !loading && (
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
                  Matching Report
                </motion.h1>

                {showForm ? (
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    className="matching-form"
                    form={form}
                  >
                    <div className="form-row two-column">
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Boy Date of Birth
                          </span>
                        }
                        name="boy_date_of_birth"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your date of birth!",
                          },
                        ]}
                      >
                        <DatePicker
                          className="cosmic-input"
                          placeholder="YYYY-MM-DD"
                          format="YYYY-MM-DD"
                          showTime={false}
                          onChange={handleBoyDateChange}
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Boy Birth Time
                          </span>
                        }
                        name="boy_time"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your time of birth!",
                          },
                        ]}
                      >
                        <TimePicker
                          use24Hours
                          format="HH:mm"
                          className="cosmic-input"
                          placeholder="Select Time"
                          showNow={false}
                          onChange={handleBoyTimeChange}
                        />
                      </Form.Item>
                    </div>

                    <div className="form-row two-column">
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Girl Date of Birth
                          </span>
                        }
                        name="girl_date_of_birth"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your date of birth!",
                          },
                        ]}
                      >
                        <DatePicker
                          className="cosmic-input"
                          placeholder="YYYY-MM-DD"
                          format="YYYY-MM-DD"
                          showTime={false}
                          onChange={handleGirlDateChange}
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaClock className="form-icon" />
                            Girl Birth Time
                          </span>
                        }
                        name="girl_time"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your time of birth!",
                          },
                        ]}
                      >
                        <TimePicker
                          use24Hours
                          format="HH:mm"
                          className="cosmic-input"
                          placeholder="Select Time"
                          showNow={false}
                          onChange={handleGirlTimeChange}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-row two-column">
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaMapMarkerAlt className="form-icon" />
                            Boy Birth Place
                          </span>
                        }
                        name="boyCity"
                        rules={[
                          {
                            required: true,
                            message: "Please select your city!",
                          },
                        ]}
                      >
                        <PlacesAutocomplete
                          value={boyAddress}
                          onChange={setBoyAddress}
                          onSelect={handleBoyCitySelect}
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
                      <Form.Item
                        label={
                          <span className="form-label">
                            <FaMapMarkerAlt className="form-icon" />
                            Girl Birth Place
                          </span>
                        }
                        name="girlCity"
                        rules={[
                          {
                            required: true,
                            message: "Please select your city!",
                          },
                        ]}
                      >
                        <PlacesAutocomplete
                          value={girlAddress}
                          onChange={setGirlAddress}
                          onSelect={handleGirlCitySelect}
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
                      Get Matching
                    </Button>
                  </Form>
                ) : (
                  <div className="loading-container">
                    <Star className="loading-icon" />
                    <p>Loading Matching Data........ </p>
                  </div>
                )}
              </motion.div>
            )}

            {matchingData && (
              <motion.div className="matching-section">
                <div
                  className="matching-header"
                  onClick={() => setIsMatchingOpen(!isMatchingOpen)}
                >
                  <h2 className="matching-title">
                    <Star className="icon" /> {"Matching Insights"}
                  </h2>
                  {isMatchingOpen ? (
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
                  <ArrowLeft className="icon" /> Back
                </Button>

                <AnimatePresence>
                  {isMatchingOpen && (
                    <motion.div className="nakshatra-matching-content">
                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Basic Details"}:
                        </span>
                        {/* <span className="nakshatra-matching-value">
                            {matchingData?.report?.response?.dina?.boy_star ||
                              "N/A"}
                          </span> */}
                        <MatchingTable
                          matchingData={matchingData}
                          selectedBoyDate={formateDate(selectedBoyDate)}
                          selectedBoyTime={selectedBoyTime.format("HH:mm")}
                          boyAddress={boyAddress}
                          selectedGirlDate={formateDate(selectedGirlDate)}
                          selectedGirlTime={selectedGirlTime.format("HH:mm")}
                          girlAddress={girlAddress}
                        />
                      </div>
                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Advance Details"}:
                        </span>
                        <AdvanceDetailsTable matchingData={matchingData} />
                      </div>

                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Lucky Details"}:
                        </span>
                        <LuckyDetailsTable matchingData={matchingData} />
                      </div>
                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Gun Milan"}:
                        </span>
                        <GunaMilanTable matchingData={matchingData} />
                      </div>

                      <div className="nakshatra-matching-detail">
                        <span className="nakshatra-matching-label">
                          {"Matching Result"}:
                        </span>
                        <span className="nakshatra-matching-value">
                          <ul>
                            <li>
                              {matchingData?.report?.response?.bot_response ||
                                "N/A"}
                            </li>
                            <br />
                            <li>
                              <p>
                                To get quick and more accurate Matching results,
                                Do you want to know if your Guna Milan
                                compatible with your partner's and you are
                                choosing Mr. Right or Mrs. Right? Get in touch
                                with us for personalized insights! Get all the
                                answer in one call/chat.
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

export default Matching;
