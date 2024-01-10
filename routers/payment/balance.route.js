const express = require("express");
const router = express.Router();
const BalanceController = require("../../controllers/payment/balance.controller.js");

router.get("/:userId/recharge", BalanceController.displayRecharge);
router.post("/:userId/recharge", BalanceController.rechargeBalance);

module.exports = router;
