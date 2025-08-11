const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const PORT = process.env.PORT || 8081;

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

//setting rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use('/api/', limiter);
app.use(helmet());


app.use(express.json());

app.use('/api/users', userDetailRoute);
app.use('/api/contactUs', contactUsRoute);
app.use('/api/user', userLoginRoute);
app.use('/api/astrologyData', userAstrologyDataRouter);
app.use('/api/horoscope', horoscopeRouter);

// Serve static files from React build (only in production)

  
  // Handle React routing - return all requests to React app
//   app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });


app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})