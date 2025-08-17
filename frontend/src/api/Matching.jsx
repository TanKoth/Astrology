import axiosInstance from ".";

export const getNakshatraMatchingReport = async (
  boyNakshatra,
  girlNakshatra,
  lang
) => {
  console.log(
    "Fetching Nakshatra Matching report...",
    boyNakshatra,
    girlNakshatra,
    lang
  );
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
