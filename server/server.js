const express = require('express');
const userDetailRoute = require('./routes/userDetailRoute');

const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

app.use(express.json());
app.use('/api/userDetails', userDetailRoute);
const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})