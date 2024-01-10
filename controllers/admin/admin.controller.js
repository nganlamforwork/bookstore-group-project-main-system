const CustomerModel = require("../../models/main/customer.model");
const SubscriberModel = require("../../models/main/subscriber.model");
const BooksModel = require("../../models/admin/books.model");

const adminController = {
  getAdminProfile: async (req, res, next) => {
    try {
      res.render("admin/profile", {
        title: "Admin Profile",
        layout: "admin",
        admin: req.user,
      });
    } catch (error) {
      next(err);
    }
  },
  getLoginAdmin: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect("/admin/dashboard");
      }
      res.render("admin/login", {
        title: "Admin Login",
        layout: "base",
      });
    } catch (error) {
      next(err);
    }
  },
  getAdminDashboard: async (req, res, next) => {
    try {
      const customers = await CustomerModel.getAll();
      const books = await BooksModel.getAll();

      res.render("admin/dashboards", {
        title: "Admin Dashboard",
        layout: "admin",
        totalCustomers: customers.length,
        totalBooks: books.length,
      });
    } catch (error) {
      next(err);
    }
  },
  getSubscribers: async (req, res, next) => {
    try {
      const subscribers = await SubscriberModel.getAll();
      const sanitizedSubscribers = subscribers.map((subscriber) => {
        return {
          email: subscriber.email || "",
          created_at: subscriber.created_at.toLocaleString(),
        };
      });

      res.render("admin/subscribers", {
        title: "Subscribers",
        layout: "admin",
        subscribers: sanitizedSubscribers,
      });
    } catch (error) {
      next(err);
    }
  },
  logOut: async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        // Successful logout: Perform any additional tasks like clearing session data, etc. if needed
        req.locals = {};
        res.redirect("/admin");
      });
    } catch (err) {
      next(err);
    }
  },
  getReviews: async (req, res, next) => {
    try {
      res.render("admin/reviews", {
        title: "Reviews",
        layout: "admin",
        reviews: [],
      });
    } catch (error) {
      next(err);
    }
  },
};
module.exports = adminController;
