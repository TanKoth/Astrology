const UserDetails = require('../models/userDetailsModel');

const createUser = async (req, res) =>{
  try{
    const userExists = await UserDetails.findOne({email: req.body.email, name: req.body.name});
    if(userExists){
      return res.status(400).json({success:false, message: "User already exists with this email and name"});
    }
    const user = await UserDetails.createUser(req.body);
    return res.status(200).json({success: true, message: "User created successfully", user});

  }catch(error){
    return res.status(400).json({success: false, message: "Error creating user", error:error.message})
  }
}

module.exports = {createUser};