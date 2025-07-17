const express = require('express');
const userDetailRoute = express.Router();

const {createUser} = require('../controllers/userDetailsController');


userDetailRoute.post('/userDetails', createUser);

module.exports = userDetailRoute;