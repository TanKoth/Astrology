const express = require('express');
const userDetailRoute = express.Router();

const {createUser,updateUserDetails,getUserDetails} = require('../controllers/userDetailsController');


userDetailRoute.post('/save', createUser);
userDetailRoute.put('/update/:userId', updateUserDetails);
userDetailRoute.get('/details/:userId', getUserDetails);

module.exports = userDetailRoute;