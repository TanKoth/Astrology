const express = require('express');
const userAstrologyDataRouter = express.Router();
const { moonPrediction } = require('../controllers/userAstrologyDataController');

userAstrologyDataRouter.get('/moon-prediction/:userId', moonPrediction);

module.exports = userAstrologyDataRouter;