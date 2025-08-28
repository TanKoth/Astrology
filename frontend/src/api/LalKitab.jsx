import axiosInstance from ".";

const lalkitab = async (userId, params, endpoint) => {
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
      `/api/lalkitab/${endpoint}/${userId}?${urlParams.toString()}`
    );
    //console.log(`Response for ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Cannot fetch ${endpoint} report:`, error);
    throw error;
  }
};

export const getLalkitabDebt = async (userId, params) => {
  return lalkitab(userId, params, "debts");
};

export const getLalkitabRemedies = async (userId, params) => {
  return lalkitab(userId, params, "remedies");
};

export const getLalkitabPlanets = async (userId, params) => {
  return lalkitab(userId, params, "planets");
};

export const getLalkitabHouses = async (userId, params) => {
  return lalkitab(userId, params, "houses");
};
