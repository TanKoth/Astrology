const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const lalkitab = async (req, res,apiEndPoint, suggestionType) => {
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
    if(apiEndPoint === "debts"){
      const lalkitabDebt = await getLalkitab(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', gemstoneReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, lalkitabDebt: lalkitabDebt});
    }else if(apiEndPoint === "remedies"){
      const lalkitabRemedies = await getLalkitab(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', rudrakshReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, lalkitabRemedies: lalkitabRemedies});
    }else if(apiEndPoint === "houses"){
      const lalkitabHouses = await getLalkitab(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', planetsKpReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, lalkitabHouses: lalkitabHouses});
    }else if(apiEndPoint === "planets"){
      const lalkitabPlanets = await getLalkitab(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', planetsKpReport`);
      res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, lalkitabPlanets: lalkitabPlanets});
    }

  }catch(err){
    //console.log(`Error in creating ${suggestionType}:`, err.message);
    res.status(400).json({success: false, message: `Error in creating report for ${suggestionType}`, error: err.message});
  }
}

const getLalkitab = async (birthDetails, endpoint) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
    if(endpoint === "debts"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/lalKitab/${endpoint}`;
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
        throw new Error("Failed to fetch lalkitab debts");
      }
    }else if(endpoint === "remedies"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/lalKitab/${endpoint}`;
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
        throw new Error("Failed to fetch lalkitab remedies");
      }
    }else if(endpoint === "houses"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/lalKitab/${endpoint}`;
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
        throw new Error("Failed to fetch lalkitab houses");
      }
    }else if(endpoint === "planets"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/lalKitab/${endpoint}`;
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
        throw new Error("Failed to fetch lalkitab planets");
      }
    }
    
  }catch(error){
    console.error("Error fetching lalkitab reports:", error.message);
    throw new Error("Failed to fetch lalkitab reports");
  }
}

const getLalkitabDebts = async (req, res) => {
  return lalkitab(req, res, 'debts', "Lalkitab Debts");
}

const getLalkitabRemedies = async (req, res) => {
  return lalkitab(req, res, 'remedies', "Lalkitab Remedies");
}

const getLalkitabPlanets = async (req, res) => {
  return lalkitab(req, res, 'planets', "Lalkitab Planets");
}

const getLalkitabHouses = async (req, res) => {
  return lalkitab(req, res, 'houses', "Lalkitab Houses");
}

module.exports = {getLalkitabDebts,getLalkitabRemedies,getLalkitabPlanets,getLalkitabHouses}