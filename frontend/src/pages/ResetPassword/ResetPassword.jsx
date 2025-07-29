import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { resetPassword } from "../../api/UserLogin";
import "./ResetPassword.css";

const { Title, Text } = Typography;

const ResetPassword = () => {
  //const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { email } = useParams(); // Extract email from URL parameters
  console.log("email", email);

  //const token = searchParams.get("token");

  // const onFinish = async (values) => {
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     await resetPassword(token, values.password);
  //     setMessage("✅ Password reset successful! Redirecting to login...");
  //     setTimeout(() => navigate("/login"), 2000);
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "❌ Error resetting password.");
  //   }

  //   setLoading(false);
  // };

  const onFinish = async (values) => {
    try {
      const response = await resetPassword(values, email);
      if (response.success) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        // window.location.href = "/login";
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(response.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error resetting password.");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h1 className="reset-title">Reset Password</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="reset-label">OTP</span>}
            name="otp"
            rules={[{ required: true, message: "Please enter your OTP!" }]}
          >
            <Input className="reset-input" placeholder="Enter OTP" />
          </Form.Item>
          <Form.Item
            label={<span className="reset-label">New Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 6, message: "Minimum 6 characters required." },
            ]}
          >
            <Input.Password
              className="reset-input"
              placeholder="Enter new password"
            />
          </Form.Item>

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </Form>

        {message && (
          <Text style={{ marginTop: 16, display: "block", color: "#fff" }}>
            {message}
          </Text>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
