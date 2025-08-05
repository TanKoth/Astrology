import { React, useState, useEffect, useContext } from "react";
import { color, motion } from "framer-motion";
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
import { Form, Input, Button, TimePicker, DatePicker } from "antd";
import AppContext from "../../context/AppContext";
import "./EditUserDetails.css";
import { updateUserData, getUserDetails } from "../../api/user";
//import { Edit } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { convertHtmlToAstrologyJson } from "../../utilityFunction/utilityFunction";
import moment from "moment";

const EditUserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [form] = Form.useForm();
  const [address, setAddress] = useState("");
  const { setUser } = useContext(AppContext);
  const [coordinates, setCoordinates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
          const user = JSON.parse(userDetails);
          populateForm(user);
          setFetchingUser(false);
        } else {
          const response = await getUserDetails();
          if (response && response.success) {
            populateForm(response.user);
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        toast.error("Failed to fetch user details. Please try again.", {
          position: "top-right",
          color: "red",
        });
      } finally {
        setFetchingUser(false);
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const populateForm = (userData) => {
    const formData = {
      name: userData.name || "",
      email: userData.email || "",
      dob: userData.dob ? moment(userData.dob) : null,
      timeOfBirth: userData.timeOfBirth
        ? moment(userData.timeOfBirth, "HH:mm")
        : null,
      placeOfBirth: userData.placeOfBirth || "",
    };
    form.setFieldsValue(formData);
    if (userData.placeOfBirth) {
      setAddress(userData.placeOfBirth);
    }

    if (userData.coordinates) {
      setCoordinates({
        lat: userData.coordinates.lat,
        lng: userData.coordinates.lng,
      });
    }
  };

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      //const timezoneInfo = await getTimezone(latLng.lat, latLng.lng);
      setAddress(value);
      setCoordinates({
        lat: latLng.lat, // Store directly, not as latLng.lat
        lng: latLng.lng,
        // Add timezone data to coordinates state
        // timeZone: timezoneInfo?.timeZoneId || "UTC",
        // timeZoneName: timezoneInfo?.timeZoneName || "UTC",
        // rawOffset: timezoneInfo?.rawOffset || 0,
        // dstOffset: timezoneInfo?.dstOffset || 0,
      });

      // Update form with selected address
      form.setFieldsValue({ placeOfBirth: value });

      console.log("Selected Address:", value, "Coordinates:", latLng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAddress("");
    setCoordinates({});
    navigate("/dashboard");
    toast.info("Edit cancelled. No changes made.", {
      position: "top-right",
      color: "blue",
    });
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Get user data from localStorage to get the userId
      const userDetails = localStorage.getItem("user");
      const user = userDetails ? JSON.parse(userDetails) : null;

      if (!user || !user._id) {
        throw new Error("User data not found. Please log in again.");
      }

      const updateData = {
        ...values,
        userId: user._id, // Get userId from stored user data, not form values
        // coordinates: coordinates,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        timeOfBirth: values.timeOfBirth
          ? values.timeOfBirth.format("HH:mm")
          : null,
        placeOfBirth: address, // Use the address state value
      };

      const response = await updateUserData(updateData);
      console.log("Update Response:", response);
      if (response && response.success) {
        // Check if astrologyData exists and has data property
        let parsedAstrologyData = null;
        if (response.user.astrologyData && response.user.astrologyData.data) {
          try {
            parsedAstrologyData = convertHtmlToAstrologyJson(
              response.user.astrologyData.data
            );
            console.log("Parsed astrology data:", parsedAstrologyData);
          } catch (parseError) {
            console.warn("Failed to parse astrology data:", parseError);
          }
        }
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (parsedAstrologyData) {
          localStorage.setItem(
            "astrologyData",
            JSON.stringify(parsedAstrologyData)
          );
        }
        if (window.confirm("Do you want to update your details?")) {
          setUser(response.user);
          toast.success("User details updated successfully!", {
            position: "top-right",
            color: "green",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          toast.error("Failed to update user details. Please try again.", {
            position: "top-right",
            color: "red",
          });
        }
      }
    } catch (err) {
      console.error("Error in onFinish:", err);
      toast.error("Failed to update user details. Please try again.", {
        position: "top-right",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  //loading spinner while fetching user data
  if (fetchingUser) {
    return (
      <section className="edit-section">
        <div className="container">
          <div
            className="edit-container"
            style={{ textAlign: "center", padding: "50px" }}
          >
            <div style={{ color: "gold", fontSize: "24px" }}>
              Loading user data...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-section">
      <div className="stars"></div>
      <div className="container">
        <motion.div
          className="edit-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="edit-title"
          >
            Edit User Details
          </motion.h1>
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="edit-form"
            form={form}
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

            {/* <div className="form-row">
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
            </div> */}

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
                  use24Hours
                  format="hh:mm a"
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

            <div className="form-row two-column">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
                  loading={loading}
                >
                  Update
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="cancel-button"
                  loading={loading}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </motion.div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default EditUserDetails;
