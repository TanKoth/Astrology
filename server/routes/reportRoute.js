const express = require('express');
const reportRouter = express.Router();

const {getGemstoneReport,getRudrakshReport} = require('../controllers/reports');

reportRouter.get('/gem_suggestion/:userId', getGemstoneReport);
reportRouter.get('/rudraksh_suggestion/:userId', getRudrakshReport);

module.exports = reportRouter;