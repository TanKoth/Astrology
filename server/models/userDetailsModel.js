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
  place_of_birth:{
    type: String,
    required: true,
  },
  date_of_birth:{
    type: Date,
    required: true,
  },
  birth_time:{
    type: String,
    required: true,
  },
})

const userDetailModel = mongoose.model('UserDetail', userSchema);
module.exports = userDetailModel;