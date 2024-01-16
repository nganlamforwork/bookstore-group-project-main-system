const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin.controller");
const passport = require("passport");

router.get("/", adminController.getLoginAdmin);
router.post(
  "/login",
  passport.authenticate("myStrategy", {
    failureRedirect: "/admin",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    res.redirect("/admin/dashboard");
  }
);
router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.curAdmin = req.user;
    return next();
  }
  res.redirect("/admin");
});

// Protected routes - after the authentication middleware
router.get("/dashboard", adminController.getAdminDashboard);
router.get("/revenue", adminController.getRevenue);
router.get("/orders", adminController.getOrders);
router.get("/reviews", adminController.getReviews);
router.get("/subscribers", adminController.getSubscribers);
router.use("/categories", require("./categories.route"));
router.use("/books", require("./books.route"));
router.use("/customers", require("./customers.route"));

// Admin
router.get("/profile", adminController.getAdminProfile);
router.get("/logout", adminController.logOut);

module.exports = router;
