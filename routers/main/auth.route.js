const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const passport = require("passport");

const LoginsTrackerModel = require("../../models/main/loginsTracker.model");
const CustomerController = require("../../controllers/main/customer.controller");

// Settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uid = req.params.uid;
    const uploadDir = `./uploads/${uid}`; // Directory for the specific catId
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Define routes

router.get("/login", CustomerController.getLoginPage);
router.post("/login", CustomerController.login);
router.get("/register", CustomerController.getRegisterPage);
router.post("/register", CustomerController.register);
router.post("/change-password", CustomerController.changePassword);
router.get("/logout", CustomerController.logOut);

// OAuth 2.0 with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  async (req, res) => {
    // Successful authentication, redirect to home
    // Create user login for tracking
    console.log(req.user);
    await LoginsTrackerModel.create({ user: req.user._id, req: req });
    req.session.user = req.user;
    req.flash("success", "Welcome back");
    res.redirect("/");
  }
);

// Avatar
router.post(
  "/:uid/profile/avatar",
  upload.single("avatar"),
  CustomerController.uploadAvatar
);

module.exports = router;
