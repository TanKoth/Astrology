const UserDetails = require('../models/userDetailsModel');

const createUser = async (req, res) =>{
  try{
    const userExists = await UserDetails.findOne({email: req.body.email, name: req.body.name});
    if(userExists){
      return res.status(400).json({success:false, message: "User already exists with this email and name"});
    }
    const user = await UserDetails.create(req.body);
    return res.status(200).json({success: true, message: "User created successfully", user});

  }catch(error){
    return res.status(400).json({success: false, message: "Error creating user", error:error.message})
  }
}

//function to get astrology insights by using astrologu external API
  const getAstrologyInsights = async (birthDetails) =>{
    try{
      const response = await axios.post('https://astrology-api.example.com/getInsights', birthDetails);
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

// fecth user astrology details

const getUserDetails = async(req,res) =>{
  try{
    const user = await UserDetails.findById(req.body.userId);
    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }
    // as soon as user is created we will create the user astrology insights by using user details as name, place of birth, date of birth, time of birth, latitude, longitude 
    const birthDetails = {
      name: user.name,
      placeofBirth: user.placeofBirth,
      dateOfBirth: user.dob,
      timeOfBirth: user.timeOfBirth,
      latitude: user.latitude,
      longitude: user.longitude,
    }
    console.log("User birth details:", birthDetails);
    // get astrology insights using birth details
    const astrologyInsights = await getAstrologyInsights(birthDetails);
    console.log("User astrology insights:", astrologyInsights);
    return res.status(200).json({success: true, message: "User details fetched successfully", astrologyInsights});
  }catch(err){
    return res.status(400).json({success: false, message: "Error fetching user details", error: err.message});
  }

  
}
module.exports = {createUser, getUserDetails};