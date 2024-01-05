const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller.js');

router.post('/:userId', paymentsController.addNewPayment);

module.exports = router;
