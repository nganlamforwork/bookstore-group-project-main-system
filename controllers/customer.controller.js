const CustomerModel = require("../models/customer.model");
const bcrypt = require("bcrypt");

const customerController = {
  getLoginPage: async (req, res, next) => {
    try {
      res.render("login", {
        title: "Login",
      });
    } catch (error) {
      next(err);
    }
  },
  getRegisterPage: async (req, res, next) => {
    try {
      res.render("register", {
        title: "Register",
      });
    } catch (error) {
      next(err);
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { firstname, lastname, email, password } = req.body;

      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return next(err);
        }

        await CustomerModel.add(firstname, lastname, email, hash);

        res.redirect("/");
      });
    } catch (err) {
      next(err);
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const foundUser = await CustomerModel.getUser(username);
      if (!foundUser) return;
      bcrypt.compare(password, foundUser.Password, function (err, result) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } catch (err) {
      next(err);
    }
  },
  signOut: async (req, res, next) => {
    try {
      res.redirect("/auth/signin");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = customerController;
