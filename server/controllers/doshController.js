const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const { ApiClient } = require('@prokerala/api-client');

const dosh = async (req, res,apiEndPoint, suggestionType) => {
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
    if(apiEndPoint === "pitra-dosh"){
      const pitraDosh = await getDosh(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', gemstoneReport`);
      res.status(200).json({success: true, message: `Dosh for ${suggestionType} retrieved successfully`, pitraDosh: pitraDosh});
    }else if(apiEndPoint === "kaalsarp-dosh"){
      const kaalsarpDosh = await getDosh(birthDetails,apiEndPoint);
      //console.log(` ${suggestionType} Report:', gemstoneReport`);
      res.status(200).json({success: true, message: `Dosh for ${suggestionType} retrieved successfully`, kaalsarpDosh: kaalsarpDosh});
    }
  }catch(err){
    //console.log(`Error in creating ${suggestionType}:`, err.message);
    res.status(400).json({success: false, message: `Error in creating dosh for ${suggestionType}`, error: err.message});
  }
}

const getDosh = async (birthDetails, endpoint) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
    if(endpoint === "pitra-dosh"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/dosha/${endpoint}`;
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
        throw new Error("Failed to fetch dosh for pitra dosh");
      }
    }else if(endpoint === "kaalsarp-dosh"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/dosha/${endpoint}`;
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
        throw new Error("Failed to fetch dosh for kaalsarp dosh");
      }
    }
  }catch(error){
    console.error("Error fetching reports:", error.message);
    throw new Error("Failed to fetch dosh");
  }
}

const getPitraDosh = async (req, res) => {
  return dosh(req, res, 'pitra-dosh', "Pitra Dosh");
}

const getKaalsarpDosh = async (req, res) => {
  return dosh(req, res, 'kaalsarp-dosh', "Kaalsarp Dosh");
}

const getMangalDosh = async (req, res) => {
  try{
    const userId = req.params.userId;

    const {latitude, longitude, gmtOffset, lang} = req.query;

    if(!userId){
      return res.status(400).json({success:false, message:"User ID is required"});
    }
    if(!latitude || !longitude || !gmtOffset){
      return res.status(400).json({success:false, message:"Latitude, Longitude and GMT Offset are required"});
    }

    const user = await UserDetails.findById(userId);
    if(!user){
      return res.status(404).json({success:false, message:"User not found"});
    }

    const dateFormat = (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    }

    
    const birthDetails = {
      dateOfBirth: dateFormat(user.dob),
      timeOfBirth: extractTimeOnly(user.timeOfBirth),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timeZone: gmtOffset,
      lang: lang || "en",
    }
    //console.log('User Birth Details:', birthDetails);

    const client = new ApiClient(CLIENT_ID, CLIENT_SECRET);
    const mangalDosh = await client.get('https://api.prokerala.com/v2/astrology/mangal-dosha/advanced', {
        'ayanamsa': 1,
        'coordinates': `${birthDetails.latitude},${birthDetails.longitude}`,
        'datetime': `${birthDetails.dateOfBirth}T${birthDetails.timeOfBirth}:00+${birthDetails.timeZone}`,
        'la': birthDetails.lang
    });

    //console.log("Sade Sati Data Details:", data);
    return res.status(200).json({
      success: true,
      message: "Mangal retrieved successfully",
      mangalDosh: mangalDosh
    });

  }catch(err){
    console.error("Error fetching mangal details:", err.message);
    return res.status(500).json({success:false, message:"Failed to fetch mangal details",error: err.message});
  }
}

module.exports = {getPitraDosh,getKaalsarpDosh,getMangalDosh}