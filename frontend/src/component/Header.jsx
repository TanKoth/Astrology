import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const profileMenu = (
    <Menu className="profile-dropdown">
      <Menu.Item key="user-details">
        <a href="/profile">User Details</a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a href="/subscription">Subscription</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <motion.header
      className={`header ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="header-content">
        <motion.h1
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          YugaTan_Astrology
        </motion.h1>

        {user && (
          <Dropdown
            overlay={profileMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <span>
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{
                  color: "#ffd700",
                  fontWeight: "bold",
                  marginLeft: "auto",
                  fontSize: "1.1rem",
                }}
              >
                {user.name || "Profile"}
              </Button>
            </span>
          </Dropdown>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
