const mongoose = require('mongoose');

const dbUrl = process.env.DB_Url || 'mongodb://localhost:27017/astrology';

const connectDB = async() => {
  try{
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  }catch(error){
    console.error("MongoDB connection failed:", error);
  }
}

module.exports = connectDB;