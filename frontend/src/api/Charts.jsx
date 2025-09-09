import axiosInstance from ".";

const charts = async (userId, params, endpoint) => {
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
    //console.log(`Response for ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Cannot fetch ${endpoint} report:`, error);
    throw error;
  }
};

export const getBhavChalitChart = async (userId, params) => {
  return charts(userId, params, "bhav_chalit_chart");
};

export const getD1Chart = async (userId, params) => {
  return charts(userId, params, "d1");
};

export const getD3Chart = async (userId, params) => {
  return charts(userId, params, "d3");
};
export const getD4Chart = async (userId, params) => {
  return charts(userId, params, "d4");
};
export const getD6Chart = async (userId, params) => {
  return charts(userId, params, "d6");
};
export const getD7Chart = async (userId, params) => {
  return charts(userId, params, "d7");
};
export const getD8Chart = async (userId, params) => {
  return charts(userId, params, "d8");
};
export const getD9Chart = async (userId, params) => {
  return charts(userId, params, "d9");
};
export const getD10Chart = async (userId, params) => {
  return charts(userId, params, "d10");
};
export const getD12Chart = async (userId, params) => {
  return charts(userId, params, "d12");
};
export const getD16Chart = async (userId, params) => {
  return charts(userId, params, "d16");
};
export const getD20Chart = async (userId, params) => {
  return charts(userId, params, "d20");
};
export const getD24Chart = async (userId, params) => {
  return charts(userId, params, "d24");
};
export const getD27Chart = async (userId, params) => {
  return charts(userId, params, "d27");
};
export const getD30Chart = async (userId, params) => {
  return charts(userId, params, "d30");
};
export const getD40Chart = async (userId, params) => {
  return charts(userId, params, "d40");
};
export const getD45Chart = async (userId, params) => {
  return charts(userId, params, "d45");
};
export const getD60Chart = async (userId, params) => {
  return charts(userId, params, "d60");
};

export const getMoonChart = async (userId, params) => {
  return charts(userId, params, "moon");
};

// export const getSarvashtakavargaChart = async (userId, params) => {
//   return charts(userId, params, "sarvashtakavarga_chart");
// };

export const getSarvashtakavargaChart = async (userId, params) => {
  try {
    // Validate all required parameters for Sarvashtakavarga
    if (!params.dob) {
      throw new Error("Date of birth is required for Sarvashtakavarga chart");
    }
    if (!params.timeOfBirth) {
      throw new Error("Time of birth is required for Sarvashtakavarga chart");
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
    });

    const response = await axiosInstance.get(
      `/api/sarvashtakavarga-chart/${userId}?${urlParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Cannot fetch sarvashtakavarga chart report:", error);
    throw error;
  }
};
