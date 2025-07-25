import axiosInstance from ".";

export const saveContactUsForm = async (value) => {
  try {
    console.log("Saving contactUs form with data:", value);

    const response = await axiosInstance.post("/api/contactUs/create", value);
    console.log("ContactUs form saved successfully:", response.data);
    return response.data;
  } catch (err) {
    console.log("Error saving contactUs form:", err);
    throw err;
  }
};
