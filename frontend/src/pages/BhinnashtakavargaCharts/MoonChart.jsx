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
import { getBinnashtakavargaMoonTable } from "../../api/BhinnashtakavargaTable";
import { getD1Chart } from "../../api/Charts";
import { getUserDetails } from "../../api/user";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { SVGRenderer } from "../../utilityFunction/SvgFileConvertor";

const MoonChart = ({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
}) => {
  const { user } = useContext(AppContext);
  const [bhinnashtakaMoonChartData, setBhinnashtakaMoonChartData] =
    useState(null);
  const [isLoadingBhinnashtakaMoonChart, setIsLoadingBhinnashtakaMoonChart] =
    useState(false);
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
  //   document.title = `Bhinnashtaka Moon Chart - ${userName}`;

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
    setIsLoadingBhinnashtakaMoonChart(true);
    try {
      // Make cache key user-specific
      const cacheKey = `bhinnashtakaMoonChartData_${user._id}_${lang}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData && !forceRefresh) {
        try {
          const parsedData = JSON.parse(storedData);
          setBhinnashtakaMoonChartData(parsedData);
          setCurrentLanguage(lang);
          setIsLoadingBhinnashtakaMoonChart(false);
          return;
        } catch (err) {
          console.error("Error parsing bhinnashtaka moon chart data:", err);
        }
      }

      const userData = await getUserDetails(user._id);

      if (!userData) {
        toast.error("No user data found. Please complete your profile.");
        setIsLoadingBhinnashtakaMoonChart(false);
        return;
      }

      if (!userData.user.placeOfBirth) {
        toast.error("Birth place not found. Please update your profile.");
        setIsLoadingBhinnashtakaMoonChart(false);
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
        setIsLoadingBhinnashtakaMoonChart(false);
        return;
      }

      const apiParams = {
        dob: formateDate(userData.user.dob),
        timeOfBirth: userData.user.timeOfBirth,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        gmtOffset: locationData.gmtOffset,
      };

      // Fetch both Bhinnashtaka Moon and D1 chart data
      const [bhinnashtakaMoonResponse, d1Response] = await Promise.all([
        getBinnashtakavargaMoonTable(userData.user._id, apiParams),
        getD1Chart(userData.user._id, apiParams),
      ]);

      if (bhinnashtakaMoonResponse && bhinnashtakaMoonResponse.success) {
        // console.log(
        //   "Bhinnashtaka Moon API Response:",
        //   bhinnashtakaMoonResponse
        // );

        // Extract total values from binnashtakavargaTable
        let totalValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Default fallback

        if (
          bhinnashtakaMoonResponse?.binnashtakavargaTable &&
          bhinnashtakaMoonResponse?.binnashtakavargaTable?.response?.Total
        ) {
          totalValues =
            bhinnashtakaMoonResponse.binnashtakavargaTable?.response?.Total;
          //console.log("Extracted total values:", totalValues);
        }

        // Extract house numbers from D1 chart
        let extractedHouseNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Default fallback

        if (d1Response && d1Response.success) {
          //console.log("D1 Chart Response received");

          try {
            // Parse D1 chart SVG content - use charts property instead of data
            const d1Parser = new DOMParser();
            const d1SvgDoc = d1Parser.parseFromString(
              d1Response.charts, // Changed from d1Response.data to d1Response.charts
              "image/svg+xml"
            );

            //console.log("D1 SVG parsed successfully");

            // Get all text elements and extract house numbers
            const allD1TextElements = d1SvgDoc.querySelectorAll("text");
            //console.log("Total text elements found:", allD1TextElements.length);

            const houseNumbersFound = [];

            // Look for text elements that contain only numeric values (house numbers)
            allD1TextElements.forEach((element, index) => {
              const text = element.textContent.trim();
              const houseNum = parseInt(text);

              //console.log(`Element ${index}: text="${text}", parsed=${houseNum}`);

              // Check if it's a valid house number (1-12) and is a standalone number
              if (
                !isNaN(houseNum) &&
                houseNum >= 1 &&
                houseNum <= 12 &&
                text === houseNum.toString()
              ) {
                const x = parseFloat(element.getAttribute("x")) || 0;
                const y = parseFloat(element.getAttribute("y")) || 0;
                const style = element.getAttribute("style") || "";

                // Check if it's likely a house number by style (font-size:11px and fill:#000000)
                if (
                  style.includes("font-size:11px") &&
                  style.includes("fill:#000000")
                ) {
                  houseNumbersFound.push({
                    house: houseNum,
                    x: x,
                    y: y,
                    element: element,
                  });
                  //console.log(`Found house number: ${houseNum} at (${x}, ${y})`);
                }
              }
            });

            //console.log("Found house numbers in D1:", houseNumbersFound);

            if (houseNumbersFound.length >= 12) {
              // Sort by position to match the standard Vedic chart layout
              const standardPositions = [
                { x: 158, y: 159 }, // Position 0
                { x: 90, y: 94 }, // Position 1
                { x: 79, y: 103.5 }, // Position 2
                { x: 141, y: 170 }, // Position 3
                { x: 79, y: 236 }, // Position 4
                { x: 91, y: 245 }, // Position 5
                { x: 159, y: 181 }, // Position 6
                { x: 228, y: 248 }, // Position 7
                { x: 239, y: 238 }, // Position 8
                { x: 170, y: 170 }, // Position 9
                { x: 240, y: 101.4 }, // Position 10
                { x: 229, y: 92 }, // Position 11
              ];

              const mappedHouseNumbers = new Array(12);

              // Map each found house number to its correct position
              standardPositions.forEach((standardPos, index) => {
                let closestHouse = null;
                let minDistance = Infinity;

                houseNumbersFound.forEach((foundHouse) => {
                  const distance = Math.sqrt(
                    Math.pow(foundHouse.x - standardPos.x, 2) +
                      Math.pow(foundHouse.y - standardPos.y, 2)
                  );

                  if (distance < minDistance && distance < 25) {
                    // Increased tolerance to 25px
                    minDistance = distance;
                    closestHouse = foundHouse;
                  }
                });

                if (closestHouse) {
                  mappedHouseNumbers[index] = closestHouse.house;
                  //console.log(`Mapped position ${index} to house ${closestHouse.house}`);
                  // Remove this house from future matching
                  const foundIndex = houseNumbersFound.indexOf(closestHouse);
                  if (foundIndex > -1) {
                    houseNumbersFound.splice(foundIndex, 1);
                  }
                }
              });

              // Fill any missing positions with sequential numbers
              for (let i = 0; i < 12; i++) {
                if (
                  mappedHouseNumbers[i] === undefined ||
                  mappedHouseNumbers[i] === null
                ) {
                  mappedHouseNumbers[i] = (i % 12) + 1;
                }
              }

              extractedHouseNumbers = mappedHouseNumbers;
              //console.log("Final mapped house numbers:", extractedHouseNumbers);
            } else {
              //console.log("Not enough house numbers found, using defaults");
            }
          } catch (parseError) {
            console.error("Error parsing D1 chart:", parseError);
          }
        }

        // Create new SVG with user-specific house numbers and sarvashtakavarga values
        const newSvgStructure = `<svg height="330" width="330" xmlns="http://www.w3.org/2000/svg">
        <g transform="scale(0.0555, -0.071) translate(-32, -4690) rotate(0, 150, 150)"
        fill="black" stroke="none">
        <path d="M2959 4661 c-14 -33 -28 -44 -90 -75 -193 -95 -617 -137 -1374 -135
        -231 0 -449 -4 -515 -10 -283 -28 -415 -86 -436 -190 -5 -24 -12 -31 -31 -31
        -65 0 -139 -55 -178 -131 -67 -130 -78 -274 -70 -869 8 -526 5 -560 -54 -686
        -33 -71 -107 -156 -151 -174 -32 -13 -31 -30 1 -30 45 0 132 -111 161 -205 38
        -125 40 -164 47 -740 7 -556 8 -572 30 -640 13 -38 34 -89 47 -112 33 -57 106
        -118 159 -134 34 -10 45 -18 45 -34 0 -78 140 -131 405 -154 69 -6 421 -11
        830 -11 705 0 809 -4 931 -36 138 -35 244 -111 265 -188 l11 -41 13 39 c30 86
        140 156 300 193 74 17 147 18 945 19 854 1 866 1 944 22 127 35 200 88 213
        155 3 16 11 30 17 32 6 1 30 8 54 14 106 29 179 150 219 361 12 68 16 172 17
        530 2 409 4 454 24 560 45 245 119 376 224 398 l43 9 -43 12 c-87 24 -160 131
        -202 296 -41 159 -51 290 -50 643 0 451 -18 603 -87 742 -43 84 -97 133 -168
        151 -37 9 -46 16 -55 45 -16 47 -55 91 -100 114 -50 25 -248 65 -425 85 -169
        19 -392 22 -875 11 -313 -7 -385 -6 -508 8 -296 35 -493 115 -513 208 -3 12
        -9 5 -20 -21z m137 -110 c74 -36 181 -65 328 -88 117 -18 401 -22 1026 -13
        232 4 312 1 430 -13 164 -21 371 -62 411 -82 40 -21 87 -81 95 -120 4 -22 12
        -35 21 -35 75 0 159 -64 203 -153 61 -125 71 -211 80 -712 6 -355 11 -470 25
        -545 34 -193 103 -348 175 -395 29 -19 39 -35 22 -35 -19 0 -84 -74 -108 -123
        -40 -79 -63 -151 -86 -277 -20 -106 -22 -151 -24 -560 -1 -362 -4 -461 -18
        -532 -41 -224 -131 -348 -251 -348 -34 0 -35 -1 -35 -37 0 -79 -117 -148 -295
        -173 -44 -6 -336 -7 -775 -4 -917 8 -1021 1 -1190 -84 -52 -26 -84 -50 -107
        -80 -18 -24 -33 -40 -33 -35 0 5 -16 28 -36 51 -47 55 -154 107 -279 135 -98
        22 -111 22 -715 19 -643 -3 -1005 7 -1153 33 -156 27 -237 70 -237 126 0 25
        -5 29 -56 44 -103 30 -176 130 -211 287 -13 61 -16 139 -14 488 2 454 -8 661
        -39 788 -32 131 -88 226 -150 252 l-30 13 39 28 c72 53 129 151 158 266 14 59
        16 146 17 658 1 578 2 592 23 668 46 160 103 227 199 235 54 4 54 5 54 37 0
        69 84 130 220 159 158 34 248 39 765 41 618 3 886 20 1128 70 135 28 244 72
        281 114 l20 21 30 -29 c17 -16 58 -43 92 -60z"/>
        <path d="M2960 4556 c0 -22 -55 -63 -117 -86 -222 -84 -670 -126 -1233 -115
        -582 12 -847 -26 -940 -132 -17 -19 -33 -47 -36 -63 -5 -24 -11 -28 -51 -33
        -91 -10 -165 -111 -200 -272 -16 -71 -17 -136 -15 -607 3 -570 0 -610 -52
        -723 -30 -67 -94 -137 -148 -164 -35 -17 -38 -21 -22 -27 59 -19 78 -31 109
        -67 19 -22 44 -65 55 -95 50 -134 52 -156 60 -732 7 -589 7 -588 65 -706 32
        -66 105 -131 162 -147 33 -8 43 -16 43 -32 1 -47 66 -91 180 -118 151 -37 250
        -41 1015 -43 710 -2 755 -3 842 -22 161 -35 295 -118 310 -192 6 -31 23 -32
        23 -1 0 34 56 96 116 128 141 75 169 77 1119 77 821 1 831 1 892 22 34 12 82
        33 107 48 43 25 86 79 86 108 0 9 19 19 49 27 120 31 192 151 232 386 7 44 12
        223 13 485 2 344 5 431 19 509 43 235 128 381 220 381 31 0 45 18 20 26 -118
        35 -176 119 -223 319 -33 139 -41 266 -44 638 -3 379 -11 466 -55 591 -39 110
        -114 190 -192 202 -33 6 -39 11 -54 50 -21 54 -74 100 -140 120 -87 26 -324
        62 -495 75 -166 12 -295 10 -695 -11 -392 -21 -739 16 -895 95 -45 23 -110 85
        -110 105 0 6 -4 10 -10 10 -5 0 -10 -6 -10 -14z m82 -151 c57 -86 241 -266
        354 -346 288 -202 373 -264 481 -352 68 -54 144 -124 169 -155 52 -63 108
        -173 123 -240 9 -42 8 -43 -33 -76 -139 -113 -1139 -866 -1149 -865 -7 0 -266
        192 -577 427 -483 365 -565 431 -568 455 -9 73 61 208 161 314 29 31 147 127
        263 214 399 298 486 374 594 520 31 42 70 106 86 143 24 56 31 64 39 50 6 -9
        31 -50 57 -89z m-120 23 c-83 -165 -220 -300 -595 -582 -178 -133 -301 -234
        -345 -281 -82 -87 -140 -192 -150 -269 l-7 -56 -587 443 c-393 295 -588 448
        -588 460 0 29 27 74 59 96 43 31 101 50 226 74 103 20 144 21 635 23 297 1
        588 6 670 13 299 24 555 73 656 124 27 14 51 23 53 21 2 -2 -10 -32 -27 -66z
        m278 -31 c188 -54 274 -57 1210 -46 335 4 444 -5 670 -53 139 -29 198 -66 221
        -135 10 -31 9 -35 -16 -55 -15 -12 -267 -203 -559 -425 -436 -331 -532 -400
        -537 -386 -4 10 -15 45 -25 78 -20 63 -69 146 -124 209 -52 59 -217 190 -420
        335 -102 72 -214 153 -249 178 -98 71 -253 225 -311 309 l-52 75 53 -30 c30
        -16 92 -41 139 -54z m-1985 -716 c316 -239 574 -435 573 -436 -2 -2 -48 -8
        -103 -14 -134 -14 -241 -43 -351 -95 -127 -60 -195 -109 -346 -247 -169 -156
        -306 -265 -442 -357 -103 -69 -258 -151 -316 -167 -22 -7 -21 -4 13 30 53 51
        83 102 114 192 l27 78 1 570 c1 631 2 646 66 766 42 79 103 121 166 116 13 -1
        282 -197 598 -436z m4193 410 c80 -41 130 -125 163 -277 19 -89 22 -145 29
        -529 8 -451 14 -518 61 -670 28 -90 51 -137 96 -185 41 -46 37 -47 -42 -20
        -131 45 -276 146 -460 320 -336 316 -721 529 -958 530 -105 0 -122 -15 465
        431 428 325 558 419 580 419 16 0 45 -9 66 -19z m-954 -870 c218 -57 531 -258
        811 -521 177 -167 329 -269 464 -310 58 -18 57 -21 -4 -40 -154 -49 -360 -197
        -706 -508 -177 -159 -361 -273 -542 -334 -73 -25 -114 -32 -197 -36 l-105 -4
        -580 437 c-319 240 -580 442 -580 447 0 6 263 211 585 456 l585 445 95 -6 c52
        -4 130 -15 174 -26z m-2059 -430 c313 -237 571 -434 572 -438 1 -4 -248 -197
        -553 -428 l-555 -420 -112 1 c-73 0 -136 7 -182 19 -195 50 -411 182 -675 415
        -149 130 -374 298 -445 331 -33 16 -96 39 -141 51 l-81 23 66 27 c194 80 440
        256 718 513 248 230 472 331 739 334 l80 1 569 -429z m3367 -475 c-49 -53 -73
        -98 -101 -190 -49 -160 -55 -224 -56 -666 -1 -228 -5 -435 -9 -460 -27 -172
        -73 -287 -135 -343 -40 -36 -108 -64 -133 -54 -7 2 -264 194 -570 424 l-557
        420 79 7 c256 21 520 161 810 430 200 185 445 368 565 422 49 22 125 50 144
        53 2 1 -15 -19 -37 -43z m-2188 -414 c425 -321 576 -440 581 -459 10 -40 -21
        -126 -68 -189 -62 -84 -138 -148 -332 -281 -382 -262 -431 -299 -520 -388 -97
        -98 -186 -222 -213 -297 -9 -27 -19 -48 -22 -48 -3 0 -21 30 -39 67 -64 130
        -140 235 -247 340 -114 112 -302 257 -489 378 -206 134 -332 283 -350 416 -7
        45 -6 47 37 82 114 93 1074 817 1080 815 4 -2 266 -198 582 -436z m-3186 378
        c115 -47 260 -151 508 -366 69 -60 178 -146 242 -191 237 -167 390 -225 650
        -245 30 -3 -12 -37 -545 -443 -643 -490 -600 -464 -691 -408 -56 35 -105 105
        -134 191 -21 64 -22 87 -29 597 -7 540 -11 601 -50 725 -22 68 -70 153 -98
        171 -32 21 72 -1 147 -31z m1513 -959 c50 -101 161 -206 364 -341 381 -256
        541 -413 676 -665 l43 -80 -43 39 c-52 46 -120 78 -227 108 -77 21 -99 22
        -884 29 -443 4 -816 10 -830 13 -14 2 -60 10 -104 16 -144 21 -236 66 -236
        114 0 16 149 134 598 474 l597 454 7 -48 c4 -26 21 -77 39 -113z m2883 -331
        c590 -444 562 -416 489 -490 -66 -64 -185 -97 -378 -102 -55 -1 -399 -1 -765
        0 -399 2 -703 -1 -760 -7 -146 -16 -253 -53 -312 -109 -35 -33 -35 -25 1 46
        68 135 208 286 368 399 54 39 193 134 308 213 247 169 357 269 405 371 17 37
        30 80 30 102 l0 39 45 -34 c24 -18 281 -211 569 -428z"/>
        </g>

        

        <!-- Dynamic House numbers from user's D1 chart -->
        <text x="158" y="159" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[0]
        }</text>
        <text x="90" y="94" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[1]
        }</text>
        <text x="79" y="103.5" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[2]
        }</text>
        <text x="148" y="170" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[3]
        }</text>
        <text x="79" y="236" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[4]
        }</text>
        <text x="91" y="245" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[5]
        }</text>
        <text x="159" y="181" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[6]
        }</text>
        <text x="228" y="248" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[7]
        }</text>
        <text x="239" y="238" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[8]
        }</text>
        <text x="170" y="170" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[9]
        }</text>
        <text x="240" y="101.4" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[10]
        }</text>
        <text x="229" y="92" style="font-family:Arial;font-size:11px;fill:#000000">${
          extractedHouseNumbers[11]
        }</text>

        <!-- Total values positioned in each house section -->
         ${extractedHouseNumbers
           .map((houseNum, positionIndex) => {
             const totalValueIndex = houseNum - 1; // Convert house number to 0-based index
             const totalValue = totalValues[totalValueIndex] || 0;

             // Define the coordinates for total values at each position (anti-clockwise order)
             const totalValuePositions = [
               { x: 160, y: 80 }, // Position 0 (1st house area)
               { x: 93, y: 58 }, // Position 1 (12th house area) - anti-clockwise
               { x: 30, y: 80 }, // Position 2 (11th house area) - anti-clockwise
               { x: 80, y: 155 }, // Position 3 (10th house area) - anti-clockwise
               { x: 30, y: 230 }, // Position 4 (9th house area) - anti-clockwise
               { x: 85, y: 285 }, // Position 5 (8th house area) - anti-clockwise
               { x: 160, y: 230 }, // Position 6 (7th house area) - anti-clockwise
               { x: 220, y: 285 }, // Position 7 (6th house area) - anti-clockwise
               { x: 270, y: 230 }, // Position 8 (5th house area) - anti-clockwise
               { x: 220, y: 155 }, // Position 9 (4th house area) - anti-clockwise
               { x: 271, y: 88 }, // Position 10 (3rd house area) - anti-clockwise
               { x: 228, y: 54 }, // Position 11 (2nd house area) - anti-clockwise
             ];

             const position = totalValuePositions[positionIndex];
             return `<text x="${position.x}" y="${position.y}" font-family="Arial" font-size="12" fill="#FF6B35" font-weight="bold">${totalValue}</text>`;
           })
           .join("\n        ")}
      </svg>`;

        // Update response with new chart structure
        const updatedResponse = {
          ...bhinnashtakaMoonResponse,
          data: newSvgStructure,
        };

        setBhinnashtakaMoonChartData(updatedResponse);

        // Store with user-specific cache key
        localStorage.setItem(cacheKey, JSON.stringify(updatedResponse));
        setCurrentLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to fetch Bhinnashtakavarga Moon chart:", err);
      toast.error(
        "Failed to load Bhinnashtakavarga Moon chart. Please try again."
      );
    } finally {
      setIsLoadingBhinnashtakaMoonChart(false);
    }
  };

  const handleLanguageChange = async () => {
    const languageMap = {
      en: "hi",
      hi: "en",
    };

    const newLanguage = languageMap[currentLanguage] || "en";
    setIsLoadingBhinnashtakaMoonChart(true);

    try {
      await fetchInsights(newLanguage, true);
      // Call parent's language change handler if provided
      if (onLanguageChange) {
        onLanguageChange();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
      setIsLoadingBhinnashtakaMoonChart(false);
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
      {/* <h4 className="chart-title">Moon</h4> */}
      <div>
        {bhinnashtakaMoonChartData?.data && (
          <SVGRenderer
            svgString={bhinnashtakaMoonChartData?.data}
            className="chart-image"
          />
        )}
      </div>
    </div>
  );
};

export default MoonChart;
