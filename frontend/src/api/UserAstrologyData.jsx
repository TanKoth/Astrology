import axiosInstance from ".";

export const fetchAstrologyData = async (userId, params, endpoint) => {
  //console.log("Fetching user insights for userId:", userId);
  console.log("Params received:", params);
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
      //birthPlace: params.birthPlace,
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      gmtOffset: params.gmtOffset.toString(),
      lang: params.lang,
      //userId: params.userId,
    });

    const response = await axiosInstance.get(
      `/api/astrologyData/${endpoint}/${userId}?${urlParams.toString()}`
    );
    // console.log("Response prediction API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Moon prediction API error:", error);
    throw error;
  }
};

export const getMoonPrediction = async (userId, params) => {
  return fetchAstrologyData(userId, params, "moon-prediction");
};

export const getRasiPrediction = async (userId, params) => {
  return fetchAstrologyData(userId, params, "rasi-prediction");
};

export const getNakshatraPrediction = async (userId, params) => {
  return fetchAstrologyData(userId, params, "nakshatra-prediction");
};

export const getPanchangPrediction = async (userId, params) => {
  return fetchAstrologyData(userId, params, "panchang-prediction");
};
