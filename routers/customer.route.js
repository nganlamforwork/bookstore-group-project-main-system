const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.get("/login", customerController.getLoginPage);
router.get("/register", customerController.getRegisterPage);
router.post("/signin", customerController.signIn);
router.post("/signup", customerController.signUp);
router.post("/signout", customerController.signOut);

module.exports = router;
