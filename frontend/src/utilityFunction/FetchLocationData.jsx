const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const fetchLocationData = async (birthPlace) => {
  try {
    const key = GOOGLE_MAPS_API_KEY;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      birthPlace
    )}&key=${key}`;

    const response = await fetch(geocodingUrl);
    const data = await response.json();
    console.log("Geocoding API response:", data);

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;

      // Get timezone data
      const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${
        location.lat
      },${location.lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${key}`;

      const timezoneResponse = await fetch(timezoneUrl);
      const timezoneData = await timezoneResponse.json();
      console.log("Timezone API response:", timezoneData);

      return {
        latitude: location.lat,
        longitude: location.lng,
        gmtOffset: formatGMTOffset(timezoneData.rawOffset / 3600), // Convert seconds to hours and format
      };
    } else {
      throw new Error("No results found for the given birthplace");
    }
  } catch (err) {
    console.error("Alternative geocoding failed:", err);
    throw new Error("Failed to fetch location data");
  }
};

// Helper function to format GMT offset
const formatGMTOffset = (offsetHours) => {
  const absOffset = Math.abs(offsetHours);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hoursStr}:${minutesStr}`;
};

export const formateDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
