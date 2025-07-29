const userDetails = require('../models/userDetailsModel');
const { getAstrologyInsights } = require('./userDetailsController'); // Import the function
//const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmailHelper = require('../utils/emailHelper');

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({success: false, message: "Email and password are required"});
    }

    // Find user by email
    const user = await userDetails.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({success: false,  message: "User not found"});
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({success: false,  message: "Invalid credentials"});
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Return success response with user data, token, and astrology insights
    return res.status(200).json({success: true, message: "Login successful", token:token, user: user});

  } catch (err) {
    return res.status(500).json({success: false,message: "Login failed",error: err.message});
  }
};



const otpGenerator = function() {
    return  Math.floor(100000 + Math.random() * 900000);
}

const forgotPassword = async (req,res) => {
  try{
    if(req.body.email === undefined){
      return res.status(400).json({success: false, message: "Email is required"});
    }
    const user = await userDetails.findOne({email: req.body.email});
    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }
    // Generate OTP
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();
    // Send OTP via email (assuming you have a function to send emails)
    await EmailHelper('otp.html', user.email, { name: user.name, otp: otp });
    return res.status(200).json({success: true, message: "OTP sent to your email", otp: otp});
  }catch(err){
    return res.status(400).json({success: false,  error: err.message});   
  }
}

const resetPassword = async (req, res) => {
  try{
    const resetPassword = req.body;
    if(!resetPassword.password || !resetPassword.otp){
      return res.status(400).json({success: false, message: "New Password and OTP are required"});
    }
    const user = await userDetails.findOne({email: req.params.email});
    if(user === null){
      return res.status(404).json({success: false, message: "User not found"});
    }

    //Otp validation
    if(Date.now() > user.otpExpiry){
      return res.status(400).json({success: false, message: "OTP expired"});
    }
    if(user.otp !== resetPassword.otp){
      return res.status(401).json({success:false,message:"Invalid OTP"})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(resetPassword.password, saltRounds);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

   return res.status(200).json({ success: true, message: "Password reset successful",user:user }); 

  }catch(err){
    return res.status(400).json({success: false, message: "Error resetting password", error: err.message});
  }
} 

module.exports = {userLogin, forgotPassword, resetPassword };