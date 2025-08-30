const express = require('express');
const  numerologyRouter = express.Router();

const {getBirthdayNumber, getAllNumerology} = require('../controllers/numerologyController');

numerologyRouter.get('/birthday-number/:userId', getBirthdayNumber);
numerologyRouter.get('/numerology/:userId', getAllNumerology);

module.exports = numerologyRouter;
