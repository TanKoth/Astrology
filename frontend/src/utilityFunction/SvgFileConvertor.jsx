import { useState, useEffect } from "react";
import "../pages/Charts/ChartImage.css";

export const SVGImageComponent = ({
  svgString,
  className = "",
  alt = "SVG Chart",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!svgString) {
      setError(true);
      return;
    }

    try {
      // Clean and process the SVG string
      let cleanSVG = svgString;

      // Remove escape characters and fix formatting
      cleanSVG = cleanSVG
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      // Ensure the SVG has proper XML declaration if missing
      if (!cleanSVG.includes("<?xml")) {
        cleanSVG = '<?xml version="1.0" encoding="UTF-8"?>\n' + cleanSVG;
      }

      // Create blob and object URL
      const svgBlob = new Blob([cleanSVG], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      setImageSrc(svgUrl);
      setError(false);

      // Cleanup function
      return () => {
        URL.revokeObjectURL(svgUrl);
      };
    } catch (err) {
      console.error("Error processing SVG:", err);
      setError(true);
    }
  }, [svgString]);

  if (error || !svgString) {
    return (
      <div className="svg-error">
        <p>Unable to load chart</p>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className="svg-loading">
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
      onError={() => setError(true)}
      {...props}
    />
  );
};

// Alternative function that renders SVG directly in DOM (if blob approach doesn't work)
// export const SVGDirectRenderer = ({
//   svgString,
//   className = "",
//   alt = "SVG Chart",
// }) => {
//   const [processedSVG, setProcessedSVG] = useState("");

//   useEffect(() => {
//     if (!svgString) return;

//     try {
//       // Clean the SVG string
//       let cleanSVG = svgString;
//       cleanSVG = cleanSVG
//         .replace(/\\n/g, "\n")
//         .replace(/\\"/g, '"')
//         .replace(/\\\\/g, "\\");

//       // Add CSS classes and fix positioning
//       cleanSVG = addCSSClassesAndFixPositioning(cleanSVG);

//       setProcessedSVG(cleanSVG);
//     } catch (err) {
//       console.error("Error processing SVG:", err);
//     }
//   }, [svgString]);

//   // Function to add CSS classes and fix planet positioning
//   const addCSSClassesAndFixPositioning = (svgString) => {
//     let modifiedSVG = svgString;

//     // Define house center coordinates based on your exact requirements
//     const houseCenters = {
//       1: { x: 270, y: 80, width: 40, height: 35 }, // House 1 - far right top
//       2: { x: 210, y: 50, width: 40, height: 35 }, // House 2 - top right triangle
//       3: { x: 160, y: 100, width: 40, height: 35 }, // House 3 - center (like your Asc position)
//       4: { x: 100, y: 50, width: 40, height: 35 }, // House 4 - top left triangle
//       5: { x: 60, y: 100, width: 40, height: 35 }, // House 5 - left center
//       6: { x: 60, y: 160, width: 40, height: 35 }, // House 6 - left bottom
//       7: { x: 160, y: 210, width: 40, height: 35 }, // House 7 - bottom center
//       8: { x: 170, y: 180, width: 40, height: 35 }, // House 8 - bottom triangle
//       9: { x: 160, y: 159, width: 40, height: 35 }, // House 9 - center area
//       10: { x: 230, y: 240, width: 40, height: 35 }, // House 10 - bottom right
//       11: { x: 240, y: 100, width: 40, height: 35 }, // House 11 - right center
//       12: { x: 170, y: 170, width: 40, height: 35 }, // House 12 - center right
//     };

//     // Planet abbreviations mapping
//     const planetMappings = {
//       Su: "planet-sun",
//       Mo: "planet-moon",
//       Ma: "planet-mars",
//       Me: "planet-mercury",
//       Ju: "planet-jupiter",
//       Ve: "planet-venus",
//       Sa: "planet-saturn",
//       Ra: "planet-rahu",
//       Ke: "planet-ketu",
//     };

//     // First, identify which planets are in which houses by analyzing current positions
//     const planetPositions = {};

//     // Extract all planet text elements
//     const planetTextRegex =
//       /<text x="(\d+)" y="(\d+)" style="[^"]*font-weight:bold[^"]*">([^<]+)<\/text>/g;
//     let match;

//     while ((match = planetTextRegex.exec(modifiedSVG)) !== null) {
//       const x = parseInt(match[1]);
//       const y = parseInt(match[2]);
//       const planet = match[3];

//       // Skip Asc as it should stay in original position
//       if (planet === "Asc") continue;

//       // Determine which house this planet belongs to based on proximity
//       let closestHouse = 1;
//       let minDistance = Infinity;

//       Object.entries(houseCenters).forEach(([house, center]) => {
//         const distance = Math.sqrt(
//           Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
//         );
//         if (distance < minDistance) {
//           minDistance = distance;
//           closestHouse = parseInt(house);
//         }
//       });

//       if (!planetPositions[closestHouse]) {
//         planetPositions[closestHouse] = [];
//       }
//       planetPositions[closestHouse].push(planet);
//     }

//     // Now reposition planets in each house with vertical alignment exactly like your example
//     Object.entries(planetPositions).forEach(([house, planets]) => {
//       const houseData = houseCenters[parseInt(house)];
//       const houseCenter = { x: houseData.x, y: houseData.y };

//       planets.forEach((planet, index) => {
//         let newX = houseCenter.x;
//         let newY = houseCenter.y;

//         // Handle multiple planets by stacking them vertically with 14px spacing (like your example)
//         if (planets.length > 1) {
//           // Use 14px spacing between planets vertically (as shown in your Su/Ra example)
//           const lineHeight = 14;
//           const totalHeight = (planets.length - 1) * lineHeight;
//           const startY = houseCenter.y - totalHeight / 2;

//           newY = startY + index * lineHeight;
//         }

//         // Ensure planets stay within house boundaries with some margin
//         const margin = 10;
//         const minX = houseCenter.x - houseData.width / 2 + margin;
//         const maxX = houseCenter.x + houseData.width / 2 - margin;
//         const minY = houseCenter.y - houseData.height / 2 + margin;
//         const maxY = houseCenter.y + houseData.height / 2 - margin;

//         newX = Math.max(minX, Math.min(maxX, newX));
//         newY = Math.max(minY, Math.min(maxY, newY));

//         // Update the planet text position with exact coordinates
//         const escapedPlanet = planet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//         const oldTextRegex = new RegExp(
//           `<text x="\\d+" y="\\d+" style="([^"]*font-weight:bold[^"]*)">${escapedPlanet}</text>`,
//           "g"
//         );

//         const planetClass = planetMappings[planet] || "planet-default";
//         const replacement = `<text x="${Math.round(newX)}" y="${Math.round(
//           newY
//         )}" style="$1" class="${planetClass} planet-text">${planet}</text>`;

//         modifiedSVG = modifiedSVG.replace(oldTextRegex, replacement);
//       });
//     });

//     // Add CSS classes for styling
//     Object.entries(planetMappings).forEach(([planet, className]) => {
//       const regex = new RegExp(`class="([^"]*)"([^>]*>)(${planet})<`, "gi");
//       modifiedSVG = modifiedSVG.replace(regex, `class="$1 ${className}" $2$3<`);
//     });

//     return modifiedSVG;
//   };
//   if (!processedSVG) {
//     return <div className="svg-loading">Loading chart...</div>;
//   }

//   return (
//     <div
//       className={`bhav-chalit-chart ${className}`}
//       dangerouslySetInnerHTML={{ __html: processedSVG }}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     />
//   );
// };

const removeAscFromSvg = (svgString) => {
  if (!svgString) return svgString;

  // Remove the Asc text element
  return svgString.replace(/<text[^>]*>Asc<\/text>/g, "");
};
const cleanPlanetText = (svgString) => {
  if (!svgString) return svgString;

  // Remove degree information from planet text elements
  // This regex matches: planet abbreviation + degree info in parentheses + symbols
  return svgString.replace(
    /<text([^>]*style="[^"]*font-weight:bold[^"]*"[^>]*)>([A-Za-z]{2})<tspan[^>]*>\s*\([^)]*\)[^<]*<\/tspan><tspan[^>]*>[^<]*<\/tspan><\/text>/g,
    "<text$1>$2</text>"
  );
};
// D3Chart component for rendering SVG
export const SVGRenderer = ({ svgString, className = "" }) => {
  if (!svgString) {
    return (
      <div className={`all-chart-placeholder ${className}`}>
        <p>No chart data available</p>
      </div>
    );
  }

  // Clean and validate SVG string
  let cleanSvgString = removeAscFromSvg(svgString.trim());
  cleanSvgString = cleanPlanetText(cleanSvgString);

  // Basic validation to ensure it's an SVG
  if (
    !cleanSvgString.startsWith("<svg") ||
    !cleanSvgString.endsWith("</svg>")
  ) {
    console.error("Invalid SVG string provided to Chart");
    return (
      <div className={`all-chart-error ${className}`}>
        <p>Invalid chart data</p>
      </div>
    );
  }

  return (
    <div
      className={`all-chart-container ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanSvgString }}
      role="img"
    />
  );
};
