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
import { getBinnashtakavargaMercuryTable } from "../../api/BhinnashtakavargaTable";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { MercuryTableData } from "./BhinnashtakavargaTable";

const MercuryTable = ({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
}) => {
  const { user } = useContext(AppContext);
  const [
    bhinnashtakavargaMercuryTableData,
    setBhinnashtakavargaMercuryTableData,
  ] = useState(null);
  const [
    isLoadingBhinnashtakavargaMercuryTable,
    setIsLoadingBhinnashtakavargaMercuryTable,
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
  //   document.title = `Bhinnashtakavarga Mercury Table - ${userName}`;

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
    setIsLoadingBhinnashtakavargaMercuryTable(true);
    try {
      const cacheKey = `bhinnashtakavargaMercuryTableData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setBhinnashtakavargaMercuryTableData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingBhinnashtakavargaMercuryTable(false);
          return;
        } catch (err) {
          console.error(
            "Error parsing Bhinnashtakavarga Mercury Table data:",
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

      const response = await getBinnashtakavargaMercuryTable(
        userData.user._id,
        apiParams
      );

      if (response && response.success) {
        console.log("Bhinnashtakavarga Mercury Table API Response:", response);
        setBhinnashtakavargaMercuryTableData(response);
        localStorage.setItem(cacheKey, JSON.stringify(response));
        // toast.success("Bhinnashtakavarga Sun Table fetched successfully", {
        //   position: "top-right",
        //   autoClose: 1000,
        // });
        setCurrentLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to fetch Bhinnashtakavarga Mercury Table:", err);
      toast.error(
        "Failed to load Bhinnashtakavarga Mercury Table. Please try again."
      );
    } finally {
      setIsLoadingBhinnashtakavargaMercuryTable(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setIsLoadingBhinnashtakavargaMercuryTable(true);

    try {
      await fetchInsights(newLanguage, true);
      // Call parent's language change handler if provided
      if (onLanguageChange) {
        onLanguageChange();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingBhinnashtakavargaMercuryTable(false);
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
    <MercuryTableData
      bhinnashtakavargaMercuryTableData={bhinnashtakavargaMercuryTableData}
      isLoadingBhinnashtakavargaMercuryTable={
        isLoadingBhinnashtakavargaMercuryTable
      }
    />
  );
};

export default MercuryTable;
