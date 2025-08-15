const express = require('express');
const panchangRouter = express.Router();

const {getPanchangReport, getChoghadiyaMuhurat} = require('../controllers/panchangController');

panchangRouter.get('/panchang', getPanchangReport);
panchangRouter.get('/panchang/choghadiya', getChoghadiyaMuhurat);

module.exports = panchangRouter;