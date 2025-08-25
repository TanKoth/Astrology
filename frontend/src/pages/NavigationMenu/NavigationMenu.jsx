import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Star,
  MessageCircle,
  Crown,
  Settings,
  LogOut,
  Menu,
  X,
  Logs,
  Calendar,
  ChevronDown,
  ChevronRight,
  UserSearch,
  Search,
  View,
  Gem,
  Moon,
  Sun,
  ScrollText,
  CalendarDays,
  HeartHandshake,
  Diamond,
  NotepadText,
  ShipWheel,
  Orbit,
  Calculator,
} from "lucide-react";
import { FaRobot, FaBook, FaMars } from "react-icons/fa";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { LiaStarOfDavidSolid, LiaStarOfLifeSolid } from "react-icons/lia";
import {
  GiLouvrePyramid,
  GiStarSattelites,
  GiTripleBeak,
  GiSnake,
} from "react-icons/gi";
import { RiPlanetFill, RiAlipayLine } from "react-icons/ri";
import { useState } from "react";
import AppContext from "../../context/AppContext";
import "./NavigationMenu.css";
import Kundali_Logo from "../../img/kundali_logo.png";
//import Image from "../../img/kundli2.png";

const NavigationMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSubMenus, setExpandedSubMenus] = useState({});

  // Auto-expand parent menus when submenu items are active
  useEffect(() => {
    const currentPath = location.pathname;

    // Check which parent menu should be expanded based on active submenu
    navigationItems.forEach((item) => {
      if (item.hasSubMenu && item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (subItem) => subItem.path === currentPath
        );

        if (hasActiveSubItem) {
          setExpandedSubMenus((prev) => ({
            ...prev,
            [item.id]: true,
          }));
        }
      }
    });
  }, [location.pathname]);

  const navigationItems = [
    {
      id: "horoscope",
      path: "/dashboard",
      icon: Search,
      label: "Horoscope",
      hasSubMenu: true,
      subItems: [
        {
          path: "/charts",
          icon: Kundali_Logo,
          iconType: "image",
          label: "Charts",
        },
        {
          path: "/daily-horoscope",
          icon: LiaStarOfDavidSolid,
          label: "Daily Horoscope",
        },
        {
          path: "/weekly-horoscope ",
          icon: LiaStarOfDavidSolid,
          label: "Weekly Horoscope",
        },
        {
          path: "/monthly-horoscope",
          icon: LiaStarOfDavidSolid,
          label: "Monthly Horoscope",
        },
        {
          path: "/yearly-horoscope",
          icon: LiaStarOfDavidSolid,
          label: "Yearly Horoscope",
        },
      ],
    },
    {
      id: "panchang",
      path: "/panchang",
      icon: Calendar,
      label: "Panchang",
      hasSubMenu: true,
      subItems: [{ path: "/choghadiya", icon: Diamond, label: "Choghadiya" }],
    },
    {
      id: "reports",
      path: "",
      icon: NotepadText, //gemstone-report
      label: "Reports",
      hasSubMenu: true,
      subItems: [
        {
          path: "/gemstones",
          icon: Gem,
          label: "Gemstone Report",
        },
        {
          path: "/rudraksh-report",
          icon: ShipWheel,
          label: "Rudraksh Report",
        },
      ],
    },
    {
      id: "sade-sati",
      path: "/sade-sati",
      icon: RiPlanetFill,
      label: "Sade Sati Report",
    },
    {
      id: "prediction",
      path: "",
      icon: View,
      label: "Prediction",
      hasSubMenu: true,
      subItems: [
        {
          path: "/rasi-prediction",
          icon: RiAlipayLine,
          label: "Rasi Prediction",
        },
        { path: "/moon-prediction", icon: Moon, label: "Moon Prediction" },
        {
          path: "/nakshatra-prediction",
          icon: GiStarSattelites,
          label: "Nakshatra Prediction",
        },
        {
          path: "/panchang-prediction",
          icon: ScrollText,
          label: "Panchang Prediction",
        },
      ],
    },

    {
      id: "matching",
      path: "/matching",
      icon: HeartHandshake,
      label: "Matching",
      hasSubMenu: true,
      subItems: [
        {
          path: "/nakshatra-matching",
          icon: FaHeartCircleBolt,
          label: "Nakshatra Matching",
        },
      ],
    },
    { id: "dasha", path: "/dasha", icon: LiaStarOfLifeSolid, label: "Dasha" },
    {
      id: "planetkp",
      path: "/planet-kp",
      icon: Orbit,
      label: "Planet KP",
    },
    {
      id: "dosh",
      path: "",
      icon: GiLouvrePyramid,
      label: "Dosh",
      hasSubMenu: true,
      subItems: [
        {
          path: "/pitra-dosh",
          icon: GiTripleBeak,
          label: "Pitra Dosh",
        },
        {
          path: "/kalsarp-dosh",
          icon: GiSnake,
          label: "Kalsarp Dosh",
        },
        {
          path: "/mangal-dosh",
          icon: FaMars,
          label: "Mangal Dosh",
        },
      ],
    },
    {
      id: "calculator",
      path: "",
      icon: Calculator,
      label: "Calculator",
      hasSubMenu: true,
      subItems: [
        {
          path: "/moon-sign",
          icon: Moon,
          label: "Moon Sign",
        },
        {
          path: "/sun-sign",
          icon: Sun,
          label: "Sun Sign",
        },
        {
          path: "/rasi-sign",
          icon: RiAlipayLine,
          label: "Rasi Sign",
        },
      ],
    },
    {
      id: "lalkitab",
      path: "/lalkitab",
      icon: FaBook,
      label: "Lalkitab Remedies",
    },
    {
      id: "ai-chat",
      path: "/dashboard?section=chat-section",
      icon: FaRobot,
      label: "AI Chat",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);

    //scroll to chat section if navigating to chat
    if (path.includes("section=chat-section")) {
      setTimeout(() => {
        const chatSection = document.getElementById("chat-section");
        if (chatSection) {
          chatSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubMenu = (id) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Navigation Sidebar */}
      <nav
        className={`navigation ${isMobileMenuOpen ? "mobile-open" : ""} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Logo Header */}
        <div className="nav-header">
          {/* <div
            className="nav-brand"
            onClick={() => handleNavigation("/dashboard")}
          >
            <img src={Image} alt="Vedic Vedang.AI" className="nav-logo" />
            {!isCollapsed && (
              <span className="nav-brand-text">Vedic Vedang.AI</span>
            )} 
          </div>*/}
          {/* Desktop Collapse Toggle */}
          <button
            className="collapse-toggle desktop-only"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <img
                src={Kundali_Logo}
                alt="Expand"
                style={{ width: "2rem", height: "2rem" }}
              />
            ) : (
              <img
                src={Kundali_Logo}
                alt="Collapse"
                style={{ width: "2rem", height: "2rem" }}
              />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const hasSubMenu = item.hasSubMenu && item.subItems;
            const isExpanded = expandedSubMenus[item.id];

            // Check if any submenu item is active
            const hasActiveSubItem =
              hasSubMenu &&
              item.subItems.some(
                (subItem) => location.pathname === subItem.path
              );

            return (
              <div key={item.id} className="nav-item-container">
                <button
                  className={`nav-item ${isActive ? "active" : ""}${
                    hasSubMenu ? "has-submenu" : ""
                  }`}
                  onClick={() => {
                    if (hasSubMenu) {
                      handleNavigation(item.path);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  title={isCollapsed ? item.label : ""}
                >
                  {/* Render image or lucide icon based on iconType */}
                  {item.iconType === "image" ? (
                    <img
                      src={Icon}
                      alt={item.label}
                      className="nav-icon nav-image"
                    />
                  ) : (
                    <Icon className="nav-icon" />
                  )}
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {hasSubMenu && (
                        <span
                          className="submenu-arrow"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubMenu(item.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu Items */}
                {hasSubMenu && isExpanded && !isCollapsed && (
                  <div className="submenu">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location.pathname === subItem.path;

                      return (
                        <button
                          key={subItem.path}
                          className={`nav-item submenu-item ${
                            isSubActive ? "active" : ""
                          }`}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          {subItem.iconType === "image" ? (
                            <img
                              src={SubIcon}
                              alt={subItem.label}
                              className="nav-icon nav-image"
                            />
                          ) : (
                            <SubIcon className="nav-icon" />
                          )}
                          <span className="nav-label">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="nav-footer">
          <button
            className="nav-item logout"
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="nav-icon" />
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default NavigationMenu;
