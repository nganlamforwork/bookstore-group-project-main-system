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
  register: async (req, res, next) => {
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

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const founded = await CustomerModel.get(email);
      if (!founded)
        return res.render("login", {
          error: `User with ${email} not founded`,
        });

      bcrypt.compare(password, founded.password, function (err, result) {
        if (err || !result) {
          return res.render("login", {
            error: "Wrong password for that email",
          });
        } else {
          res.redirect("/");
        }
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
