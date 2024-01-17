const express = require("express");
const router = express.Router();
const HomeController = require("../../controllers/main/home.controller.js");

router.get("/", HomeController.displaySearchPage);

module.exports = router;
