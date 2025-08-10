import axiosInstance from ".";

const horoscope = async (zodiac, day, year, endpoint) => {
  console.log(`Fetching ${endpoint} horoscope...`, zodiac, day, year);
  try {
    if (endpoint === "daily") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        day,
      });
      return response.data;
    } else if (endpoint === "yearly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        year,
      });
      return response.data;
    } else if (endpoint === "weekly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
      });
      return response.data;
    } else if (endpoint === "monthly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
      });
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint} horoscope:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export const dailyHoroscope = async (zodiac, day) => {
  return horoscope(zodiac, day, null, "daily");
};
export const weeklyHoroscope = async (zodiac) => {
  return horoscope(zodiac, null, null, "weekly");
};

export const monthlyHoroscope = async (zodiac) => {
  return horoscope(zodiac, null, null, "monthly");
};

export const yearlyHoroscope = async (zodiac, year) => {
  return horoscope(zodiac, null, year, "yearly");
};
