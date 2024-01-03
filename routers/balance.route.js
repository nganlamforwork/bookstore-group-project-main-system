const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balance.controller.js');

router.get('/recharge', balanceController.show);
router.post('/:userId/recharge', balanceController.rechargeBalance);

module.exports = router;
