const express = require("express");
const calculatorRouter = express.Router();
const {getMoonSign, getSunSign, getRasiSign} = require('../controllers/calculatorController');

calculatorRouter.get("/moon_sign/:userId", getMoonSign);
calculatorRouter.get("/sun_sign/:userId", getSunSign);
calculatorRouter.get("/ascendant_sign/:userId", getRasiSign);

module.exports = calculatorRouter;
