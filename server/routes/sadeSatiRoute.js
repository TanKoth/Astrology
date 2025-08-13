const express = require('express');
const sadeSatiRouter = express.Router();
const {getSadeSatiReport,getSadeSatiDetails} = require('../controllers/sadeSatiController');

sadeSatiRouter.get('/sadeSati/:userId', getSadeSatiReport);
sadeSatiRouter.get('/sadeSati-details/:userId', getSadeSatiDetails);

module.exports = sadeSatiRouter;
