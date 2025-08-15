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
