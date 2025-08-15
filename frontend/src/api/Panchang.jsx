import axiosInstance from ".";

export const getPanchangReport = async (panchangData) => {
  try {
    console.log("Fetching Panchang report with params:", panchangData);

    const response = await axiosInstance.get("/api/panchang", {
      params: panchangData,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Panchang report:", error);
    throw error;
  }
};

export const getChoghadiyaReport = async (choghadiyaData) => {
  try {
    console.log("Fetching Choghadiya report with params:", choghadiyaData);

    const response = await axiosInstance.get("/api/panchang/choghadiya", {
      params: choghadiyaData,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Choghadiya report:", error);
    throw error;
  }
};
