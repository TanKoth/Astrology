import axiosInstance from ".";

export const getNakshatraMatchingReport = async (
  boyNakshatra,
  girlNakshatra,
  lang
) => {
  // console.log(
  //   "Fetching Nakshatra Matching report...",
  //   boyNakshatra,
  //   girlNakshatra,
  //   lang
  // );
  try {
    const response = await axiosInstance.get("/api/nakshatraMatching", {
      params: {
        boyNakshatra,
        girlNakshatra,
        lang,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Nakshatra Matching report:", error);
    throw error;
  }
};

export const getBoyAndGirlMatchingData = async (boyData, girlData, lang) => {
  //console.log("Fetching Boy and Girl Matching data...", boyData, girlData);
  try {
    const response = await axiosInstance.get("/api/matching", {
      params: {
        boy_dob: boyData.boy_dob,
        boy_tob: boyData.boy_tob,
        boy_lat: boyData.boy_lat,
        boy_lon: boyData.boy_lon,
        boy_tz: boyData.boy_tz,
        girl_dob: girlData.girl_dob,
        girl_tob: girlData.girl_tob,
        girl_lat: girlData.girl_lat,
        girl_lon: girlData.girl_lon,
        girl_tz: girlData.girl_tz,
        lang: lang || "en",
      },
    });
    //console.log("Boy and Girl Matching data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Boy and Girl Matching data:", error);
    throw error;
  }
};
