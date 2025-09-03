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
    type: String,
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
  },
  chatLimit:{
    type: Number,
    default: 5,
  },
  lastChatReset: {
    type: String,
    default: () => new Date().toDateString()
  }
});

const userDetailModel = mongoose.model('UserDetail', userSchema);
module.exports = userDetailModel;

