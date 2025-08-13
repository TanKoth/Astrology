import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, time } from "framer-motion";
import { Button, Table } from "antd";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lock,
  MessageCircle,
  Crown,
  Send,
  Sparkles,
  Navigation,
  Printer,
  Languages,
} from "lucide-react";
import { RiPlanetFill } from "react-icons/ri";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { getsadeSatiReport } from "../../api/SadeSati";
import { getUserDetails } from "../../api/user";
import "./SadeSati.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSadeSatiDetails } from "./SadiSatiDetails";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";

const TypingIndicator = () => (
  <div className="message ai">
    <div className="typing-indicator">
      <Sparkles className="crystal-ball" />
      <span className="typing-indicator-text">
        Vedic Vedang.AI is consulting the stars
      </span>
      <div className="typing-indicator-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  </div>
);

const SadeSati = () => {
  const { user } = useContext(AppContext);
  //const { t, toggleLanguage, language } = useTranslation();
  const [sadesatiData, setSadesatiData] = useState(null);
  const [sadeSatiDetails, setSadeSatiDetails] = useState(null);
  const [isLoadingSadesati, setIsLoadingSadesati] = useState(false);
  const [isSadesatiOpen, setIsSadesatiOpen] = useState(true);
  const navigate = useNavigate(); // Initialize navigation
  const [loadingSadesatiDetails, setLoadingSadesatiDetails] = useState(false);

  //Table for sadeSatiDetails
  const sadeSatiDetailsColumns = [
    {
      title: "S.No.",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Saturn Sign",
      dataIndex: "saturnSign",
      key: "saturnSign",
      width: "10%",
    },
    {
      title: "Phase",
      dataIndex: "phase",
      key: "phase",
      width: "10%",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      width: "10%",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
  ];

  const formatSadeSatiDetailsTable = (sadeSatiDetails) => {
    if (
      !sadeSatiDetails ||
      !sadeSatiDetails.data ||
      !sadeSatiDetails.data.data ||
      !sadeSatiDetails.data.data.transits
    ) {
      return [];
    }
    const response = sadeSatiDetails.data.data.transits;
    return response.map((item, index) => ({
      key: index, // Add key for React table
      saturnSign: item?.saturn_sign || "N/A",
      phase: item?.phase || "N/A",
      startTime: formateDate(item?.start),
      endTime: formateDate(item?.end),
      description: item?.description || "N/A",
    }));
  };

  const handlePrint = () => {
    const userName = user?.name || "User";
    document.title = `Sade Sati Report - ${userName}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSadeSatiButtonClick = async () => {
    handleSadeSatiDetails(
      user,
      setSadeSatiDetails,
      setIsLoadingSadesati,
      setLoadingSadesatiDetails
    );
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    setIsLoadingSadesati(true);
    try {
      const storedData = localStorage.getItem("sadeSatiReport");
      if (storedData) {
        setSadesatiData(JSON.parse(storedData));
        setIsLoadingSadesati(false);
      } else {
        const userData = await getUserDetails(user._id);
        if (!userData) {
          toast.error("No user data found. Please complete your profile.");
          setIsLoadingSadesati(false);
          return;
        }
        if (!userData.user.placeOfBirth) {
          toast.error("Birth place not found. Please update your profile.");
          setIsLoadingSadesati(false);
          return;
        }
        const locationData = await fetchLocationData(
          userData.user.placeOfBirth
        );
        //console.log("Fetched location data:", locationData);

        if (
          !locationData ||
          typeof locationData.latitude === "undefined" ||
          typeof locationData.longitude === "undefined" ||
          typeof locationData.gmtOffset === "undefined"
        ) {
          console.error("Invalid location data structure:", locationData);
          toast.error(
            "Could not fetch complete location data for birth place. Please check your birth place format."
          );
          setIsLoadingNakshatraPrediction(false);
          return;
        }

        const apiParams = {
          dob: formateDate(userData.user.dob), // Format: YYYY/MM/DD
          timeOfBirth: userData.user.timeOfBirth, // Format: HH:MM
          //birthPlace: userData.placeofBirth,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          gmtOffset: locationData.gmtOffset,
        };
        //console.log("API Parameters:", apiParams);
        const sadesatiResponse = await getsadeSatiReport(user._id, apiParams);
        if (sadesatiResponse && sadesatiResponse.success) {
          setSadesatiData(sadesatiResponse);
          localStorage.setItem(
            "sadeSatiReport",
            JSON.stringify(sadesatiResponse)
          );
          toast.success("Fetching Sade Sati Report........", {
            position: "top-right",
            autoClose: 2000,
          });
          setIsLoadingSadesati(false);
        }
      }
    } catch (error) {
      console.error("Error fetching Sade Sati Report:", error);
      toast.error("Failed to fetch Sade Sati Report. Please try again later.", {
        position: "top-right",
      });
      setIsLoadingSadesati(false);
    } finally {
      setIsLoadingSadesati(false);
    }
  };

  if (isLoadingSadesati) {
    return (
      <div className="dashboard-layout">
        <NavigationMenu />
        <div className="dashboard-content">
          <div className="dashboard-page">
            <div className="loading-container">
              <Star className="loading-icon" />
              <p>Loading Sade Sati Report........ </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <NavigationMenu />
      <div className="dashboard-content">
        <div className="dashboard-page">
          <div className="stars" />
          <div className="dashboard-container">
            <div className="welcome-section">
              <motion.h1 className="welcome-title">{"Sade Sati"}</motion.h1>
              {sadesatiData && isLoadingSadesati && (
                <div className="action-buttons">
                  {/* <button
                  className="translate-button"
                  onClick={toggleLanguage}
                  title="Translate"
                >
                  <Languages className="icon" />
                  {language === "en"
                    ? "हिंदी"
                    : language === "hi"
                    ? "मराठी"
                    : "English"}
                </button> */}
                  <button
                    className="print-button"
                    onClick={handlePrint}
                    title="Print Dashboard"
                  >
                    <Printer className="icon" />
                    Print
                  </button>
                </div>
              )}
            </div>
            {!sadesatiData && !isLoadingSadesati && (
              <motion.div className="no-data-section">
                <div className="no-data-message">
                  <Star className="icon" />
                  <h3>{"No charts available"}</h3>
                  <p>
                    {
                      "Please complete your profile to generate Sade Sati Report."
                    }
                  </p>
                  <button
                    className="generate-button"
                    onClick={() => navigate("/editUserDetails")}
                  >
                    {"Please complete your profile"}
                  </button>
                </div>
              </motion.div>
            )}

            {sadesatiData && (
              <motion.div className="sadesati-section">
                <div
                  className="sadesati-header"
                  onClick={() => setIsSadesatiOpen(!isSadesatiOpen)}
                >
                  <h2 className="sadesati-title">
                    <Star className="icon" /> {"Sade Sati Report"}
                  </h2>
                  {isSadesatiOpen ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </div>

                <AnimatePresence>
                  {isSadesatiOpen && (
                    <motion.div className="sadesati-content">
                      <div className="sadesati-details-grid">
                        <div className="sadesati-detail">
                          <span className="sadesati-label">{"Date"}:</span>
                          <span className="sadesati-value">
                            {sadesatiData?.sadeSatiInsights?.response
                              ?.date_considered || "N/A"}
                          </span>
                        </div>
                        <div className="sadesati-detail">
                          <span className="sadesati-label">{"Age"}:</span>
                          <span className="sadesati-value">
                            {sadesatiData?.sadeSatiInsights?.response?.age ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="sadesati-details-grid">
                        <div className="sadesati-detail">
                          <span className="sadesati-label">
                            {"Are you in Sade Sati"}:
                          </span>
                          <span className="sadesati-value">
                            {sadesatiData?.sadeSatiInsights?.response
                              ?.is_sade_sati_period !== undefined
                              ? sadesatiData.sadeSatiInsights.response
                                  .is_sade_sati_period
                                ? "Yes"
                                : "No"
                              : "N/A"}
                          </span>
                        </div>
                        <div className="sadesati-detail">
                          <span className="sadesati-label">
                            {"Saturn Retrograde"}:
                          </span>
                          <span className="sadesati-value">
                            {sadesatiData?.sadeSatiInsights?.response
                              ?.saturn_retrograde !== undefined
                              ? sadesatiData.sadeSatiInsights.response
                                  .saturn_retrograde
                                ? "Yes"
                                : "No"
                              : "N/A"}
                          </span>
                        </div>
                        {sadesatiData?.sadeSatiInsights?.response
                          ?.is_sade_sati_period && (
                          <div className="sadesati-detail">
                            <span className="sadesati-label">
                              {"Shani Period Type"}:
                            </span>
                            <span className="sadesati-value">
                              {sadesatiData?.sadeSatiInsights?.response
                                ?.shani_period_type || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="sadesati-detail">
                        <span className="sadesati-label">{"Insight"}:</span>
                        <span className="sadesati-value">
                          {sadesatiData?.sadeSatiInsights?.response
                            ?.bot_response || "N/A"}
                        </span>
                      </div>
                      {sadesatiData.sadeSatiInsights.response
                        .is_sade_sati_period && (
                        <>
                          <div className="sadesati-detail">
                            <span className="sadesati-label">
                              {"Description"}:
                            </span>
                            <span className="sadesati-value">
                              {sadesatiData?.sadeSatiInsights?.response
                                ?.description || "N/A"}
                            </span>
                          </div>
                          <div className="sadesati-detail">
                            <span className="sadesati-label">
                              {"Remedies"}:
                            </span>
                            <span className="sadesati-value">
                              {sadesatiData?.sadeSatiInsights?.response?.remedies.map(
                                (remedy, index) => {
                                  return <li key={index}>{remedy}</li>;
                                }
                              ) || "N/A"}
                            </span>
                          </div>
                        </>
                      )}
                      {!sadeSatiDetails && (
                        <Button
                          className="sadeSatiDetails-button"
                          onClick={handleSadeSatiButtonClick}
                          title="Get SadeSati Details"
                          loading={loadingSadesatiDetails}
                        >
                          Get SadeSati Details
                        </Button>
                      )}
                      {sadeSatiDetails && (
                        <motion.div
                          className="sadesati-details-table"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="table-title">
                            <RiPlanetFill className="icon" /> Detailed Sade Sati
                            Analysis
                          </h3>
                          <Table
                            columns={sadeSatiDetailsColumns}
                            dataSource={formatSadeSatiDetailsTable(
                              sadeSatiDetails
                            )}
                            pagination={false}
                            bordered
                            size="middle"
                            className="sadesati-table"
                            scroll={{ x: 800 }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SadeSati;
