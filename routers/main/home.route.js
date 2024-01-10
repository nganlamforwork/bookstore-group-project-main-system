const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/main/home.controller.js");

router.get("/", homeController.show);

module.exports = router;
