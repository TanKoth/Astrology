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

//fetch user astrology insights

export const getUserInsights = async (userId) => {
  console.log("Fetching user insights for userId:", userId);
  try {
    const response = await axiosInstance.get(
      `/api/users/details?userId=${userId}`
    );
    console.log("User insights fetched successfully:", response.data);
    return response.data;
  } catch (err) {
    console.log("Error fetching user insights:", err);
    throw err;
  }
};
