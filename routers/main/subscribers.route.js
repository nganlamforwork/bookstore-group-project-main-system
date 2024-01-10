const express = require("express");
const router = express.Router();
const SubscriberController = require("../../controllers/main/subscriber.controller");

router.get("/getAll", SubscriberController.getAll);
router.post("/add", SubscriberController.add);

module.exports = router;
