import { React, useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaMobileAlt } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { Form, Button, Input, message } from "antd";
import "./contactUs.css";
import { saveContactUsForm } from "../../api/ContactUs";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const DAILY_LIMIT = 2;
  const STORAGE_KEY = "contactUsSubmissions";

  useEffect(() => {
    checkDailySubmissionLimit();
  }, []);

  const checkDailySubmissionLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setSubmissionCount(count);
        if (count >= DAILY_LIMIT) {
          setIsLimitReached(true);
        }
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: today, count: 0 })
        );
        setSubmissionCount(0);
        setIsLimitReached(false);
      }
    } else {
      //first time submission
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: today, count: 0 })
      );
    }
  };

  const updateSubmissionCount = () => {
    const today = new Date().toDateString();
    const newCount = submissionCount + 1;
    console.log("New submission count: ", {
      today,
      newCount,
      currentCount: submissionCount,
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: newCount })
    );
    setSubmissionCount(newCount);

    if (newCount >= DAILY_LIMIT) {
      setIsLimitReached(true);
    }
  };

  const onFinish = async (values) => {
    if (isLimitReached) {
      form.resetFields();
      alert(
        "You have reached the daily submission limit. Please be patient, our team member will get back to you as soon as possible."
      );
      return;
    }
    setLoading(true);
    try {
      console.log("Form values: ", values);
      const response = await saveContactUsForm(values);
      console.log("Response from contactUs server :", response);

      if (response.success) {
        // Handle success (e.g., show a success message, reset the form, etc.)
        updateSubmissionCount();
        setLoading(false);
        alert(
          "Your message has been sent successfully. Our team will get back to you soon."
        );
        form.resetFields();
      } else {
        message.error("Failed to send your message. Please try again later.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error submitting the contactUs form : ", err);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h1
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ delay: 0.3 }}
          className="contact-title"
        >
          Contact Us
          {/* <p className="contact-subtitle">
            If you have any questions, feel free to reach out!
          </p> */}
        </h1>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="contact-form"
          form={form}
        >
          <Form.Item
            label={
              <span className="form-label">
                <FaUser className="form-icon" /> Name
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
                <FaEnvelope className="form-icon" /> Email
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
                <FaMobileAlt className="form-icon" /> Phone
              </span>
            }
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Your Phone Number" className="cosmic-input" />
          </Form.Item>
          <Form.Item
            label={
              <span className="form-label">
                <FaFilePen className="form-icon" /> Message
              </span>
            }
            name="message"
            rules={[
              {
                required: true,
                message: "Please enter your message!",
              },
              {
                max: 200,
                message: "Message cannot exceed 200 characters.",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Please write your message!"
              className="cosmic-textarea"
              rows={1}
              maxLength={200}
              style={{ overflow: "auto" }}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="contactUs-submit-button"
            loading={loading}
          >
            Submit
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default ContactUs;
