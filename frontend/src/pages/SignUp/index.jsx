import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
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
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setAddress(value);
      setCoordinates(latLng);

      // Update form with selected address
      form.setFieldsValue({ placeOfBirth: value });

      console.log("Selected Address:", value, "Coordinates:", latLng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const onFinish = async (values) => {
    if (!coordinates.lat || !coordinates.lng) {
      setMessage("Please select a valid address.");
      return;
    }

    const formattedTime = values.timeOfBirth
      ? values.timeOfBirth.format("HH:mm")
      : null; // 24-hour format
    const formattedDate = values.dob ? values.dob.format("YYYY-MM-DD") : null;

    const userDetails = {
      ...values,
      address,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      dob: formattedDate,
      timeOfBirth: formattedTime,
    };

    console.log("Form Submitted:", userDetails);

    try {
      setLoading(true);

      // const response = await saveUserData(userDetails);
      // console.log("user details", userDetails);
      // localStorage.setItem("token", response.token);
      // localStorage.setItem("user", JSON.stringify(response.user));
      // setUser(response.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }

    setLoading(true);

    // Trigger payment with user details
    // handlePayment(199, userDetails);

    setLoading(false);
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
            Already have an account? <a href="/login">Log In</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUp;
