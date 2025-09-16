const express = require('express');
const BhinnashtakavargaChartsRouter = express.Router();

const { getBinnashtakavargaSunChart,getBinnashtakavargaMoonChart } = require('../controllers/BhinnashtakavargaChartsController');

BhinnashtakavargaChartsRouter.get('/ashtakavarga-sun-chart/:userId', getBinnashtakavargaSunChart);
BhinnashtakavargaChartsRouter.get('/ashtakavarga-moon-chart/:userId', getBinnashtakavargaMoonChart);

module.exports = BhinnashtakavargaChartsRouter;