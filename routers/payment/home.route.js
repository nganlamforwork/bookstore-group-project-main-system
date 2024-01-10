const express = require("express");
const router = express.Router();
const HomeController = require("../../controllers/payment/home.controller.js");

const passport = require("passport");

router.get("/", HomeController.displayHome);

// Login using email, password
router.get("/auth/login", HomeController.displayLogIn);
router.post("/auth/login", HomeController.logIn);

// Login using Google Account
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

router.get("/logout", HomeController.logOut);

module.exports = router;
