const express = require('express');
const horoscopeRouter = express.Router();

const {dailyHoroscope,weeklyHoroscope, monthlyHoroscope, yearlyHoroscope} = require('../controllers/userHoroscopeController');

horoscopeRouter.post('/daily', dailyHoroscope);
horoscopeRouter.post('/weekly', weeklyHoroscope);
horoscopeRouter.post('/monthly', monthlyHoroscope);
horoscopeRouter.post('/yearly', yearlyHoroscope);

module.exports = horoscopeRouter;
