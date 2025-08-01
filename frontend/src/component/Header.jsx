import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import "./Header.css";
//import Kundali_Logo from "../img/kundali_logo.png";
import Kundali_Logo from "../img/kundli2.png";
//import Kundali from "../img/kundli1.png";
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

  const handleLogoClick = () => {
    navigate("/");
  };

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
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <span>
            <img
              src={Kundali_Logo}
              alt="Logo"
              className="logo-image"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "5px",
                marginBottom: "5px",
                borderRadius: "20%",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "transparent",
              }}
            />
          </span>
          Vedic Vedang.AI
          {/* <span>
            <img
              src={Kundali}
              alt="Logo"
              className="logo-image"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
                backgroundColor: "transparent",
              }}
            />
          </span> */}
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
                icon={
                  <div className="nav-user">
                    <div className="user-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>
                }
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
