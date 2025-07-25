const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message:{
    type: String,
    required: true,
    maxLength: 200, // Limit message length to 200 characters
  },
  
},
{ timestamps: true }
)

const contactUsModel = mongoose.model("contactUs", contactUsSchema);

module.exports = contactUsModel;