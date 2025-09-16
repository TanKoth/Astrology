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
import "../../pages/Charts/Charts.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBhinnashtakavargaSunCharts } from "../../api/BhinnashtakavargaCharts";
import { getD1Chart } from "../../api/Charts";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { SVGRenderer } from "../../utilityFunction/SvgFileConvertor";

const SunChart = ({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
}) => {
  const { user } = useContext(AppContext);
  const [sunChartData, setSunChartData] = useState(null);
  const [d1ChartData, setD1ChartData] = useState(null);
  const [isLoadingSun, setIsLoadingSun] = useState(false);
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

  useEffect(() => {
    if (user) {
      // Clear previous user's data when user changes
      setSunChartData(null);
      setD1ChartData(null);
      fetchInsights(currentLanguage, true); // Force refresh for new user
    }
  }, [user._id]);

  // Add function to fetch D1 chart
  const fetchD1Chart = async (apiParams) => {
    try {
      const d1Response = await getD1Chart(user._id, apiParams);
      if (d1Response && d1Response.success) {
        setD1ChartData(d1Response);
        return d1Response;
      }
    } catch (error) {
      console.error("Failed to fetch D1 chart:", error);
    }
    return null;
  };

  const fetchInsights = async (lang = "en", forceRefresh = false) => {
    setIsLoadingSun(true);
    try {
      // Make cache keys user-specific
      const cacheKey = `sunChartData_${user._id}_${lang}`;
      const d1CacheKey = `d1ChartData_${user._id}`;

      // Always clear cache when switching users or force refresh
      if (forceRefresh) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(d1CacheKey);
        // Clear D1 chart data to force fresh fetch
        setD1ChartData(null);
      }

      if (!forceRefresh) {
        const storedSunData = localStorage.getItem(cacheKey);
        const storedD1Data = localStorage.getItem(d1CacheKey);

        if (storedSunData && storedD1Data) {
          try {
            const parsedSunData = JSON.parse(storedSunData);
            const parsedD1Data = JSON.parse(storedD1Data);
            setSunChartData(parsedSunData);
            setD1ChartData(parsedD1Data);
            setCurrentLanguage(lang);
            setIsLoadingSun(false);
            return;
          } catch (err) {
            console.error("Error parsing cached data:", err);
            // Clear corrupted cache
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(d1CacheKey);
          }
        }
      }

      const userData = await getUserDetails(user._id);

      if (!userData) {
        toast.error("No user data found. Please complete your profile.");
        setIsLoadingSun(false);
        return;
      }

      if (!userData.user.placeOfBirth) {
        toast.error("Birth place not found. Please update your profile.");
        setIsLoadingSun(false);
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
        toast.error(
          "Could not fetch complete location data for birth place. Please check your birth place format."
        );
        setIsLoadingSun(false);
        return;
      }

      const apiParams = {
        dob: formateDate(userData.user.dob),
        timeOfBirth: userData.user.timeOfBirth,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        gmtOffset: locationData.gmtOffset,
      };

      console.log(
        `Fetching charts for user ${user._id} with params:`,
        apiParams
      );

      // Fetch both Sun chart and D1 chart
      const [sunResponse, d1Response] = await Promise.all([
        getBhinnashtakavargaSunCharts(userData.user._id, apiParams),
        fetchD1Chart(apiParams),
      ]);

      if (sunResponse && sunResponse.success) {
        console.log("Sun API Response for user", user._id, ":", sunResponse);
        setSunChartData(sunResponse);
        localStorage.setItem(cacheKey, JSON.stringify(sunResponse));
        setCurrentLanguage(lang);
      }

      if (d1Response && d1Response.success) {
        console.log("D1 API Response for user", user._id, ":", d1Response);
        setD1ChartData(d1Response);
        localStorage.setItem(d1CacheKey, JSON.stringify(d1Response));
      }
    } catch (err) {
      console.error("Failed to fetch Sun chart:", err);
      toast.error("Failed to load Sun chart. Please try again.");
    } finally {
      setIsLoadingSun(false);
    }
  };

  const addHouseNumbersToSVG = (svgString, d1Data) => {
    if (!svgString || !d1Data) {
      console.log("Missing data for house number rotation:", {
        svgString: !!svgString,
        d1Data: !!d1Data,
      });
      return svgString;
    }

    // Enhanced function to determine house from coordinates
    const determineHouseFromCoordinates = (x, y, d1SvgString) => {
      // Extract house number positions dynamically from the D1 chart SVG
      const extractHousePositions = (svgString) => {
        const housePositions = {};

        // Pattern to find house number text elements
        // This matches: <text x="159" y="181" style="font-family:Arial;font-size:11px;fill:#000000">1</text>
        const housePattern =
          /<text x="([^"]*)" y="([^"]*)"[^>]*style="font-family:Arial;font-size:11px[^>]*>(\d{1,2})<\/text>/g;

        let match;
        while ((match = housePattern.exec(svgString)) !== null) {
          const houseX = parseFloat(match[1]);
          const houseY = parseFloat(match[2]);
          const houseNumber = parseInt(match[3]);

          if (houseNumber >= 1 && houseNumber <= 12) {
            housePositions[houseNumber] = { x: houseX, y: houseY };
          }
        }

        console.log(
          `Extracted house positions for user ${user._id}:`,
          housePositions
        );
        return housePositions;
      };

      // Get dynamic house positions from the actual D1 chart
      const housePositions = extractHousePositions(d1SvgString);

      // If we couldn't extract house positions, fall back to a reasonable default
      if (Object.keys(housePositions).length === 0) {
        console.warn(
          `Could not extract house positions for user ${user._id}, using fallback`
        );
        return 1;
      }

      // Find the closest house to the Sun's coordinates
      let closestHouse = 1;
      let minDistance = Infinity;
      const tolerance = 50; // Increased tolerance for safety

      for (const [houseNum, position] of Object.entries(housePositions)) {
        const distance = Math.sqrt(
          Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
        );

        if (distance < tolerance && distance < minDistance) {
          minDistance = distance;
          closestHouse = parseInt(houseNum);
        }
      }

      // If no house matched within tolerance, find the absolute closest
      if (minDistance === Infinity) {
        minDistance = Infinity;
        for (const [houseNum, position] of Object.entries(housePositions)) {
          const distance = Math.sqrt(
            Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestHouse = parseInt(houseNum);
          }
        }
      }

      console.log(
        `Su is in house ${closestHouse} for user ${
          user._id
        } (distance: ${minDistance.toFixed(2)})`
      );
      return closestHouse;
    };

    // Function to find Sun's house in D1 chart
    const findSunHouseInD1 = (d1ChartData) => {
      if (!d1ChartData || !d1ChartData.charts) {
        console.log("No D1 chart data available for user", user._id);
        return 1;
      }

      const d1SvgString = d1ChartData.charts;
      console.log(`Finding Sun position in D1 chart for user ${user._id}`);

      // Multiple patterns to find Sun in D1 chart
      const patterns = [
        /<text[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*>[^<]*Su[^<]*<\/text>/,
        /<text[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*>Su<tspan[^>]*>[^<]*<\/tspan>/,
        /<text[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*>Su</,
      ];

      for (const pattern of patterns) {
        const match = d1SvgString.match(pattern);
        if (match) {
          const x = parseFloat(match[1]);
          const y = parseFloat(match[2]);
          console.log(
            `Su found for user ${user._id} at coordinates: x=${x}, y=${y}`
          );

          // Pass the D1 SVG string to the coordinate determination function
          return determineHouseFromCoordinates(x, y, d1SvgString);
        }
      }

      console.log(
        `No Su element found for user ${user._id}, defaulting to house 1`
      );
      return 1;
    };

    // Get Sun's house position from D1 chart
    const sunHouseInD1 = findSunHouseInD1(d1Data);
    console.log(
      `Final result for user ${user._id}: Su is in house ${sunHouseInD1} in D1 chart`
    );

    // Calculate rotation: if Sun is in house X in D1,
    // then Sun chart house 1 should be positioned where house X would be
    const rotationOffset = sunHouseInD1 - 1;

    // Function to rotate house numbers
    const getRotatedHouseNumber = (originalHouse) => {
      let newHouse = originalHouse + rotationOffset;
      if (newHouse > 12) newHouse -= 12;
      if (newHouse <= 0) newHouse += 12;
      return newHouse;
    };

    const houseNumberPositions = [
      { house: 1, x: 142, y: 138 }, // House number coordinates
      { house: 2, x: 72, y: 66 },
      { house: 3, x: 55, y: 81 },
      { house: 4, x: 130, y: 156 },
      { house: 5, x: 58, y: 231 },
      { house: 6, x: 70, y: 246 },
      { house: 7, x: 146, y: 174 },
      { house: 8, x: 223, y: 248 },
      { house: 9, x: 239, y: 230 },
      { house: 10, x: 165, y: 155 },
      { house: 11, x: 228, y: 81 },
      { house: 12, x: 217, y: 66 },
    ];

    // const scorePositions = [
    //   { house: 1, x: 143, y: 87 },
    //   { house: 2, x: 71, y: 35 },
    //   { house: 3, x: 20, y: 80 },
    //   { house: 4, x: 68, y: 152 },
    //   { house: 5, x: 20, y: 229 },
    //   { house: 6, x: 66, y: 284 },
    //   { house: 7, x: 143, y: 230 },
    //   { house: 8, x: 220, y: 287 },
    //   { house: 9, x: 275, y: 228 },
    //   { house: 10, x: 220, y: 153 },
    //   { house: 11, x: 270, y: 80 },
    //   { house: 12, x: 224, y: 37 },
    // ];
    // // Extract scores from original SVG and map them to their original houses
    // const scorePattern =
    //   /<text x="([^"]*)" y="([^"]*)" font-size="16" class="[^"]*ashtakavarga-score"[^>]*>([^<]*)<\/text>/g;
    // const originalHouseScores = {}; // This will store scores by house number
    // let scoreMatch;

    // // Reset the regex lastIndex
    // scorePattern.lastIndex = 0;

    // // Extract scores with their positions and map to houses
    // while ((scoreMatch = scorePattern.exec(svgString)) !== null) {
    //   const x = parseFloat(scoreMatch[1]);
    //   const y = parseFloat(scoreMatch[2]);
    //   const scoreValue = scoreMatch[3];

    //   // Find which house this score belongs to based on position
    //   let scoreHouse = 1;
    //   let minDistance = Infinity;

    //   for (const housePos of scorePositions) {
    //     const distance = Math.sqrt(
    //       Math.pow(x - housePos.x, 2) + Math.pow(y - housePos.y, 2)
    //     );
    //     if (distance < minDistance) {
    //       minDistance = distance;
    //       scoreHouse = housePos.house;
    //     }
    //   }

    //   // Store the score for this house
    //   originalHouseScores[scoreHouse] = scoreValue;
    // }

    // console.log("Original house scores:", originalHouseScores);

    // Create rotated house numbers
    const houseNumberElements = houseNumberPositions
      .map(({ house, x, y }) => {
        const rotatedHouse = getRotatedHouseNumber(house);
        return `<text x="${x}" y="${y}" font-size="12" class="house-number" fill="#666666" font-weight="bold">${rotatedHouse}</text>`;
      })
      .join("\n");

    // // FIXED SCORE ROTATION LOGIC
    // // const rotatedScoreElements = scorePositions
    // //   .map(({ house, x, y }) => {
    // //     // This position will show the rotated house number
    // //     const rotatedHouse = getRotatedHouseNumber(house);

    // //     // The score that should appear here is the score that belongs to this rotated house number
    // //     // So if this position shows house number "1", we need the score from the original house 1
    // //     // If this position shows house number "12", we need the score from the original house 12
    // //     const scoreValue = originalHouseScores[rotatedHouse];

    // //     if (scoreValue) {
    // //       return `<text x="${x}" y="${y}" font-size="16" class="ashtakavarga-score" fill="#FF0000" font-weight="bold">${scoreValue}</text>`;
    // //     }
    // //     return "";
    // //   })
    // //   .filter(Boolean)
    // //   .join("\n");

    // const rotatedScoreElements = scorePositions
    //   .map(({ house, x, y }) => {
    //     // For this position (which represents original house),
    //     // we need to show the score from the house that will be rotated to this position
    //     // If rotation offset is 2, then position 1 should show score from house 11 (1-2+12=11)
    //     let sourceHouse = house - rotationOffset;
    //     if (sourceHouse <= 0) sourceHouse += 12;
    //     if (sourceHouse > 12) sourceHouse -= 12;

    //     const scoreValue = originalHouseScores[sourceHouse];

    //     if (scoreValue) {
    //       return `<text x="${x}" y="${y}" font-size="16" class="ashtakavarga-score" fill="#FF0000" font-weight="bold">${scoreValue}</text>`;
    //     }
    //     return "";
    //   })
    //   .filter(Boolean)
    //   .join("\n");
    // console.log("Rotation offset:", rotationOffset);
    // console.log(
    //   "Score mapping: Each position shows the score that belongs to the rotated house number displayed there"
    // );

    const chartLinesMatch = svgString.match(
      /<g >\s*<g >\s*(.*?)\s*<\/g>\s*<\/g>/s
    );
    const chartLines = chartLinesMatch ? chartLinesMatch[1] : "";

    // Create the modified SVG with rotated elements
    const newSvg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  
  <g>
    <g>
      ${chartLines}
    </g>
  </g>
  <g>
    ${houseNumberElements}
  </g>
</svg>`;

    return newSvg;
  };

  return (
    <div className="chart-item">
      <h4 className="chart-title">Sun</h4>
      <div>
        {sunChartData?.sunData && (
          <SVGRenderer
            svgString={addHouseNumbersToSVG(sunChartData?.sunData, d1ChartData)}
            className="chart-image"
          />
        )}
      </div>
    </div>
  );
};

export default SunChart;
