import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { resetPassword } from "../../api/UserLogin";
import { toast, ToastContainer } from "react-toastify";
import "./ResetPassword.css";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { email } = useParams(); // Extract email from URL parameters
  const location = useLocation();
  const [form] = Form.useForm();

  const isFromDashboard =
    window.location.pathname.includes("/dashboard") ||
    location.state?.fromDashboard;

  const validateNewPassword = (_, value) => {
    const currentPassword = form.getFieldValue("currentPassword");

    if (
      isFromDashboard &&
      value &&
      currentPassword &&
      value === currentPassword
    ) {
      return Promise.reject(
        new Error("New password cannot be the same as current password!")
      );
    }
    return Promise.resolve();
  };

  //const token = searchParams.get("token");

  const onFinish = async (values) => {
    setLoading(true);
    setMessage("");

    // Additional check before API call
    if (isFromDashboard && values.password === values.currentPassword) {
      toast.error("New password cannot be the same as current password!", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      let response;
      if (isFromDashboard) {
        response = await resetPassword(
          {
            ...values,
            currentPassword: values.currentPassword,
          },
          email
        );
        if (response && response.success) {
          toast.success(
            "✅ Password updated successfully! Redirecting to dashboard...",
            { position: "top-right", autoClose: 2000, color: "green" }
          );
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast.error(response.message || "❌ Error updating password.", {
            position: "top-right",
            autoClose: 2000,
            color: "red",
          });
          setMessage(response.message);
          console.log("Error updating password:", response.message);
        }
      } else {
        response = await resetPassword(values, email);
        if (response.success) {
          setMessage("✅ Password reset successful! Redirecting to login...");
          // window.location.href = "/login";
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setMessage(response.message);
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error resetting password.");
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
        <h1 className="reset-title">
          {isFromDashboard ? "Update Password" : "Reset Password"}
        </h1>

        <Form layout="vertical" onFinish={onFinish} form={form}>
          {isFromDashboard && (
            <Form.Item
              label={<span className="reset-label">Current Password</span>}
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
              ]}
            >
              <Input.Password
                className="reset-input"
                placeholder="Enter current password"
              />
            </Form.Item>
          )}

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
              { validator: validateNewPassword },
            ]}
          >
            <Input.Password
              className="reset-input"
              placeholder="Enter new password"
            />
          </Form.Item>

          {!isFromDashboard && (
            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          )}
          {isFromDashboard && (
            <>
              <Form.Item>
                <Text type="secondary" style={{ color: "#fff" }}>
                  Note: New password cannot be the same as current password.
                </Text>
              </Form.Item>

              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}
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

export default ResetPassword;
