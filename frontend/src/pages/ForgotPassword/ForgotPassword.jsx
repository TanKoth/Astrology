import React, { useState, useEffect } from "react";
import { Form, Input, Typography } from "antd";
import { forgotPassword } from "../../api/UserLogin"; // adjust path if needed
import { useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";
import { toast, ToastContainer } from "react-toastify";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isFromDashboard = location.state?.fromDashboard;

  const onFinish = async (values) => {
    setLoading(true);
    setMessage("");
    console.log(values);
    try {
      let response;
      if (isFromDashboard) {
        response = await forgotPassword(values);
        if (response.success) {
          toast.success(
            "✅ OTP sent to " + values.email + ". Please check your email.",
            { position: "top-right", autoClose: 3000, color: "green" }
          );
          setTimeout(
            () =>
              navigate(`/reset-password/${encodeURIComponent(values.email)}`, {
                state: { fromDashboard: true },
              }),
            3000
          );
        } else {
          toast.error(response.message || "❌ Something went wrong.", {
            position: "top-right",
            autoClose: 3000,
            color: "red",
          });
          setMessage(response.message);
          console.log("Error sending OTP:", response.message);
        }
      } else {
        response = await forgotPassword(values);
        if (response.success) {
          setMessage(
            "✅ OTP sent to " + values.email + ". Please check your email."
          );
          setTimeout(
            () =>
              navigate(`/reset-password/${encodeURIComponent(values.email)}`),
            3000
          );
        } else {
          setMessage(response?.data?.message || "❌ Something went wrong.");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isFromDashboard && localStorage.getItem("token")) {
      navigate("/");
    }
  }, [isFromDashboard]);

  return (
    <div className="reset-container">
      <div className="reset-box">
        <Title className="reset-title">
          {isFromDashboard ? "Update Password" : "Forgot Password"}
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="reset-label">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email address." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input className="reset-input" placeholder="Enter your email" />
          </Form.Item>

          <button className="reset-button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </Form>

        {message && (
          <Text style={{ marginTop: 16, display: "block", color: "#fff" }}>
            {message}
          </Text>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
