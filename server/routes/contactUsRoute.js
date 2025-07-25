const express = require('express');
const contactUsRoute = express.Router();

const {createContactUs} = require('../controllers/contactUsController');

contactUsRoute.post('/create', createContactUs);

module.exports = contactUsRoute;