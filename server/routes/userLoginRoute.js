const express = require('express');
const router = express.Router();
 const {userLogin,forgotPassword, resetPassword} = require('../controllers/userLoginController');
//const auth = require('../middlewares/authMiddleware');

router.post('/login',userLogin);
router.patch('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:email', resetPassword);

module.exports = router;
  