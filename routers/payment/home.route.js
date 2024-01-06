const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/payment/home.controller.js");

router.get("/", homeController.show);
router.get("/login", homeController.showLogIn);

module.exports = router;
