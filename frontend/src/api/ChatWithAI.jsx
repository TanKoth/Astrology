import axiosInstance from ".";

export const sendMessageToAI = async (
  message,
  chatHistory,
  astrologyData,
  userId
) => {
  try {
    // console.log(
    //   "Sending message to AI with chatHistory and astrologyData:",
    //   message,
    //   chatHistory,
    //   astrologyData
    // );
    const response = await axiosInstance.post("/api/chat", {
      message,
      chatHistory,
      userAstrologyData: astrologyData,
      userId,
    });
    //console.log("AI response:", response.data);
    if (response.data && response.data.success) {
      return response.data.response; // Return just the text content
    } else {
      throw new Error(response.data.message || "Failed to get AI response");
    }
  } catch (err) {
    console.error("AI Chat API error:", err);
    throw err;
  }
};

export const getChatLimit = async (userId) => {
  try {
    if (!userId) {
      // Return default limit for guests
      return { success: true, chatLimit: 5 };
    }

    const response = await axiosInstance.get(`/api/chat/limit/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get chat limit error:", error);
    throw error;
  }
};

export const updateChatLimit = async (userId) => {
  try {
    const response = await axiosInstance.post(`/api/chat/limit`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Update chat limit error:", error);
    throw error;
  }
};
