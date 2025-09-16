import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Gem,
  Download,
  Sun,
} from "lucide-react";
import { LiaStarOfLifeSolid } from "react-icons/lia";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
//import "./ChartImage.css";
import "./Bhinnashtakavarga.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBinnashtakavargaSaturnTable } from "../../api/BhinnashtakavargaTable";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { SaturnTableData } from "./BhinnashtakavargaTable";

const SaturnTable = ({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
}) => {
  const { user } = useContext(AppContext);
  const [
    bhinnashtakavargaSaturnTableData,
    setBhinnashtakavargaSaturnTableData,
  ] = useState(null);
  const [
    isLoadingBhinnashtakavargaSaturnTable,
    setIsLoadingBhinnashtakavargaSaturnTable,
  ] = useState(false);
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState(
    propCurrentLanguage || "en"
  );

  // Update currentLanguage when prop changes
  useEffect(() => {
    if (propCurrentLanguage && propCurrentLanguage !== currentLanguage) {
      setCurrentLanguage(propCurrentLanguage);
      fetchInsights(propCurrentLanguage, true);
    }
  }, [propCurrentLanguage]);

  // const handlePrint = () => {
  //   const userName = user?.name || "User";
  //   document.title = `Bhinnashtakavarga Saturn Table - ${userName}`;

  //   setTimeout(() => {
  //     window.print();
  //   }, 100);
  // };

  useEffect(() => {
    if (user) {
      fetchInsights(currentLanguage);
    }
  }, [user]);

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingBhinnashtakavargaSaturnTable(true);
    try {
      const cacheKey = `bhinnashtakavargaSaturnTableData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setBhinnashtakavargaSaturnTableData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingBhinnashtakavargaSaturnTable(false);
          return;
        } catch (err) {
          console.error(
            "Error parsing Bhinnashtakavarga Saturn Table data:",
            err
          );
        }
      }

      const userData = await getUserDetails(user._id);

      if (!userData) {
        toast.error("No user data found. Please complete your profile.");
        return;
      }

      if (!userData.user.placeOfBirth) {
        toast.error("Birth place not found. Please update your profile.");
        return;
      }

      const locationData = await fetchLocationData(userData.user.placeOfBirth);

      if (
        !locationData ||
        typeof locationData.latitude === "undefined" ||
        typeof locationData.longitude === "undefined" ||
        typeof locationData.gmtOffset === "undefined"
      ) {
        console.error("Invalid location data structure:", locationData);
        toast.error("Could not fetch complete location data for birth place.");
        return;
      }

      const apiParams = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        gmtOffset: locationData.gmtOffset,
        lang: lang,
      };

      const response = await getBinnashtakavargaSaturnTable(
        userData.user._id,
        apiParams
      );

      if (response && response.success) {
        console.log("Bhinnashtakavarga Saturn Table API Response:", response);
        setBhinnashtakavargaSaturnTableData(response);
        localStorage.setItem(cacheKey, JSON.stringify(response));
        // toast.success("Bhinnashtakavarga Saturn Table fetched successfully", {
        //   position: "top-right",
        //   autoClose: 1000,
        // });
        setCurrentLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to fetch Bhinnashtakavarga Saturn Table:", err);
      toast.error(
        "Failed to load Bhinnashtakavarga Saturn Table. Please try again."
      );
    } finally {
      setIsLoadingBhinnashtakavargaSaturnTable(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setIsLoadingBhinnashtakavargaSaturnTable(true);

    try {
      await fetchInsights(newLanguage, true);
      // Call parent's language change handler if provided
      if (onLanguageChange) {
        onLanguageChange();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingBhinnashtakavargaSaturnTable(false);
    }
  };

  // const getLanguageDisplayName = () => {
  //   const languageNames = {
  //     en: "हिंदी",
  //     hi: "English",
  //   };
  //   return languageNames[currentLanguage] || "हिंदी";
  // };

  return (
    <SaturnTableData
      bhinnashtakavargaSaturnTableData={bhinnashtakavargaSaturnTableData}
      isLoadingBhinnashtakavargaSaturnTable={
        isLoadingBhinnashtakavargaSaturnTable
      }
    />
  );
};

export default SaturnTable;
