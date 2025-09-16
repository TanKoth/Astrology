const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const tableData = async (req, res,apiEndPoint, planet_name) => {
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
      dateOfBirth: formatDate(user.dob),
      timeOfBirth: extractTimeOnly(user.timeOfBirth),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timeZone: gmtOffset,
      lang: lang || "en",
    }
    //console.log('User Birth Details:', birthDetails);
      const apiResponse = await getTableData(birthDetails,apiEndPoint, planet_name);
      //console.log(`${planet_name} API Response:`, apiResponse);
      
      // Extract the table data from the API response
      const tableData = apiResponse.binnashtakavargaTable || apiResponse.data || apiResponse;
      
      res.status(200).json({
        success: true, 
        message: `Report for ${planet_name} retrieved successfully`, 
        binnashtakavargaTable: tableData
      });
  }catch(err){
    res.status(400).json({success: false, message: `Error in creating report for ${planet_name}`, error: err.message});
  }
}

const getTableData = async (birthDetails, endpoint, planet_name) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    
    const baseUrl = `https://api.jyotishamastroapi.com/api/horoscope/${endpoint}`;
    let timeZone = birthDetails.timeZone;
    if(timeZone.includes(':')){
      timeZone = timeZone.replace(':','.');
    }
    
    const queryParams = new URLSearchParams({
      date: birthDetails.dateOfBirth,
      time: birthDetails.timeOfBirth,
      latitude: birthDetails.latitude,
      longitude: birthDetails.longitude,
      tz: timeZone,
      lang: birthDetails.lang,
      planet: planet_name,
    });
    
    //console.log(`Making API call for ${planet_name}:`, `${baseUrl}?${queryParams.toString()}`);
    
    const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
      headers:{
          'key': ASTROLOGY_API_KEY,
      }
    });

    if(response.status === 200){
      //console.log(`${planet_name} Table API Response:`, response.data);
      return response.data;
    } else {
      throw new Error(`Failed to fetch ${planet_name} table data`);
    }
    
  }catch(error){
    console.error(`Error fetching ${planet_name} table data:`, error.message);
    throw new Error(`Failed to fetch ${planet_name} table data`);
  }
}

const getBinnashtakavargaSunTable= async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Sun");
}

const getBinnashtakavargaMoonTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Moon");
}

const getBinnashtakavargaMarsTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Mars");
}

const getBinnashtakavargaMercuryTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Mercury");
}
const getBinnashtakavargaJupiterTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Jupiter");
}
const getBinnashtakavargaVenusTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Venus");
}
const getBinnashtakavargaSaturnTable = async (req, res) => {
  return tableData(req, res, 'binnashtakvarga', "Saturn");
}

module.exports = {getBinnashtakavargaSunTable,getBinnashtakavargaMoonTable,getBinnashtakavargaMarsTable,getBinnashtakavargaMercuryTable,getBinnashtakavargaJupiterTable,getBinnashtakavargaVenusTable,getBinnashtakavargaSaturnTable}