const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
require('dotenv').config();
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const encodedParams = new URLSearchParams();
const EmailHelper = require('../utils/emailHelper');
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');



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
    // get the current user data 
    const currentUser = await UserDetails.findById(req.params.userId);
    if (!currentUser) {
      return res.status(404).json({success: false, message: "User not found"});
    }
    const updateDetails = await UserDetails.findByIdAndUpdate(req.params.userId,req.body, {new: true}).select('-password');

   const formatedCity = () => {
      try {
        const placeOfBirth = updateDetails.placeOfBirth || currentUser.placeOfBirth;
        if (!placeOfBirth) {
          throw new Error("Place of birth is required for astrology insights");
        }
        const cityName = placeOfBirth.split(',')[0].trim();
        const city = cityName.replace(/,/g, "");
        return city;
      } catch (error) {
        console.error("Error formatting city:", error);
        return null;
      }
    }

    const city = formatedCity();
    if (!city) {
      return res.status(400).json({
        success: false, 
        message: "Valid place of birth is required for astrology insights"
      });
    }

    // Ensure we have all required fields for astrology API
    const userData = {
      name: updateDetails.name || currentUser.name,
      birthdate: formatDate(updateDetails.dob || currentUser.dob),
      birthtime: extractTimeOnly(updateDetails.timeOfBirth || currentUser.timeOfBirth),
      City: city,
    }

    // Validate required fields
    if (!userData.name || !userData.birthdate || !userData.birthtime || !userData.City) {
      return res.status(400).json({
        success: false, 
        message: "Missing required fields for astrology insights: name, dob, timeOfBirth, placeOfBirth"
      });
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