import React, { useContext, useEffect, useState } from "react";
import { color, hover, motion } from "framer-motion";
import { Menu, Dropdown, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../context/AppContext";
import "./Header.css";
import Kundali_Logo from "../img/kundli2.png";
import { toast, ToastContainer } from "react-toastify";
import {
  KeyRound,
  Pencil,
  Crown,
  LogOut,
  UserRoundPlus,
  FolderOpen,
  Menu as MenuIcon,
  X,
} from "lucide-react";

// const Header = ({ onToggleNav, isNavOpen }) => {
const Header = () => {
  const { user, setUser } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [previousUsers, setPreviousUsers] = useState([]);
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
    const prev = localStorage.getItem("previousUsers");
    if (prev) {
      setPreviousUsers(JSON.parse(prev));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const handleUpdatePassword = () => {
    if (user && user.email) {
      navigate(`/forgot-password`, {
        state: { fromDashboard: true },
      });
    }
  };

  const updatePreviousUsers = (currentUser) => {
    let prevUsers = JSON.parse(localStorage.getItem("previousUsers")) || [];
    // Remove if already exists
    prevUsers = prevUsers.filter((u) => u.email !== currentUser.email);
    // Add to front
    prevUsers.unshift(currentUser);
    // Keep only 5
    prevUsers = prevUsers.slice(0, 5);
    localStorage.setItem("previousUsers", JSON.stringify(prevUsers));
    setPreviousUsers(prevUsers);
  };

  const handleOpenPreviousUser = (selectedUser) => {
    if (selectedUser) {
      if (user) {
        updatePreviousUsers(user);
      }
      localStorage.setItem("user", JSON.stringify(selectedUser));
      setUser(selectedUser);
      toast.success(`Switched to user: ${selectedUser.name || "User"}`);
      navigate("/dashboard");
    }
  };

  // const handleSwitchToCurrentUser = () => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //     setUser(user);
  //     message.success(`Switched to user: ${user.name || "User"}`);
  //     navigate("/dashboard");
  //   }
  // };

  const handleNewUser = () => {
    if (user) {
      updatePreviousUsers(user);
    }
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signUp");
  };

  const profileMenu = (
    <Menu className="profile-dropdown">
      <Menu.Item key="new-user" onClick={handleNewUser}>
        <UserRoundPlus size={16} className="plus-icon" />
        Add New User
      </Menu.Item>
      {/* Show both users if previousUser exists */}
      {previousUsers.length > 0 && (
        <Menu.SubMenu
          key="switch-user"
          title={
            <span className="switch-user-title">
              <FolderOpen size={17} />
              <span style={{ marginLeft: "5px" }}>Switch User</span>
            </span>
          }
        >
          {previousUsers.map((prevUser, idx) => (
            <Menu.Item
              key={`previous-user-${idx}`}
              onClick={() => handleOpenPreviousUser(prevUser)}
            >
              <span>
                <Button
                  type="text"
                  icon={
                    <div className="nav-user">
                      <div className="user-avatar">
                        {prevUser?.name?.charAt(0)?.toUpperCase() || "U"}
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
                  {prevUser?.name || "Previous User"}
                </Button>
              </span>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      )}
      <Menu.Item key="user-details">
        <Link to="/editUserDetails">
          <Pencil size={16} className="pencil-icon" />
          Edit User Details
        </Link>
      </Menu.Item>
      <Menu.Item key="update-password" onClick={handleUpdatePassword}>
        <span>
          <KeyRound size={16} className="key-icon" />
          Update Password
        </span>
      </Menu.Item>
      <Menu.Item key="subscription">
        <Crown size={16} className="subscription-icon" />
        <Link to="/subscription">Subscription</Link>
      </Menu.Item>

      <Menu.Item key="logout" onClick={handleLogout}>
        <LogOut size={16} className="logout-icon" />
        <Link to="/">Logout</Link>
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
        {/* Navigation Toggle Button */}
        {/* <motion.button
          className="nav-toggle-btn"
          onClick={onToggleNav}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isNavOpen ? "Close Navigation" : "Open Navigation"}
        >
          {isNavOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </motion.button> */}
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
                {user.name || "User"}
              </Button>
            </span>
          </Dropdown>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
