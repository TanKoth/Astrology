const express = require('express');
const userAstrologyDataRouter = express.Router();
const {moonPrediction,rasiPrediction,nakshatraPrediction,panchangPrediction} = require('../controllers/userAstrologyDataController');

userAstrologyDataRouter.get('/moon-prediction/:userId', moonPrediction);
userAstrologyDataRouter.get('/rasi-prediction/:userId', rasiPrediction);
userAstrologyDataRouter.get('/nakshatra-prediction/:userId', nakshatraPrediction);
userAstrologyDataRouter.get('/panchang-prediction/:userId', panchangPrediction);

module.exports = userAstrologyDataRouter;