const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  },
  placeOfBirth:{
    type: String,
    required: true,
  },
  dob:{
    type: Date,
    required: true,
  },
  timeOfBirth:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum:['user', 'admin'],
    default: 'user',
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  }
});

const userDetailModel = mongoose.model('UserDetail', userSchema);
module.exports = userDetailModel;