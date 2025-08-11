import React, { useState, useContext } from "react";
import { motion, time } from "framer-motion";
import { Form, Input, Button, TimePicker, DatePicker } from "antd";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import "./SignUp.css";
import { saveUserData } from "../../api/user"; // Adjust the import path as needed
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  // Function to get timezone from coordinates
  const getTimezone = async (lat, lng) => {
    try {
      const timestamp = Math.floor(Date.now() / 1000); // Current timestamp
      const apiKey = "AIzaSyCQYenBQ4dzHv7M445IIpDs3Lro7-6bAt0"; // Your Google API key

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        return {
          timeZoneId: data.timeZoneId,
          timeZoneName: data.timeZoneName,
          rawOffset: data.rawOffset,
          dstOffset: data.dstOffset,
        };
      } else {
        console.error("Timezone API error:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
      return null;
    }
  };

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      const timezoneInfo = await getTimezone(latLng.lat, latLng.lng);
      setAddress(value);
      setCoordinates({
        lat: latLng.lat, // Store directly, not as latLng.lat
        lng: latLng.lng,
        // Add timezone data to coordinates state
        timeZone: timezoneInfo?.timeZoneId || "UTC",
        timeZoneName: timezoneInfo?.timeZoneName || "UTC",
        rawOffset: timezoneInfo?.rawOffset || 0,
        dstOffset: timezoneInfo?.dstOffset || 0,
      });

      // Update form with selected address
      form.setFieldsValue({ placeOfBirth: value });

      console.log(
        "Selected Address:",
        value,
        "Coordinates:",
        latLng,
        "Timezone:",
        timezoneInfo,
        "GMT :",
        formatGMTOffset(timezoneInfo.rawOffset / 3600)
      );
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Helper function to format GMT offset
  const formatGMTOffset = (offsetHours) => {
    const sign = offsetHours >= 0 ? "+" : "-";
    const absOffset = Math.abs(offsetHours);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");

    return `${hoursStr}:${minutesStr}`;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await saveUserData(values);
      if (response && response.success) {
        setLoading(false);
        console.log("Response from server:", response);
        localStorage.setItem("token", response.token);
        //localStorage.setItem("user", JSON.stringify(response.user));
        toast.success("User data saved successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        form.setFieldsValue();
      }
      setLoading(false);
    } catch (err) {
      toast.error("Error saving user data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <section className="signup-section">
      <div className="stars"></div>
      <div className="container">
        <motion.div
          className="signup-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="signup-title"
          >
            Your Personalized Report
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="signup-subtitle"
          >
            Enter your details to unlock your cosmic potential
          </motion.p>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="signup-form"
          >
            <div className="form-row two-column">
              <Form.Item
                label={
                  <span className="form-label">
                    <FaUser className="form-icon" />
                    Name
                  </span>
                }
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input placeholder="Your Name" className="cosmic-input" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="form-label">
                    <FaEnvelope className="form-icon" />
                    Email
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  placeholder="Your Email Address"
                  className="cosmic-input"
                />
              </Form.Item>
            </div>

            <div className="form-row">
              <Form.Item
                label={
                  <span className="form-label">
                    <FaLock className="form-icon" />
                    Password
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: "Please create a password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Choose a strong password"
                  className="cosmic-input"
                />
              </Form.Item>
            </div>

            <div className="form-row two-column">
              <Form.Item
                label={
                  <span className="form-label">
                    <FaClock className="form-icon" />
                    Date of Birth
                  </span>
                }
                name="dob"
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
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="form-label">
                    <FaClock className="form-icon" />
                    Birth Time
                  </span>
                }
                name="timeOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please enter your time of birth!",
                  },
                ]}
              >
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  className="cosmic-input"
                  placeholder="Select Time"
                />
              </Form.Item>
            </div>

            <div className="form-row">
              <Form.Item
                label={
                  <span className="form-label">
                    <FaMapMarkerAlt className="form-icon" />
                    Place of Birth
                  </span>
                }
                name="placeOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please select your place of birth!",
                  },
                ]}
              >
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelect}
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
                          placeholder: "Search your birthplace",
                          className: "cosmic-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && (
                          <div className="suggestion-item">Loading...</div>
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                loading={loading}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {message && <p className="error-message">{message}</p>}

          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </motion.div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="dark" // or "light" based on your design
      />
    </section>
  );
};

export default SignUp;
