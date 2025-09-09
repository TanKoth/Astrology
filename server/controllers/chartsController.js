const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const { ApiClient } = require('@prokerala/api-client');


const charts = async (req, res,endpoint) => {
  try{
    if(endpoint == "sarvashtakavarga-chart"){
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
        lang:"en",
      }
          //console.log('User Birth Details:', birthDetails);
      
      const client = new ApiClient(CLIENT_ID, CLIENT_SECRET);
      
        const data = await client.get(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
          'ayanamsa': 1,
          'coordinates': `${birthDetails.latitude},${birthDetails.longitude}`,
          'datetime': `${birthDetails.dateOfBirth}T${birthDetails.timeOfBirth}:00+${birthDetails.timeZone}`,
          'chart_style': 'north-indian',
      });

      // console.log("Sarvashtakavarga Chart Data Details:", data);
      return res.status(200).json({
        success: true,
        message: "Sarvashtakavarga Chart details retrieved successfully",
        data: data
      });
    }else {
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
      const charts = await getCharts(birthDetails, endpoint);
      //console.log(` ${suggestionType} Report:', gemstoneReport`);
      return res.status(200).json({success: true, message: `Report for ${endpoint} retrieved successfully`, charts: charts});  
  } 
  }catch(err){
    //console.log(`Error in creating ${suggestionType}:`, err.message);
    return res.status(400).json({success: false, message: `Error in creating report for ${endpoint}`, error: err.message});
  }
}

const getCharts = async (birthDetails, endpoint) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    if(endpoint === "ashtakvarga_chart"){
      const baseUrl = `https://api.jyotishamastroapi.com/api/horoscope/${endpoint}`;
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
        style: "north",
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
        throw new Error(`Failed to fetch ${endpoint} chart`);
      }
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
      const baseUrl = `https://api.jyotishamastroapi.com/api/chart_image/${endpoint}`;
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
        style: "north",
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
        throw new Error(`Failed to fetch ${endpoint} chart`);
      }
  }catch(error){
    console.error(`Error fetching ${endpoint} chart:`, error.message);
    throw new Error(`Failed to fetch ${endpoint} chart`);
  }
}

const getBhavChalitChart = async (req, res) => {
  return charts(req, res, 'bhav_chalit_chart');
}

const getD1Chart = async (req, res) => {
  return charts(req, res, 'd1');
}

const getD3Chart = async (req, res) => {
  return charts(req, res, 'd3');
}

const getD4Chart = async (req, res) => {
  return charts(req, res, 'd4');
}

const getD6Chart = async (req, res) => {
  return charts(req, res, 'd6');
}

const getD7Chart = async (req, res) => {
  return charts(req, res, 'd7');
}

const getD8Chart = async (req, res) => {
  return charts(req, res, 'd8');
}

const getD9Chart = async (req, res) => {
  return charts(req, res, 'd9');
}

const getD10Chart = async (req, res) => {
  return charts(req, res, 'd10');
}

const getD12Chart = async (req, res) => {
  return charts(req, res, 'd12');
}

const getD16Chart = async (req, res) => {
  return charts(req, res, 'd16');
}

const getD20Chart = async (req, res) => {
  return charts(req, res, 'd20');
}

const getD24Chart = async (req, res) => {
  return charts(req, res, 'd24');
}

const getD27Chart = async (req, res) => {
  return charts(req, res, 'd27');
}

const getD30Chart = async (req, res) => {
  return charts(req, res, 'd30');
}

const getD40Chart = async (req, res) => {
  return charts(req, res, 'd40');
}

const getD45Chart = async (req, res) => {
  return charts(req, res, 'd45');
}

const getD60Chart = async (req, res) => {
  return charts(req, res, 'd60');
}

const getMoonChart = async (req, res) => {
  return charts(req, res, 'moon');
}

const getSarvashtakavargaChart = async (req, res) => {
  return charts(req, res, 'sarvashtakavarga-chart');
}

module.exports = {getBhavChalitChart, getD1Chart, getD3Chart, getD4Chart, getD6Chart, getD7Chart, getD8Chart, getD9Chart, getD10Chart, getD12Chart, getD16Chart, getD20Chart, getD24Chart, getD27Chart, getD30Chart, getD40Chart, getD45Chart, getD60Chart, getMoonChart, getSarvashtakavargaChart};