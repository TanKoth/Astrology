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
} from "lucide-react";
import { LiaStarOfLifeSolid } from "react-icons/lia";
import AppContext from "../../context/AppContext";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
//import "./ChartImage.css";
import "./Charts.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getD1Chart } from "../../api/Charts";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { SVGRenderer } from "../../utilityFunction/SvgFileConvertor";

const D1 = ({ currentLanguage: propCurrentLanguage, onLanguageChange }) => {
  const { user } = useContext(AppContext);
  const [d1Data, setD1Data] = useState(null);
  const [isLoadingD1, setIsLoadingD1] = useState(false);
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
  //   document.title = `D1 Chart - ${userName}`;

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
    setIsLoadingD1(true);
    try {
      const cacheKey = `d1Data_${lang}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setD1Data(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingD1(false);
          return;
        } catch (err) {
          console.error("Error parsing D1 data:", err);
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

      const response = await getD1Chart(userData.user._id, apiParams);

      if (response && response.success) {
        //console.log("D1 API Response:", response);
        setD1Data(response);
        localStorage.setItem(cacheKey, JSON.stringify(response));
        // toast.success("D1 chart fetched successfully", {
        //   position: "top-right",
        //   autoClose: 1000,
        // });
        setCurrentLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to fetch D1 chart:", err);
      toast.error("Failed to load D1 chart. Please try again.");
    } finally {
      setIsLoadingD1(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setIsLoadingD1(true);

    try {
      await fetchInsights(newLanguage, true);
      // Call parent's language change handler if provided
      if (onLanguageChange) {
        onLanguageChange();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingD1(false);
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
    <div className="chart-item">
      <h4 className="chart-title">Lagna Chart</h4>
      <div>
        {d1Data?.charts && (
          <SVGRenderer svgString={d1Data?.charts} className="chart-image" />
        )}
      </div>
    </div>
  );
};

export default D1;
