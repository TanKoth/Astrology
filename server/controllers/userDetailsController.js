const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
require('dotenv').config();
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const encodedParams = new URLSearchParams();
const EmailHelper = require('../utils/emailHelper');
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

// const createUser = async (req, res) =>{
//   try{
//     const userExists = await UserDetails.findOne({email: req.body.email, name: req.body.name});
//     if(userExists){
//       return res.status(400).json({success:false, message: "User already exists with this email and name"});
//     }

//     // Hash the password before saving
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    
//   //Create user data with basic info
//   const userData = {
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//       placeOfBirth: req.body.placeOfBirth,
//       dob: req.body.dob,
//       timeOfBirth: req.body.timeOfBirth
//     };

//     const user = await UserDetails.create(userData);

//     // Remove password from response for security
//     const userResponse = { ...user.toObject() };
//     delete userResponse.password;

//     // Prepare location data to send back to frontend
//     const locationData = {
//       latitude: req.body.latitude,
//       longitude: req.body.longitude,
//       gmtOffset: req.body.gmtOffset
//     };

//     // If location data is provided, fetch astrology insights immediately
//     if(req.body.latitude && req.body.longitude && req.body.gmtOffset) {
//       try {
//          // Format date properly for the API
//         const formatDate = (date) => {
//           const d = new Date(date);
//           const year = d.getFullYear();
//           const month = String(d.getMonth() + 1).padStart(2, '0');
//           const day = String(d.getDate()).padStart(2, '0');
//           return `${year}/${month}/${day}`;
//         };

//         const birthDetails = {
//           dateOfBirth: formatDate(user.dob),
//           timeOfBirth: user.timeOfBirth,
//           latitude: parseFloat(req.body.latitude),
//           longitude: parseFloat(req.body.longitude),
//           timeZone: req.body.gmtOffset,
//           lang: "en",
//         };
        
//         console.log("Fetching astrology insights for new user:", birthDetails);
//         const astrologyInsights = await getAstrologyInsights(birthDetails);

//         const token = jwt.sign({UserId: user._id},process.env.SECRET_KEY, {expiresIn: '1d'});
//         console.log("Token generated for new user:", token);

//         return res.status(200).json({
//           success: true, 
//           message: "User created successfully with astrology insights", 
//           user: userResponse,
//           locationData,
//           token:token,
//           astrologyInsights
//         });
        
//       } catch (insightError) {
//         console.error("Error fetching astrology insights:", insightError);
//         // Still return user creation success even if insights fail
//         // return res.status(200).json({
//         //   success: true, 
//         //   message: "User created successfully, but astrology insights failed", 
//         //   user: userResponse,
//         //   locationData,
//         //   insightError: insightError.message
//         // });
//       }
//     }
//     return res.status(200).json({success: true, message: "User created successfully", user: userResponse, locationData, token: token});

//   }catch(error){
//     console.error("Error in createUser:", error); // Add more detailed logging
//     return res.status(400).json({success: false, message: "Error creating user", error:error.message})
//   }
// }

// //function to get astrology insights by using astrologu external API
//   const getAstrologyInsights = async (birthDetails) =>{
//     try{
//       if(!ASTROLOGY_API_KEY){
//         throw new Error("Astrology API key is not set in environment variables");
//       }
//       console.log("API_KEY:", ASTROLOGY_API_KEY);
//       const baseUrl = 'https://api.jyotishamastroapi.com/api/horoscope/planet-details';

//       let timeZone = birthDetails.timeZone;
//       if(timeZone.includes(':')){
//         timeZone = timeZone.replace(':','.');
//       }
//       console.log("Timezone:", timeZone);
//       const queryParams = new URLSearchParams({
//         date: birthDetails.dateOfBirth,
//         time: birthDetails.timeOfBirth,
//         latitude: birthDetails.latitude,
//         longitude: birthDetails.longitude,
//         tz: timeZone,
//         lang: "en",
//       });
//       console.log("Query Params:", queryParams.toString());
//       console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
//       const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
//         headers:{
//            'key': ASTROLOGY_API_KEY,
//         }
//       })

//       if(response.status === 200){
//         return response.data;
//       } else {
//         throw new Error("Failed to fetch astrology insights");
//       }
//     }catch(error){
//       console.error("Error fetching astrology insights:", error.message);
//       throw new Error("Failed to fetch astrology insights");
//     }
//   }

// // fecth user astrology details

// const getUserDetails = async(req,res) =>{
//   try{
//     const userId = req.params.userId;

//     const {latitude, longitude, gmtOffset} = req.query;
//     if(!userId){
//       return res.status(400).json({success: false, message: "User ID is required"});
//     }
//     if(!latitude || !longitude || !gmtOffset){
//       return res.status(400).json({success: false, message: "Location (lat, lng, gmtOffset) data is required"});
//     }
//     const user = await UserDetails.findById(userId);
//     if(!user){
//       return res.status(404).json({success: false, message: "User not found"});
//     }
//     // as soon as user is created we will create the user astrology insights by using user details as name, place of birth, date of birth, time of birth, latitude, longitude 
//     // Format date properly for the API
//         const formatDate = (date) => {
//           const d = new Date(date);
//           const year = d.getFullYear();
//           const month = String(d.getMonth() + 1).padStart(2, '0');
//           const day = String(d.getDate()).padStart(2, '0');
//           return `${year}/${month}/${day}`;
//         };
//     const birthDetails = {
//       //name: user.name,
//       //placeofBirth: user.placeofBirth,
//       dateOfBirth: formatDate(user.dob),
//       timeOfBirth: user.timeOfBirth,
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//       timeZone: gmtOffset,
//       lang: "en",
//     }
//     console.log("User birth details:", birthDetails);
//     // get astrology insights using birth details
//     const astrologyInsights = await getAstrologyInsights(birthDetails);
//     console.log("User astrology insights:", astrologyInsights);
//     // Generate token for user
//     const token = jwt.sign({UserId: user._id},process.env.SECRET_KEY, {expiresIn: '1d'});
//     console.log("Token generated for user:", token);
//     return res.status(200).json({success: true, message: "User details fetched successfully", astrologyInsights, token: token});
//   }catch(err){
//     return res.status(400).json({success: false, message: "Error fetching user details", error: err.message});
//   }
// }

const createUser = async (req, res) =>{
  try{
    const userExists = await UserDetails.findOne({email:req.body.email});
    if(userExists){
      return res.status(400).json({success: false, message: "User already exists with this email"});
    }
    // Hash the password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(req.body.password,saltRounds);

    const userData ={
      ...req.body,
      password: hashPassword,
      timeOfBirth: extractTimeOnly(req.body.timeOfBirth) // Ensure timeOfBirth is in HH:MM format
    }
    // create user
    const user = await UserDetails.create(userData);
    // Remove password from response for security
    const userResponse = { ...user.toObject() }; 
    delete userResponse.password;
    return res.status(200).json({success: true, message: "User created successfully", user: userResponse});
  }catch(err){
    return res.status(500).json({success: false, message: "Error creating user", error: err.message});
  }
}

const getUserDetails =async(req,res) => {
  try{
    const user = await UserDetails.findById(req.params.userId).select('-password');
    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }
    res.status(200).json({success: true, message: "User details fetched successfully", user: user});
  }catch(err){
    return res.status(500).json({success: false, message: "Error fetching user details", error: err.message});
  }
}

const updateUserDetails = async (req,res) => {
  try{
    const updateDetails = await UserDetails.findByIdAndUpdate(req.params.userId,req.body, {new: true}).select('-password');
    // const dateFormat = (date) =>{
    //   const d = new Date(date);
    //   const day = String(d.getDate()).padStart(2, '0');
    //   const month = String(d.getMonth() + 1).padStart(2, '0');
    //   const year = d.getFullYear();
    //   return `${day}-${month}-${year}`;
    // }

    const formatedCity = () => {
      const cityName = updateDetails.placeOfBirth.split(',')[0].trim();
      const city = cityName.replace(/,/g, "");
      return city
    }
    const userData = {
      name: updateDetails.name,
      birthdate: formatDate(updateDetails.dob),
      birthtime: extractTimeOnly(updateDetails.timeOfBirth),
      City: formatedCity(),
    }
    
    console.log("Fetching astrology insights for user:", userData);
    // Fetch astrology insights
    const astrologyData = await fetchData(userData);

    return res.status(200).json({success:true, message: "User details updated successfully", user: updateDetails, astrologyData: astrologyData});
  }catch(err){
    return res.status(500).json({success: false, message: "Error fetching user details", error: err.message});
  }
}

const options = {
  method: 'POST',
  url: 'https://kundli1.p.rapidapi.com/',
  headers: {
    'x-rapidapi-key': '1f3feabd46mshd3f973c25234bb8p1be3e5jsn3a22ee6cee4b',
    'x-rapidapi-host': 'kundli1.p.rapidapi.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  data: encodedParams,
};

async function fetchData(userData) {
  try {
    encodedParams.set('name', userData.name);
    encodedParams.set('birthdate', userData.birthdate);
    encodedParams.set('birthtime', userData.birthtime);
    encodedParams.set('City', userData.City);
    encodedParams.set('format', 'json');

    const response = await axios.request(options);
    console.log("Astrology data fetched successfully:", response.data);
    return {
      success: true,
      data: response.data,
      status: response.status,
      contentType: response.headers['content-type']
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error fetching astrology data", error: error.message};
  }
}


module.exports = {createUser, updateUserDetails,getUserDetails};