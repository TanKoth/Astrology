import axiosInstance from ".";

//save user data

export const saveUserData = async (userData) => {
  console.log("Client user data :", userData);
  try {
    const response = await axiosInstance.post("/api/users/save", userData);
    console.log("User data saved successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error saving user data:", err);
    throw err;
  }
};

export const updateUserData = async (values) => {
  try {
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
