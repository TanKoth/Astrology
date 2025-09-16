import axiosInstance from ".";

const getAllBhinnashtakavargaCharts = async (userId, params, endpoint) => {
  try {
    // Validate all required parameters for Bhinnashtakavarga
    if (!params.dob) {
      throw new Error("Date of birth is required for Bhinnashtakavarga chart");
    }
    if (!params.timeOfBirth) {
      throw new Error("Time of birth is required for Bhinnashtakavarga chart");
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
      `/api/${endpoint}/${userId}?${urlParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Cannot fetch bhinnashtakavarga chart report:", error);
    throw error;
  }
};

export const getBhinnashtakavargaSunCharts = async (userId, params) => {
  return getAllBhinnashtakavargaCharts(
    userId,
    params,
    "ashtakavarga-sun-chart"
  );
};

export const getBhinnashtakavargaMoonCharts = async (userId, params) => {
  return getAllBhinnashtakavargaCharts(
    userId,
    params,
    "ashtakavarga-moon-chart"
  );
};
