import axiosInstance from ".";

export const sendMessageToAI = async (message, chatHistory, astrologyData) => {
  try {
    //console.log(
      "Sending message to AI with chatHistory and astrologyData:",
      message,
      chatHistory,
      astrologyData
    );
    const response = await axiosInstance.post("/api/chat", {
      message,
      chatHistory,
      userAstrologyData: astrologyData,
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
