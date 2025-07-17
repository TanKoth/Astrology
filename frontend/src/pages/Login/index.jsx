import React from 'react';
import { useState, useContext } from 'react';
import {motion} from 'framer-motion';
import { FaUser, FaLock } from "react-icons/fa";
import {Form, Button, Input, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import './Login.css'; // Assuming you have a CSS file for styling 

const {Text} = Typography;



const Login =() => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onFinish = () => {}

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

          <Button
            
            htmlType="submit"
            className="submit-button"
            loading={loading}
          >
            Log In
          </Button>
          <Text className="signup-link">
            Forgot password?{" "}
            <a href="/forgot-password" className="signup-link-text">
              Reset here
            </a>
          </Text>

          {message && <p className="error-message">{message}</p>}

          {/* New User? Sign Up Link */}
          <Text className="signup-link">
            New user?{" "}
            <a href="/signup" className="signup-link-text">
              Sign up here
            </a>
          </Text>
        </Form>
      </motion.div>
    </section>
  )
}

export default Login;