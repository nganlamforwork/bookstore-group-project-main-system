const CustomerModel = require("../models/customer.model");
const SubscriberModel = require("../models/subscriber.model");

const adminController = {
  getAdminProfile: async (req, res, next) => {
    try {
      res.render("dashboard/admin/profile", {
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
      res.render("dashboard/login", {
        title: "Admin Login",
        layout: "base",
      });
    } catch (error) {
      next(err);
    }
  },
  getAdminDashboard: async (req, res, next) => {
    try {
      res.render("dashboard/dashboards", {
        title: "Admin Dashboard",
        layout: "admin",
      });
    } catch (error) {
      next(err);
    }
  },
  getCustomers: async (req, res, next) => {
    try {
      const users = await CustomerModel.getAll();
      const sanitizedUsers = users.map((user) => {
        return {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          default_payment: user.default_payment || "",
          default_address: user.default_address || "",
          created_at: user.created_at || "",
          last_updated: user.last_updated || "",
        };
      });

      res.render("dashboard/customers", {
        title: "Customers",
        layout: "admin",
        users: sanitizedUsers,
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

      res.render("dashboard/subscribers", {
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
};
module.exports = adminController;
