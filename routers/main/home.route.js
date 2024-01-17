const express = require("express");
const router = express.Router();
const HomeController = require("../../controllers/main/home.controller.js");

router.get("/search", HomeController.displaySearchPage);
router.get("/", HomeController.displayHome);

module.exports = router;
