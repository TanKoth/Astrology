const express = require('express');
const cors = require('cors');
const userDetailRoute = require('./routes/userDetailRoute');
const contactUsRoute = require('./routes/contactUsRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const userAstrologyDataRouter = require('./routes/userAstrologyDataRoute');
const horoscopeRouter = require('./routes/userHoroscopeRoute');

const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

app.use(cors());

app.use(express.json());
app.use('/api/users', userDetailRoute);
app.use('/api/contactUs', contactUsRoute);
app.use('/api/user', userLoginRoute);
app.use('/api/astrologyData', userAstrologyDataRouter);
app.use('/api/horoscope', horoscopeRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})