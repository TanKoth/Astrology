const express = require('express');
const reportRouter = express.Router();

const {getGemstoneReport,getRudrakshReport,getPlanetKpReport} = require('../controllers/reportsController');

reportRouter.get('/gem_suggestion/:userId', getGemstoneReport);
reportRouter.get('/rudraksh_suggestion/:userId', getRudrakshReport);
reportRouter.get('/planets_kp/:userId', getPlanetKpReport);

module.exports = reportRouter;