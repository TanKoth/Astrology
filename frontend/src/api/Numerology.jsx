import axiosInstance from ".";

export const numerology = async (userId, params, endpoint) => {
  console.log("Fetching user report for userId:", userId);
  console.log("Params received:", params);
  try {
    //console.log("Fetching Sade Sati details for userId:", userId);
    if (
      !params.dob ||
      !params.timeOfBirth ||
      params.latitude === undefined ||
      params.longitude === undefined ||
      params.gmtOffset === undefined
    ) {
      throw new Error(
        "Date of birth, time of birth, latitude, longitude and GMT offset are required"
      );
    }

    const urlParams = new URLSearchParams({
      dob: params.dob,
      timeOfBirth: params.timeOfBirth,
      latitude: params.latitude,
      longitude: params.longitude,
      gmtOffset: params.gmtOffset,
      lang: params.la || "en",
    });
    //console.log("Query Params:", urlParams.toString());
    const response = await axiosInstance.get(
      `/api/numerology/${endpoint}/${userId}?${urlParams.toString()}`
    );
    //console.log("Dasha details response:", response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching Dasha details:", error.message);
    throw error;
  }
};

export const getBirthdateNumber = async (userId, params) => {
  return numerology(userId, params, "birthday-number");
};

export const getNumerology = async (userId, params) => {
  console.log("Fetching user report for userId:", userId);
  console.log("Params received:", params);
  try {
    // Validate all required parameters
    if (!params.dob) {
      throw new Error("Date of birth is required");
    }

    const urlParams = new URLSearchParams({
      dob: params.dob, // Make sure this is in YYYY-MM-DD format
      lang: params.lang || "en",
    });
    if (params.name) {
      urlParams.append("name", params.name); // No manual encoding
    }
    const queryString = urlParams.toString();
    const response = await axiosInstance.get(
      `/api/numerology/numerology/${userId}?${queryString}`
    );
    console.log("Response for numerology report:", response.data);
    return response.data;
  } catch (error) {
    console.error("Cannot fetch numerology report:", error);
    throw error;
  }
};
