const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const matchingReport = async (boyNakshatra, girlNakshatra, boy_dob,
      boy_tob,
      boy_lat,
      boy_lon,
      boy_tz,
      girl_dob,
      girl_tob,
      girl_lat,
      girl_lon,
      girl_tz, lang,endpoint) => {
  try{
        if(!ASTROLOGY_API_KEY){
          throw new Error("Astrology API key is not set in environment variables");
        }
        console.log("API_KEY:", ASTROLOGY_API_KEY);
        if(endpoint === "nakshatra-match"){
          const baseUrl = `https://api.jyotishamastroapi.com/api/matching/${endpoint}`;
          console.log("Base URL:", baseUrl);
          
          const queryParams = new URLSearchParams({
            boy_nakshatra: boyNakshatra,
            girl_nakshatra: girlNakshatra,
            lang: lang || 'en',
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
            throw new Error("Failed to fetch nakshatra matching insights");
          }
        }else if(endpoint === "ashtakoot-astro"){
          const baseUrl = `https://api.jyotishamastroapi.com/api/matching/${endpoint}`;
          console.log("Base URL:", baseUrl);
        
          let boyTimeZone = boy_tz;
          if(boyTimeZone.includes(':')){
            boyTimeZone = boyTimeZone.replace(':','.');
          }

          let girlTimeZone = girl_tz;
          if(girlTimeZone.includes(':')){
            girlTimeZone = girlTimeZone.replace(':','.');
          }
          
          const queryParams = new URLSearchParams({
            boy_dob: boy_dob,
            boy_tob: boy_tob,
            boy_lat: boy_lat,
            boy_lon: boy_lon,
            boy_tz: boyTimeZone,
            girl_dob: girl_dob,
            girl_tob: girl_tob,
            girl_lat: girl_lat,
            girl_lon: girl_lon,
            girl_tz: girlTimeZone,
            lang: lang || 'en',
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
            throw new Error("Failed to fetch matching insights");
          }
        }
        
      }catch(error){
        console.error("Error fetching matching insights:", error.message);
        throw new Error("Failed to fetch matching insights");
      }
}

const getNakshatraMatching = async (req, res) => {
  const { boyNakshatra, girlNakshatra, lang } = req.query;
  console.log('Fetching Nakshatra Matching report with params:', req.query);
  try{
    const report = await matchingReport(boyNakshatra, girlNakshatra,null,null,null,null,null,null,null,null,null,null, lang, 'nakshatra-match');
    return res.status(200).json({ success: true, message: "Nakshatra Matching report fetched successfully", report: report });
  }catch(error){
    console.error("Error fetching Nakshatra Matching report:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch Nakshatra Matching report", error: error.message });
  }
}

const getMatching = async (req, res) => {
  const { boy_dob,
        boy_tob,
        boy_lat,
        boy_lon,
        boy_tz,
        girl_dob,
        girl_tob,
        girl_lat,
        girl_lon,
        girl_tz,
        lang } = req.query;
  console.log('Fetching Matching report with params:', req.query);
  try {
    const report = await matchingReport(null, null,
      boy_dob,
      boy_tob,
      boy_lat,
      boy_lon,
      boy_tz,
      girl_dob,
      girl_tob,
      girl_lat,
      girl_lon,
      girl_tz,
    lang, "ashtakoot-astro");
    return res.status(200).json({ success: true, message: "Matching report fetched successfully", report: report });
  } catch (error) {
    console.error("Error fetching Matching report:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch Matching report", error: error.message });
  }
}

module.exports = { getNakshatraMatching, getMatching };