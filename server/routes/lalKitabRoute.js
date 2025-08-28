const express = require('express');
const lalkitabRouter = express.Router();
const {getLalkitabDebts,getLalkitabRemedies,getLalkitabPlanets,getLalkitabHouses} = require('../controllers/lalKitabController');

lalkitabRouter.get('/debts/:userId', getLalkitabDebts);
lalkitabRouter.get('/remedies/:userId', getLalkitabRemedies);
lalkitabRouter.get('/planets/:userId', getLalkitabPlanets);
lalkitabRouter.get('/houses/:userId', getLalkitabHouses);

module.exports = lalkitabRouter;
