const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const report = async (req, res,apiEndPoint, suggestionType) => {
  try{
    const userId = req.params.userId;

    const {latitude, longitude, gmtOffset,lang} = req.query;
    if(!userId){
      return res.status(400).json({success: false, message: "User ID is required"});
    }
    if(!latitude || !longitude || !gmtOffset){
      return res.status(400).json({success: false, message: "Latitude, Longitude and GMT Offset are required"});
    }
    const user = await UserDetails.findById(userId);
    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }
   
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    };
    const birthDetails = {
     // name: user.name,
      //placeofBirth: user.placeofBirth,
      dateOfBirth: formatDate(user.dob),
      timeOfBirth: extractTimeOnly(user.timeOfBirth),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timeZone: gmtOffset,
      lang: lang || "en",
    }
    //console.log('User Birth Details:', birthDetails);
    if(apiEndPoint === "gem_suggestion"){
      const gemstoneReport = await getReport(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', gemstoneReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, gemstoneReport: gemstoneReport});
    }else if(apiEndPoint === "rudraksh_suggestion"){
      const rudrakshReport = await getReport(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', rudrakshReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, rudrakshReport: rudrakshReport});
    }else if(apiEndPoint === "planets_kp"){
      const planetsKpReport = await getReport(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', planetsKpReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, planetsKpReport: planetsKpReport});
    }

  }catch(err){
    //console.log(`Error in creating ${suggestionType}:`, err.message);
    res.status(400).json({success: false, message: `Error in creating report for ${suggestionType}`, error: err.message});
  }
}

const getReport = async (birthDetails, endpoint) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
    if(endpoint === "gem_suggestion"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/extended_horoscope/${endpoint}`;
      //console.log("Base URL:", baseUrl);
      let timeZone = birthDetails.timeZone;
      if(timeZone.includes(':')){
        timeZone = timeZone.replace(':','.');
      }
      //console.log("Timezone:", timeZone);
      const queryParams = new URLSearchParams({
        date: birthDetails.dateOfBirth,
        time: birthDetails.timeOfBirth,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        tz: timeZone,
        lang: birthDetails.lang,
      });
      //console.log("Query Params:", queryParams.toString());
      //console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error("Failed to fetch gemstone reports");
      }
    }else if(endpoint === "rudraksh_suggestion"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/extended_horoscope/${endpoint}`;
      //console.log("Base URL:", baseUrl);
      let timeZone = birthDetails.timeZone;
      if(timeZone.includes(':')){
        timeZone = timeZone.replace(':','.');
      }
      //console.log("Timezone:", timeZone);
      const queryParams = new URLSearchParams({
        date: birthDetails.dateOfBirth,
        time: birthDetails.timeOfBirth,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        tz: timeZone,
        lang: birthDetails.lang,
      });
      //console.log("Query Params:", queryParams.toString());
      //console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error("Failed to fetch Rudraksh reports");
      }
    }else if(endpoint === "planets_kp"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/extended_horoscope/${endpoint}`;
      //console.log("Base URL:", baseUrl);
      let timeZone = birthDetails.timeZone;
      if(timeZone.includes(':')){
        timeZone = timeZone.replace(':','.');
      }
      //console.log("Timezone:", timeZone);
      const queryParams = new URLSearchParams({
        date: birthDetails.dateOfBirth,
        time: birthDetails.timeOfBirth,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        tz: timeZone,
        lang: birthDetails.lang,
      });
      //console.log("Query Params:", queryParams.toString());
      //console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
        headers:{
            'key': ASTROLOGY_API_KEY,
        }
      })

      if(response.status === 200){
        return response.data;
      } else {
        throw new Error("Failed to fetch Planet KP reports");
      }
    }
    
  }catch(error){
    console.error("Error fetching reports:", error.message);
    throw new Error("Failed to fetch reports");
  }
}

const getGemstoneReport = async (req, res) => {
  return report(req, res, 'gem_suggestion', "Gemstone Suggestion");
}

const getRudrakshReport = async (req, res) => {
  return report(req, res, 'rudraksh_suggestion', "Rudraksh Suggestion");
}

const getPlanetKpReport = async (req, res) => {
  return report(req, res, 'planets_kp', "Planet KP");
}

module.exports = {getGemstoneReport,getRudrakshReport,getPlanetKpReport}