import axiosInstance from ".";

export const getDashaReport = async (userId, params) => {
  //console.log("Fetching user report for userId:", userId);
  //console.log("Params received:", params);
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
      la: params.la || "en",
    });
    //console.log("Query Params:", urlParams.toString());
    const response = await axiosInstance.get(
      `/api/dasha/dasha-periods/${userId}?${urlParams.toString()}`
    );
    //console.log("Dasha details response:", response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching Dasha details:", error.message);
    throw error;
  }
};

// export const getDashaReport = async (userId, params) => {
//   return getDasha(userId, params, "dasha-periods");
// };
