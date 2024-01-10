const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/main/checkout.controller.js");

router.get("/", checkoutController.show);
router.post("/order", checkoutController.newOrder);

module.exports = router;
