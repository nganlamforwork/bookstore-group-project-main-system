const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const categoriesController = require("../controllers/admin/categories.controller");
const passport = require("passport");

router.get("/", adminController.getLoginAdmin);
router.post(
  "/login",
  passport.authenticate("myStrategy", {
    failureRedirect: "/admin",
  }),
  (req, res) => {
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
router.get("/customers", adminController.getCustomers);
router.get("/subscribers", adminController.getSubscribers);
router.use("/categories", require("./admin/categories.route"));
router.use("/books", require("./admin/books.route"));

// Admin
router.get("/profile", adminController.getAdminProfile);
router.get("/logout", adminController.logOut);

module.exports = router;
