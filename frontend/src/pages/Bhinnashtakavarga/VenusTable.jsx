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
import { getBinnashtakavargaVenusTable } from "../../api/BhinnashtakavargaTable";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { VenusTableData } from "./BhinnashtakavargaTable";

const VenusTable = ({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
}) => {
  const { user } = useContext(AppContext);
  const [bhinnashtakavargaVenusTableData, setBhinnashtakavargaVenusTableData] =
    useState(null);
  const [
    isLoadingBhinnashtakavargaVenusTable,
    setIsLoadingBhinnashtakavargaVenusTable,
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
  //   document.title = `Bhinnashtakavarga Venus Table - ${userName}`;

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
    setIsLoadingBhinnashtakavargaVenusTable(true);
    try {
      const cacheKey = `bhinnashtakavargaVenusTableData_${lang}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setBhinnashtakavargaVenusTableData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingBhinnashtakavargaVenusTable(false);
          return;
        } catch (err) {
          console.error(
            "Error parsing Bhinnashtakavarga Venus Table data:",
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

      const response = await getBinnashtakavargaVenusTable(
        userData.user._id,
        apiParams
      );

      if (response && response.success) {
        console.log("Bhinnashtakavarga Venus Table API Response:", response);
        setBhinnashtakavargaVenusTableData(response);
        localStorage.setItem(cacheKey, JSON.stringify(response));
        // toast.success("Bhinnashtakavarga Venus Table fetched successfully", {
        //   position: "top-right",
        //   autoClose: 1000,
        // });
        setCurrentLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to fetch Bhinnashtakavarga Venus Table:", err);
      toast.error(
        "Failed to load Bhinnashtakavarga Venus Table. Please try again."
      );
    } finally {
      setIsLoadingBhinnashtakavargaVenusTable(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setIsLoadingBhinnashtakavargaVenusTable(true);

    try {
      await fetchInsights(newLanguage, true);
      // Call parent's language change handler if provided
      if (onLanguageChange) {
        onLanguageChange();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingBhinnashtakavargaVenusTable(false);
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
    <VenusTableData
      bhinnashtakavargaVenusTableData={bhinnashtakavargaVenusTableData}
      isLoadingBhinnashtakavargaVenusTable={
        isLoadingBhinnashtakavargaVenusTable
      }
    />
  );
};

export default VenusTable;
