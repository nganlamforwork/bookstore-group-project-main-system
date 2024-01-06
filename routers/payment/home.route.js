const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/payment/home.controller.js");

const LoginModel = require("../../models/login.model.js");

const passport = require("passport");

router.get("/", homeController.show);
router.get("/auth/login", homeController.showLogIn);

// Login using username, password
router.post("/auth/login", homeController.login);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  async (req, res) => {
    // Successful authentication, redirect to home
    // Create user login for tracking
    req.session.user = req.user;
    req.flash("success", "Welcome back");
    res.redirect("/");
  }
);
router.get("/logout", homeController.logOut);

module.exports = router;
