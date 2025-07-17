const express = require('express');

const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();


const PORT = 8081;
app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})