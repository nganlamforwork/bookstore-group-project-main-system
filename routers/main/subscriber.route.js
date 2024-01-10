const express = require("express");
const router = express.Router();
const subscriberController = require("../../controllers/main/subscriber.controller");

router.get("/getAll", subscriberController.getAll);
router.post("/add", subscriberController.add);

module.exports = router;
