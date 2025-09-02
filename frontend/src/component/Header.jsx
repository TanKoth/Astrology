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

  // Function to selectively clear localStorage while keeping specified keys
  const clearLocalStorageExcept = (keysToKeep) => {
    // Get all current localStorage data for keys we want to keep
    const dataToKeep = {};
    keysToKeep.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        dataToKeep[key] = value;
      }
    });

    // Also keep all user-specific astrology data
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (key.startsWith("astrologyData_")) {
        dataToKeep[key] = localStorage.getItem(key);
      }
    });

    // Clear localStorage
    localStorage.clear();

    // Restore the data we want to keep
    Object.keys(dataToKeep).forEach((key) => {
      localStorage.setItem(key, dataToKeep[key]);
    });
  };

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

  const saveCurrentUserAstrologyData = () => {
    if (user && user._id) {
      const currentAstrologyData = localStorage.getItem("astrologyData");
      if (currentAstrologyData) {
        localStorage.setItem(`astrologyData_${user._id}`, currentAstrologyData);
      }
    }
  };

  const loadUserAstrologyData = (userId) => {
    if (userId) {
      const userAstrologyData = localStorage.getItem(`astrologyData_${userId}`);
      if (userAstrologyData) {
        localStorage.setItem("astrologyData", userAstrologyData);
      } else {
        // Clear astrology data if no data exists for this user
        localStorage.removeItem("astrologyData");
        console.log(`No astrology data found for user ${userId}`);
      }
    }
  };

  // const clearCurrentAstrologyData = () => {
  //   localStorage.removeItem("astrologyData");
  // };

  const updatePreviousUsers = (currentUser) => {
    let prevUsers = JSON.parse(localStorage.getItem("previousUsers")) || [];
    // Remove if already exists
    prevUsers = prevUsers.filter((u) => u.email !== currentUser.email);
    // Add a clone to front
    prevUsers.unshift({ ...currentUser });
    // Keep only 5
    prevUsers = prevUsers.slice(0, 5);
    localStorage.setItem("previousUsers", JSON.stringify(prevUsers));
    setPreviousUsers(prevUsers);
  };

  const handleOpenPreviousUser = (selectedUser) => {
    if (selectedUser && selectedUser._id) {
      console.log(
        `Switching to user: ${selectedUser.name} (ID: ${selectedUser._id})`
      );

      // Save current user's astrology data before switching
      if (user && user._id) {
        saveCurrentUserAstrologyData();
        updatePreviousUsers(user);
      }

      // Clear localStorage but keep essential data including user-specific astrology data
      const keysToKeep = ["astrologyData", "user", "token", "previousUsers"];
      clearLocalStorageExcept(keysToKeep);

      // Switch to selected user
      localStorage.setItem("user", JSON.stringify(selectedUser));
      setUser(selectedUser);

      // Load the selected user's astrology data
      loadUserAstrologyData(selectedUser._id);

      toast.success(`Switched to user: ${selectedUser.name || "User"}`);
      navigate("/dashboard");

      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
    console.log("Creating new user");

    if (user && user._id) {
      // Save current user's astrology data before creating new user
      saveCurrentUserAstrologyData();
      updatePreviousUsers(user);
    }

    /// Clear localStorage but keep essential data
    const keysToKeep = ["token", "previousUsers"];
    clearLocalStorageExcept(keysToKeep);

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
