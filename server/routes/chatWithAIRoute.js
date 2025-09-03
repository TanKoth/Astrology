const express = require('express');
const chatRouter = express.Router();
//const authenticate = require('../middlewares/authMiddleware');

const {chatWithAI, getChatLimit, updateChatLimit} = require('../controllers/chatWithAIController');

chatRouter.post('/chat', chatWithAI);
chatRouter.get('/chat/limit/:userId', getChatLimit);
chatRouter.post('/chat/limit', updateChatLimit);

module.exports = chatRouter;
