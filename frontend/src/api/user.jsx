import axiosInstance from ".";

//save user data

export const saveUserData = async (userData) => {
  console.log("Saving user data before formatting", userData);
  const formattedUserData = {
    ...userData,
    dob: userData.dob ? userData.dob.format("YYYY-MM-DD") : null, // Convert to date string
    timeOfBirth: userData.timeOfBirth
      ? userData.timeOfBirth.format("HH:mm")
      : null, // Convert to time string
  };
  console.log("Client user data :", formattedUserData);
  try {
    const response = await axiosInstance.post(
      "/api/users/save",
      formattedUserData
    );
    console.log("User data saved successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error saving user data:", err);
    throw err;
  }
};

export const updateUserData = async (values) => {
  try {
    // const formattedUserData = {
    //   ...userData,
    //   dob: userData.dob ? userData.dob.format("YYYY-MM-DD") : null, // Convert to date string
    //   timeOfBirth: userData.timeOfBirth
    //     ? userData.timeOfBirth.format("HH:mm")
    //     : null, // Convert to time string
    // };
    console.log("Updating user data with values:", values);
    const response = await axiosInstance.put(
      "/api/users/update/" + values.userId,
      values
    );
    console.log("User data updated successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating user data:", err);
    throw err;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/details/${userId}`);
    console.log("User details fetched successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};

//fetch user astrology insights

// export const getUserInsights = async (userId, locationData) => {
//   console.log("Fetching user insights for userId:", userId);
//   console.log("Location Data:", locationData);
//   try {
//     const queryParams = new URLSearchParams({
//       latitude: locationData.latitude,
//       longitude: locationData.longitude,
//       gmtOffset: locationData.gmtOffset,
//     });
//     const response = await axiosInstance.get(
//       `/api/users/details/${userId}?${queryParams.toString()}`
//     );
//     console.log("User insights fetched successfully:", response.data);
//     return response.data;
//   } catch (err) {
//     console.log("Error fetching user insights:", err);
//     throw err;
//   }
// };
