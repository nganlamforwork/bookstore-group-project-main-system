const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controllers/main/checkout.controller.js");

router.get("/", CheckoutController.displayCheckout);
router.post("/order", CheckoutController.newOrder);

module.exports = router;
