const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');
const { ApiClient } = require('@prokerala/api-client');

const getSadeSatiReport = async (req, res) => {
  try{
    const userId = req.params.userId;

    const {latitude, longitude, gmtOffset} = req.query;

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

    const birthDetails = {
      dateOfBirth: formatDate(user.dob),
      timeOfBirth: extractTimeOnly(user.timeOfBirth),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timeZone: gmtOffset,
      lang: "en",
    }
    //console.log('User Birth Details:', birthDetails);

    const sadeSatiInsights = await getSadeSatiInsights(birthDetails);
    //console.log('Sade Sati Insights:', sadeSatiInsights);
    return res.status(200).json({
      success: true,
      message: "Sade Sati insights retrieved successfully",
      sadeSatiInsights: sadeSatiInsights
    });
  }catch(err){
    console.error("Error fetching sadeSati insights:", err.message);
    return res.status(500).json({success:false, message:"Failed to fetch sadeSati insights",error: err.message});
  }
}

const getSadeSatiInsights = async (birthDetails) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
    const baseUrl = 'https://api.jyotishamastroapi.com/api/extended_horoscope/current_sadesati';
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
      lang: "en",
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
      throw new Error("Failed to fetch sadeSati insights");
    }
  }catch(error){
    console.error("Error fetching sadeSati insights:", error.message);
    throw new Error("Failed to fetch sadeSati insights");
  }
}

const getSadeSatiDetails = async (req, res) => {
  try{
    const userId = req.params.userId;

    const {latitude, longitude, gmtOffset} = req.query;

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
      lang: "en",
    }
    //console.log('User Birth Details:', birthDetails);

    const client = new ApiClient(CLIENT_ID, CLIENT_SECRET);
    const data = await client.get('https://api.prokerala.com/v2/astrology/sade-sati/advanced', {
        'ayanamsa': 1,
        'coordinates': `${birthDetails.latitude},${birthDetails.longitude}`,
        'datetime': `${birthDetails.dateOfBirth}T${birthDetails.timeOfBirth}:00+${birthDetails.timeZone}`
    });

    //console.log("Sade Sati Data Details:", data);
    return res.status(200).json({
      success: true,
      message: "Sade Sati details retrieved successfully",
      data: data
    });

  }catch(err){
    console.error("Error fetching sadeSati details:", err.message);
    return res.status(500).json({success:false, message:"Failed to fetch sadeSati details",error: err.message});
  }
}

module.exports ={getSadeSatiReport,getSadeSatiDetails}
