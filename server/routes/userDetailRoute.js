const express = require('express');
const userDetailRoute = express.Router();

const {createUser} = require('../controllers/userDetailsController');


userDetailRoute.post('/save', createUser);
//userDetailRoute.get('/details/:userId', getUserDetails);

module.exports = userDetailRoute;