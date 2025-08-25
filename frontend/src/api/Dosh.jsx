import axiosInstance from ".";

const dosh = async (userId, params, endpoint) => {
  //console.log("Fetching user report for userId:", userId);
  //console.log("Params received:", params);
  try {
    // Validate all required parameters
    if (!params.dob) {
      throw new Error("Date of birth is required");
    }
    if (!params.timeOfBirth) {
      throw new Error("Time of birth is required");
    }
    if (params.latitude === undefined || params.latitude === null) {
      throw new Error("Latitude is required");
    }
    if (params.longitude === undefined || params.longitude === null) {
      throw new Error("Longitude is required");
    }
    if (params.gmtOffset === undefined || params.gmtOffset === null) {
      throw new Error("GMT offset is required");
    }

    const urlParams = new URLSearchParams({
      dob: params.dob,
      timeOfBirth: params.timeOfBirth,
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      gmtOffset: params.gmtOffset.toString(),
      lang: params.lang || "en", // Default to English if no language is provided
    });

    const response = await axiosInstance.get(
      `/api/dosh/${endpoint}/${userId}?${urlParams.toString()}`
    );
    //console.log(`Response for ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Cannot fetch ${endpoint} report:`, error);
    throw error;
  }
};

export const getPitraDosh = async (userId, params) => {
  return dosh(userId, params, "pitra-dosh");
};

export const getKaalsarpDosh = async (userId, params) => {
  return dosh(userId, params, "kaalsarp-dosh");
};

export const getMangalDosh = async (userId, params) => {
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
      lang: params.lang || "en", // Default to English if no language is provided
    });
    //console.log("Query Params:", urlParams.toString());
    const response = await axiosInstance.get(
      `/api/dosh/mangal-dosh/${userId}?${urlParams.toString()}`
    );
    //console.log("Mangal details response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Mangal details:", error.message);
    throw error;
  }
};
