const express = require('express');
const matchingRouter = express.Router();
const  {getNakshatraMatching, getMatching} = require('../controllers/matching');

matchingRouter.get('/nakshatraMatching', getNakshatraMatching);
matchingRouter.get('/matching', getMatching);

module.exports = matchingRouter;