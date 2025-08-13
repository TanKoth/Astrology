import axiosInstance from ".";

export const getsadeSatiReport = async (userId, params) => {
  try {
    //console.log("Fetching Sade Sati report for userId:", userId);
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
    });
    //console.log("Query Params:", urlParams.toString());
    const response = await axiosInstance.get(
      `/api/sadeSati/${userId}?${urlParams.toString()}`
    );
    //console.log("Sade Sati report response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Sade Sati report:", error.message);
    throw error;
  }
};

export const getSadeSatiDetails = async (userId, params) => {
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
    });
    //console.log("Query Params:", urlParams.toString());
    const response = await axiosInstance.get(
      `/api/sadeSati-details/${userId}?${urlParams.toString()}`
    );
    //console.log("Sade Sati details response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Sade Sati details:", error.message);
    throw error;
  }
};
