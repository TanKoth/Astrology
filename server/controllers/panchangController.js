const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

// const panchangReport = async (req, res ,endpoint) => {
//   try{
//     const userId = req.params.userId;

//     const {latitude, longitude, gmtOffset} = req.query;
//     if(!userId){
//       return res.status(400).json({success: false, message: "User ID is required"});
//     }
//     if(!latitude || !longitude || !gmtOffset){
//       return res.status(400).json({success: false, message: "Latitude, Longitude and GMT Offset are required"});
//     }
//     const user = await UserDetails.findById(userId);
//     if(!user){
//       return res.status(404).json({success: false, message: "User not found"});
//     }
   
//     const formatDate = (date) => {
//       const d = new Date(date);
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, '0');
//       const day = String(d.getDate()).padStart(2, '0');
//       return `${day}/${month}/${year}`;
//     };
//     const birthDetails = {
//      // name: user.name,
//       //placeofBirth: user.placeofBirth,
//       dateOfBirth: formatDate(user.dob),
//       timeOfBirth: extractTimeOnly(user.timeOfBirth),
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//       timeZone: gmtOffset,
//       lang: "en",
//     }
//     console.log('User Birth Details:', birthDetails);
//     const panchangInsights = await getPanchangInsights(birthDetails, endpoint);
//     console.log(`${endpoint} Insights:`, panchangInsights);
//     return res.status(200).json({success: true, message: `${endpoint} insights retrieved successfully`, panchangInsights: panchangInsights});
//   }catch(error){
//     console.error(`Error fetching ${endpoint} report:`, error);
//     res.status(500).json({ success:false, message: `${endpoint} insights can not be retrieved.`, error: error.message });
//   }
// }


const panchangReport = async (date, time, latitude, longitude, gmtOffset, lang,endpoint) => {
  try{
        if(!ASTROLOGY_API_KEY){
          throw new Error("Astrology API key is not set in environment variables");
        }
        console.log("API_KEY:", ASTROLOGY_API_KEY);
        const baseUrl = `https://api.jyotishamastroapi.com/api/panchang/${endpoint}`;
        console.log("Base URL:", baseUrl);
        let timeZone = gmtOffset;
        if(timeZone.includes(':')){
          timeZone = timeZone.replace(':','.');
        }
        console.log("Timezone:", timeZone);
        const queryParams = new URLSearchParams({
          date: date,
          time: time,
          latitude: latitude,
          longitude: longitude,
          tz: timeZone,
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
          throw new Error("Failed to fetch astrology insights");
        }
      }catch(error){
        console.error("Error fetching astrology insights:", error.message);
        throw new Error("Failed to fetch astrology insights");
      }
}

const getPanchangReport = async (req, res) => {
  const { date, time, latitude, longitude, gmtOffset, lang } = req.query;
  console.log('Fetching Panchang report with params:', req.query);
  try{
    const report = await panchangReport(date, time, latitude, longitude, gmtOffset, lang, 'panchang');
    return res.status(200).json({ success: true, message: "Panchang report fetched successfully", report: report });
  }catch(error){
    console.error("Error fetching Panchang report:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch Panchang report", error: error.message });
  }
}

const getChoghadiyaMuhurat = async (req, res) => {
  const { date, time, latitude, longitude, gmtOffset, lang } = req.query;
  console.log('Fetching Choghadiya Muhurat with params:', req.query);
  try{
    const report = await panchangReport(date, time, latitude, longitude, gmtOffset, lang, 'choghadiya-muhurta');
    return res.status(200).json({ success: true, report });
  }catch(error){
    console.error("Error fetching Choghadiya Muhurat:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch Choghadiya Muhurat" });
  }
}


module.exports ={getPanchangReport, getChoghadiyaMuhurat}