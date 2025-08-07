const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const moonPrediction = async (req, res) => {
  try{
    const userId = req.params.userId;

    const {latitude, longitude, gmtOffset} = req.query;
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
      lang: "en",
    }
    console.log('User Birth Details:', birthDetails);
    const astrologyInsights = await getAstrologyInsights(birthDetails);
    console.log('Astrology Insights:', astrologyInsights);
    res.status(200).json({success: true, message: 'Astrology insights for moon prediction retrieved successfully', astrologyInsights: astrologyInsights});

  }catch(err){
    console.log('Error in creating moon prediction:', err.message);
    res.status(400).json({success: false, message: 'Error in creating Astrology insights for moon prediction'});
  }
}

const getAstrologyInsights = async (birthDetails) =>{
    try{
      if(!ASTROLOGY_API_KEY){
        throw new Error("Astrology API key is not set in environment variables");
      }
      console.log("API_KEY:", ASTROLOGY_API_KEY);
      const baseUrl = 'https://api.jyotishamastroapi.com/api/prediction/moon';

      let timeZone = birthDetails.timeZone;
      if(timeZone.includes(':')){
        timeZone = timeZone.replace(':','.');
      }
      console.log("Timezone:", timeZone);
      const queryParams = new URLSearchParams({
        date: birthDetails.dateOfBirth,
        time: birthDetails.timeOfBirth,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        tz: timeZone,
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
        throw new Error("Failed to fetch astrology insights");
      }
    }catch(error){
      console.error("Error fetching astrology insights:", error.message);
      throw new Error("Failed to fetch astrology insights");
    }
  }

  module.exports ={moonPrediction};