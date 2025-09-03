const express = require('express');
const chatRouter = express.Router();

const {chatWithAI} = require('../controllers/chatWithAIController');

chatRouter.post('/chat', chatWithAI);

module.exports = chatRouter;
