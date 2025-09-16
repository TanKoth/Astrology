const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const { ApiClient } = require('@prokerala/api-client');


const charts = async (req, res,endpoint,planet_number,planet_name) => {
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
      lang:"en",
    }
        //console.log('User Birth Details:', birthDetails);
    
    const client = new ApiClient(CLIENT_ID, CLIENT_SECRET);
    
    // Make API call for any planet
    const planetData = await client.get(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
      'ayanamsa': 1,
      'coordinates': `${birthDetails.latitude},${birthDetails.longitude}`,
      'datetime': `${birthDetails.dateOfBirth}T${birthDetails.timeOfBirth}:00+${birthDetails.timeZone}`,
      'chart_style': 'north-indian',
      planet: planet_number
    });

    // Create dynamic response based on planet
    const responseKey = `${planet_name.toLowerCase()}Data`;
    const response = {
      success: true,
      message: `${planet_name} chart details retrieved successfully`,
      [responseKey]: planetData
    };

    return res.status(200).json(response);

  }catch(err){
    console.log(`Error in creating ${planet_name} chart:`, err.message);
    return res.status(400).json({
      success: false, 
      message: `Error in creating chart for ${planet_name}`, 
      error: err.message
    });
  }
}

const getBinnashtakavargaSunChart = async (req, res) => {
  return charts(req, res, 'ashtakavarga-chart', '0',"Sun");
}

const getBinnashtakavargaMoonChart = async (req, res) => {
  return charts(req, res, 'ashtakavarga-chart', '1',"Moon");
}

module.exports = {getBinnashtakavargaSunChart, getBinnashtakavargaMoonChart }