const express = require('express');
const chartRouter = express.Router();

const {getBhavChalitChart, getD1Chart, getD3Chart, getD4Chart, getD6Chart, getD7Chart, getD8Chart, getD9Chart, getD10Chart, getD12Chart, getD16Chart, getD20Chart, getD24Chart, getD27Chart, getD30Chart, getD40Chart, getD45Chart, getD60Chart, getMoonChart,getSarvashtakavargaChart}  = require('../controllers/chartsController');

chartRouter.get('/bhav_chalit_chart/:userId', getBhavChalitChart);
chartRouter.get('/d1/:userId', getD1Chart);
chartRouter.get('/d3/:userId', getD3Chart);
chartRouter.get('/d4/:userId', getD4Chart);
chartRouter.get('/d6/:userId', getD6Chart);
chartRouter.get('/d7/:userId', getD7Chart);
chartRouter.get('/d8/:userId', getD8Chart);
chartRouter.get('/d9/:userId', getD9Chart);
chartRouter.get('/d10/:userId', getD10Chart);
chartRouter.get('/d12/:userId', getD12Chart);
chartRouter.get('/d16/:userId', getD16Chart);
chartRouter.get('/d20/:userId', getD20Chart);
chartRouter.get('/d24/:userId', getD24Chart);
chartRouter.get('/d27/:userId', getD27Chart);
chartRouter.get('/d30/:userId', getD30Chart);
chartRouter.get('/d40/:userId', getD40Chart);
chartRouter.get('/d45/:userId', getD45Chart);
chartRouter.get('/d60/:userId', getD60Chart);
chartRouter.get('/moon/:userId', getMoonChart);
chartRouter.get('/sarvashtakavarga-chart/:userId', getSarvashtakavargaChart);

module.exports = chartRouter;