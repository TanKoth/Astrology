import axiosInstance from ".";

// export const userLogin = async (data) => {
//   try {
//     const response = await axiosInstance.post("/api/user/login", data);
//     if (response.status === 200) {
//       console.log("User logged in successfully:", response.data);
//       return response.data;
//     } else {
//       console.error("Login failed:", response.data);
//       throw new Error(response.data.message || "Login failed");
//     }
//   } catch (err) {
//     console.error("Error during user login:", err);
//     throw new Error("Login failed");
//   }
// };

export const userLogin = async (values) => {
  try {
    console.log("Login API called with values:", values);
    const response = await axiosInstance.post("/api/user/login", values);
    return response.data; // Return data from the response
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error; // Re-throw the error for handling in components
  }
};

export const forgotPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/user/forgotpassword",
      value
    );
    if (response.status === 200) {
      console.log("Forgot password email sent successfully:", response.data);
      return response.data;
    } else {
      console.error("Forgot password failed:", response.data);
      throw new Error(response?.data?.message || "Forgot password failed");
    }
  } catch (err) {
    console.error("Error during forgot password:", err);
    throw new Error("Forgot password failed");
  }
};

export const resetPassword = async (value, id) => {
  try {
    const response = await axiosInstance.patch(
      `/api/user/resetpassword/${id}`,
      value
    );
    if (response.status === 200) {
      console.log("Password reset successfully:", response.data);
      return response.data;
    } else {
      console.error("Password reset failed:", response.data);
      throw new Error(response.data.message || "Password reset failed");
    }
  } catch (err) {
    console.error("Error during password reset:", err);
    throw new Error("Password reset failed");
  }
};
