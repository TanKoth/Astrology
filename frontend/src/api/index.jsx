import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:8081", // Adjust the base URL to your server's address
  baseURL: "https://vedic-vedang-ai.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
