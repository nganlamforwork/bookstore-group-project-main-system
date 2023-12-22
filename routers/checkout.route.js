const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller.js');

router.get('/', checkoutController.show);

module.exports = router;
