import React from "react";
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { Form, Button, Input, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import AppContext from "../../context/AppContext";
import { userLogin } from "../../api/UserLogin";
import { convertHtmlToAstrologyJson } from "../../utilityFunction/utilityFunction";
import { toast, ToastContainer } from "react-toastify";

const { Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const onFinish = async (values) => {
    // try {
    //   setLoading(true);
    //   const data = await userLogin(values);
    //   console.log("Login successful:", data);
    //   const parsedAstrologyData = convertHtmlToAstrologyJson(
    //     data.astrologyData.data
    //   );
    //   console.log("Parsed astrology data:", parsedAstrologyData);
    //   localStorage.setItem("token", data.token);
    //   localStorage.setItem("user", JSON.stringify(data.user));
    //   if (parsedAstrologyData) {
    //     localStorage.setItem(
    //       "astrologyData",
    //       JSON.stringify(parsedAstrologyData)
    //     );
    //   }
    //   setUser(data.user);
    //   navigate("/dashboard");
    // } catch (error) {
    //   setMessage(error.response?.data?.message || "Login failed. Try again.");
    // }
    // setLoading(false);
    try {
      setLoading(true);
      setMessage(""); // Clear previous messages

      // Step 1: Login API call
      setMessage("Logging in...");
      const data = await userLogin(values);
      console.log("Login successful:", data);

      // Step 2: Process astrology data
      setMessage("Processing your astrology data...");

      // Use setTimeout to allow UI to update before heavy processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      const parsedAstrologyData = convertHtmlToAstrologyJson(
        data.astrologyData.data
      );
      console.log("Parsed astrology data:", parsedAstrologyData);

      // Step 3: Store data (batch localStorage operations)
      toast.success("Loading your data...", {
        position: "top-right",
        autoClose: 100,
      });
      const storageData = {
        token: data.token,
        user: JSON.stringify(data.user),
        ...(parsedAstrologyData && {
          astrologyData: JSON.stringify(parsedAstrologyData),
        }),
      };

      // Batch localStorage operations
      Object.entries(storageData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Try again.");
      toast.error(
        "Login failed. Try again. Please try again with proper credentials.",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="login-title"
        >
          Welcome Back
        </motion.h1>

        <Form layout="vertical" onFinish={onFinish} className="login-form">
          <Form.Item
            label={
              <span className="form-label">
                <FaUser className="form-icon" /> Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Your Email" className="cosmic-input" />
          </Form.Item>

          <Form.Item
            label={
              <span className="form-label">
                <FaLock className="form-icon" /> Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Your Password"
              className="cosmic-input"
            />
          </Form.Item>

          <Button htmlType="submit" className="submit-button" loading={loading}>
            Log In
          </Button>
          <Text className="signup-link">
            Forgot password?{" "}
            <Link
              to="/forgot-password"
              className="signup-link-text"
              onClick={() => navigate("/forgot-password")}
            >
              Reset here
            </Link>
          </Text>

          {message && <p className="error-message">{message}</p>}

          {/* New User? Sign Up Link */}
          <Text className="signup-link">
            New user?{" "}
            <Link
              to="/signup"
              className="signup-link-text"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </Link>
          </Text>
        </Form>
      </motion.div>
      <ToastContainer />
    </section>
  );
};

export default Login;
