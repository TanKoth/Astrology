const express = require('express');
const doshRouter = express.Router();
const {getPitraDosh,getKaalsarpDosh, getMangalDosh} = require('../controllers/doshController');

doshRouter.get('/pitra-dosh/:userId', getPitraDosh);
doshRouter.get('/kaalsarp-dosh/:userId', getKaalsarpDosh);
doshRouter.get('/mangal-dosh/:userId', getMangalDosh);

module.exports = doshRouter;