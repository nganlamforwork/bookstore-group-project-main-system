const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/login', userController.getLoginPage);
router.get('/register', userController.getRegisterPage);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.post('/signout', userController.signOut);

module.exports = router;
