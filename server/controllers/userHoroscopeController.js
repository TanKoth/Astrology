const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;


const horoscope = async (endpoint, zodiac, day,year) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    console.log("API_KEY:", ASTROLOGY_API_KEY);
    if(endpoint === "daily"){
        const baseUrl = `https://api.jyotishamastroapi.com/api/prediction/${endpoint}`;
        console.log("Base URL:", baseUrl);
        const queryParams = new URLSearchParams({
        zodiac: zodiac,
        day: day,
        lang: "en",
      });
      console.log("Query Params:", queryParams.toString());
      console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error(`Failed to fetch astrology ${endpoint} horoscope`);
      }
    }else if(endpoint === "weekly"){
        const baseUrl = `https://api.jyotishamastroapi.com/api/prediction/${endpoint}`;
        console.log("Base URL:", baseUrl);
        const queryParams = new URLSearchParams({
        zodiac: zodiac,
        lang: "en",
      });
      console.log("Query Params:", queryParams.toString());
      console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error(`Failed to fetch astrology ${endpoint} horoscope`);
      }
    }else if(endpoint === "monthly"){
        const baseUrl = `https://api.jyotishamastroapi.com/api/prediction/${endpoint}`;
        console.log("Base URL:", baseUrl);
        const queryParams = new URLSearchParams({
        zodiac: zodiac,
        lang: "en",
      });
      console.log("Query Params:", queryParams.toString());
      console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error(`Failed to fetch astrology ${endpoint} horoscope`);
      }
    }else if(endpoint === "yearly"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/prediction/${endpoint}`;
        console.log("Base URL:", baseUrl);
        const queryParams = new URLSearchParams({
        zodiac: zodiac,
        year: year,
        lang: "en",
      });
      console.log("Query Params:", queryParams.toString());
      console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error(`Failed to fetch astrology ${endpoint} horoscope`);
      }
    }
    
  }catch(error){
    console.error("Error fetching astrology horoscope insights:", error.message);
    throw new Error("Failed to fetch astrology horoscope insights");
  }
}

const dailyHoroscope = async (req, res) => {
  const { zodiac, day } = req.body;

  try {
    const dailyHoroscopeData = await horoscope("daily", zodiac, day,null);
    res.status(200).json({ success: true, message: "Daily horoscope fetched successfully", data: dailyHoroscopeData });
  } catch (error) {
    console.error("Error fetching daily horoscope:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch daily horoscope", error: error.message });
  }
}

const weeklyHoroscope = async (req, res) => {
  const { zodiac } = req.body;

  try {
    const weeklyHoroscopeData = await horoscope("weekly", zodiac,null,null);
    res.status(200).json({ success: true, message: "Weekly horoscope fetched successfully", data: weeklyHoroscopeData });
  } catch (error) {
    console.error("Error fetching weekly horoscope:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch weekly horoscope", error: error.message });
  }
}

const monthlyHoroscope = async (req, res) => {
  const { zodiac } = req.body;

  try {
    const monthlyHoroscopeData = await horoscope("monthly", zodiac,null,null);
    res.status(200).json({ success: true, message: "Monthly horoscope fetched successfully", data: monthlyHoroscopeData });
  } catch (error) {
    console.error("Error fetching monthly horoscope:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch monthly horoscope", error: error.message });
  }
}

const yearlyHoroscope = async (req, res) => {
  const { zodiac, year } = req.body;

  try {
    const yearlyHoroscopeData = await horoscope("yearly", zodiac, null, year);
    res.status(200).json({ success: true, message: "Yearly horoscope fetched successfully", data: yearlyHoroscopeData });
  } catch (error) {
    console.error("Error fetching yearly horoscope:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch yearly horoscope", error: error.message });
  }
}

module.exports = { dailyHoroscope, weeklyHoroscope, monthlyHoroscope, yearlyHoroscope };