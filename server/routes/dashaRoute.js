const express = require('express');
const dashaRouter = express.Router();
const {getDashaReport} = require('../controllers/dashaController');

dashaRouter.get('/dasha-periods/:userId', getDashaReport);

module.exports = dashaRouter;