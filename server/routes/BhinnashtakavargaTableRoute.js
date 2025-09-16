const express = require('express');
const binnashtakavargaTablerouter = express.Router();
const {getBinnashtakavargaSunTable,getBinnashtakavargaMoonTable,getBinnashtakavargaMarsTable,getBinnashtakavargaMercuryTable,getBinnashtakavargaJupiterTable,getBinnashtakavargaVenusTable,getBinnashtakavargaSaturnTable} = require('../controllers/BhinnashtakavargaTableController');

binnashtakavargaTablerouter.get('/binnashtakvarga-sun/:userId', getBinnashtakavargaSunTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-moon/:userId', getBinnashtakavargaMoonTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-mars/:userId', getBinnashtakavargaMarsTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-mercury/:userId', getBinnashtakavargaMercuryTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-jupiter/:userId', getBinnashtakavargaJupiterTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-venus/:userId', getBinnashtakavargaVenusTable);
binnashtakavargaTablerouter.get('/binnashtakvarga-saturn/:userId', getBinnashtakavargaSaturnTable);

module.exports = binnashtakavargaTablerouter; 