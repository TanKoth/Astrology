const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const path = require('path');

const PORT = process.env.PORT || 8081;

const userDetailRoute = require('./routes/userDetailRoute');
const contactUsRoute = require('./routes/contactUsRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const userAstrologyDataRouter = require('./routes/userAstrologyDataRoute');
const horoscopeRouter = require('./routes/userHoroscopeRoute');
const sadeSatiRouter = require('./routes/sadeSatiRoute');
const panchangRouter = require('./routes/panchangRoute');
const matchingRouter = require('./routes/matchingRoute');
const reportRouter = require('./routes/reportRoute');
const dashaRouter = require('./routes/dashaRoute');
const calculatorRouter = require('./routes/calculatorRoute');
const doshRouter = require('./routes/doshRoute');
const lalkitabRouter = require('./routes/lalKitabRoute');
const numerologyRouter = require('./routes/numerologyRoute');
const chatRouter = require('./routes/chatWithAIRoute')

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
app.use((req, res, next) => {
  req.setTimeout(30000);
  next();
});

app.use('/api/users', userDetailRoute);
app.use('/api/contactUs', contactUsRoute);
app.use('/api/user', userLoginRoute);
app.use('/api/astrologyData', userAstrologyDataRouter);
app.use('/api/horoscope', horoscopeRouter);
app.use('/api', sadeSatiRouter);
app.use('/api', panchangRouter);
app.use('/api', matchingRouter);
app.use('/api/reports', reportRouter);
app.use('/api/dasha', dashaRouter);
app.use('/api', calculatorRouter);
app.use('/api/dosh', doshRouter);
app.use('/api/lalkitab', lalkitabRouter);
app.use('/api/numerology', numerologyRouter);
app.use('/api', chatRouter);

app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})