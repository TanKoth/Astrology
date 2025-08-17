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

const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

// const corsOptions = {
//   origin: [
//     'https://vedic-vedang-ai-astrology.onrender.com',
//     'https://vedic-vedang-ai.onrender.com',
//     'http://localhost:3000', // for local development
//     'http://localhost:5173', // for Vite development server
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
// };

// app.use(cors(corsOptions));

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

app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})