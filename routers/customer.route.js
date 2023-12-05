const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.get("/login", customerController.getLoginPage);
router.get("/register", customerController.getRegisterPage);
router.post("/login", customerController.login);
router.post("/register", customerController.register);
router.post("/signout", customerController.signOut);

module.exports = router;
