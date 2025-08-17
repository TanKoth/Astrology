const UserDetails = require('../models/userDetailsModel');
const axios = require('axios');
const ASTROLOGY_API_KEY = process.env.ASTROLOGY_API_KEY;
const{extractTimeOnly, formatDate} = require('../utils/timeUtils');

const matchingReport = async (boyNakshatra, girlNakshatra, lang,endpoint) => {
  try{
        if(!ASTROLOGY_API_KEY){
          throw new Error("Astrology API key is not set in environment variables");
        }
        console.log("API_KEY:", ASTROLOGY_API_KEY);
        if(endpoint === "nakshatra-match"){
          const baseUrl = `https://api.jyotishamastroapi.com/api/matching/${endpoint}`;
        console.log("Base URL:", baseUrl);
        
        const queryParams = new URLSearchParams({
          boy_nakshatra: boyNakshatra,
          girl_nakshatra: girlNakshatra,
          lang: lang || 'en',
        });
        console.log("Query Params:", queryParams.toString());
        console.log("Making API call to :", `${baseUrl}?${queryParams.toString()}`);
        const response = await axios.get(`${baseUrl}?${queryParams.toString()}`,{
          headers:{
             'key': ASTROLOGY_API_KEY,
          }
        })
  
        if(response.status === 200){
          return response.data;
        } else {
          throw new Error("Failed to fetch astrology insights");
        }
        }
        
      }catch(error){
        console.error("Error fetching astrology insights:", error.message);
        throw new Error("Failed to fetch astrology insights");
      }
}

const getNakshatraMatching = async (req, res) => {
  const { boyNakshatra, girlNakshatra, lang } = req.query;
  console.log('Fetching Nakshatra Matching report with params:', req.query);
  try{
    const report = await matchingReport(boyNakshatra, girlNakshatra, lang, 'nakshatra-match');
    return res.status(200).json({ success: true, message: "Nakshatra Matching report fetched successfully", report: report });
  }catch(error){
    console.error("Error fetching Nakshatra Matching report:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch Nakshatra Matching report", error: error.message });
  }
}

const getMatching =(req,res)=>{}

module.exports = { getNakshatraMatching, getMatching };