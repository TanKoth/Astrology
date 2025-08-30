const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const { ApiClient } = require('@prokerala/api-client');

const numerology = async(req,res,endpoint) => {
  try{
    if(endpoint == "birthday-number"){
      const userId = req.params.userId;
  
      const {latitude, longitude, gmtOffset,la} = req.query;
  
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
          la: la || "en",
        }
        //console.log('User Birth Details:', birthDetails);
    
        const client = new ApiClient(CLIENT_ID, CLIENT_SECRET);
        
          const data = await client.get(`https://api.prokerala.com/v2/numerology/${endpoint}`, {
            // 'ayanamsa': 1,
            // 'coordinates': `${birthDetails.latitude},${birthDetails.longitude}`,
            'datetime': `${birthDetails.dateOfBirth}T${birthDetails.timeOfBirth}:00+${birthDetails.timeZone}`,
            // 'la': birthDetails.la
        });

        console.log("Birthday Number Data Details:", data);
        return res.status(200).json({
          success: true,
          message: "Birthday number details retrieved successfully",
          data: data
        });
      }else if(endpoint == "numerology"){
        const userId = req.params.userId;

        const {name,lang} = req.query;
        if(!userId){
          return res.status(400).json({success: false, message: "User ID is required"});
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
          name: name,
          dateOfBirth: formatDate(user.dob),
          lang: lang || "en",
        }
        const numerologyReport = await getNumerologyReport(birthDetails, endpoint);
        return res.status(200).json({
          success: true,
          message: "Numerology details retrieved successfully",
          numerologyReport: numerologyReport
        });
      }
      
  
    }catch(err){
      console.error(`Error fetching ${endpoint} details:`, err.message);
      return res.status(500).json({success:false, message:`Failed to fetch ${endpoint} details`,error: err.message});
    }
}



// const allNumerologyReports = async (req, res, apiEndPoint, suggestionType) => {
//   try{
//     const userId = req.params.userId;

//     const {latitude, longitude, gmtOffset,lang} = req.query;
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
//       return `${year}/${month}/${day}`;
//     };
//     const birthDetails = {
//      // name: user.name,
//       //placeofBirth: user.placeofBirth,
//       dateOfBirth: formatDate(user.dob),
//       timeOfBirth: extractTimeOnly(user.timeOfBirth),
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//       timeZone: gmtOffset,
//       lang: lang || "en",
//     }
//     //console.log('User Birth Details:', birthDetails);
//       const gemstoneReport = await getReport(birthDetails,apiEndPoint);
//       //console.log(` ${suggestionType} Report:', gemstoneReport`);
//       res.status(200).json({success: true, message: `Report for ${suggestionType} retrieved successfully`, gemstoneReport: gemstoneReport});
//   }catch(err){
//     //console.log(`Error in creating ${suggestionType}:`, err.message);
//     res.status(400).json({success: false, message: `Error in creating report for ${suggestionType}`, error: err.message});
//   }
// }

const getNumerologyReport = async (birthDetails, endpoint) =>{
  try{
    if(!ASTROLOGY_API_KEY){
      throw new Error("Astrology API key is not set in environment variables");
    }
    //console.log("API_KEY:", ASTROLOGY_API_KEY);
      const baseUrl = `https://api.jyotishamastroapi.com/api/prediction/${endpoint}`;
      //console.log("Base URL:", baseUrl);
      
      //console.log("Timezone:", timeZone);
      const queryParams = new URLSearchParams({
        date: birthDetails.dateOfBirth,
        name: birthDetails.name,
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
        throw new Error("Failed to fetch numerology reports");
      }
  }catch(error){
    console.error("Error fetching numerology reports:", error.message);
    throw new Error("Failed to fetch numerology reports");
  }
}

const getBirthdayNumber = async(req,res) => {
  return numerology(req,res,"birthday-number");
}

const getAllNumerology = async (req, res) => {
  return numerology(req, res, 'numerology');
}


module.exports = {getBirthdayNumber, getAllNumerology}
