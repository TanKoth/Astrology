import React, { useState, useEffect } from "react";
import { Form, Input, Typography } from "antd";
import { forgotPassword } from "../../api/UserLogin"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const onFinish = async (values) => {
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const res = await forgotPassword(values.email);
  //     setMessage(
  //       "✅ OTP sent to " + values.email + ". Please check your email."
  //     );
  //     setTimeout(() => navigate("/reset"), 3000);
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "❌ Something went wrong.");
  //   }

  //   setLoading(false);
  // };

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await forgotPassword(values);
      if (response.success) {
        setMessage(
          "✅ OTP sent to " + values.email + ". Please check your email."
        );
        // window.location.href = "/reset";
        // navigate(`/reset/${encodeURIComponent(values.email)}`);
        setTimeout(
          () => navigate(`/reset-password/${encodeURIComponent(values.email)}`),
          3000
        );
      } else {
        setMessage(response?.data?.message || "❌ Something went wrong.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong.");
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
        <Title className="reset-title">Forgot Password</Title>

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
    </div>
  );
};

export default ForgotPassword;
