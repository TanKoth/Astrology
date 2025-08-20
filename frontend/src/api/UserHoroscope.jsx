import axiosInstance from ".";

const horoscope = async (zodiac, day, year, lang = "en", endpoint) => {
  console.log(`Fetching ${endpoint} horoscope...`, zodiac, day, year, lang);
  try {
    if (endpoint === "daily") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        day,
        lang,
      });
      return response.data;
    } else if (endpoint === "yearly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        year,
        lang,
      });
      return response.data;
    } else if (endpoint === "weekly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        lang,
      });
      return response.data;
    } else if (endpoint === "monthly") {
      const response = await axiosInstance.post(`/api/horoscope/${endpoint}`, {
        zodiac,
        lang,
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

export const dailyHoroscope = async (zodiac, day, lang) => {
  return horoscope(zodiac, day, null, lang, "daily");
};
export const weeklyHoroscope = async (zodiac, lang) => {
  return horoscope(zodiac, null, null, lang, "weekly");
};

export const monthlyHoroscope = async (zodiac, lang) => {
  return horoscope(zodiac, null, null, lang, "monthly");
};

export const yearlyHoroscope = async (zodiac, year, lang) => {
  return horoscope(zodiac, null, year, lang, "yearly");
};
