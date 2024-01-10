const express = require("express");
const router = express.Router();
const CardsController = require("../../controllers/payment/cards.controller.js");

router.post("/:userId", CardsController.add);

module.exports = router;
