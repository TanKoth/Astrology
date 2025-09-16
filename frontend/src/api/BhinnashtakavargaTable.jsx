import axiosInstance from ".";

const getBinnashtakavargaTable = async (userId, params, endpoint) => {
  //console.log("Fetching user report for userId:", userId);
  //console.log("Params received:", params);
  try {
    // Validate all required parameters
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
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      gmtOffset: params.gmtOffset.toString(),
      lang: params.lang || "en", // Default to English if no language is provided
    });

    const response = await axiosInstance.get(
      `/api/${endpoint}/${userId}?${urlParams.toString()}`
    );
    //console.log("Url:", `/api/${endpoint}/${userId}?${urlParams.toString()}`);
    //console.log(`Response for ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Cannot fetch ${endpoint} report:`, error);
    throw error;
  }
};

export const getBinnashtakavargaSunTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-sun");
};

export const getBinnashtakavargaMoonTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-moon");
};

export const getBinnashtakavargaMarsTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-mars");
};

export const getBinnashtakavargaMercuryTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-mercury");
};

export const getBinnashtakavargaJupiterTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-jupiter");
};

export const getBinnashtakavargaVenusTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-venus");
};

export const getBinnashtakavargaSaturnTable = async (userId, params) => {
  return getBinnashtakavargaTable(userId, params, "binnashtakvarga-saturn");
};
