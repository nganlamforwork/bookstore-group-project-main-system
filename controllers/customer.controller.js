const CustomerModel = require("../models/customer.model");
const bcrypt = require("bcrypt");

const customerController = {
  getProfilePage: async (req, res, next) => {
    try {
      if (req.session.user) {
        const { first_name, last_name, email } = req.session.user;
        res.render("profile", {
          title: "Profile",
          full_name: first_name + " " + last_name,
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone: "000000",
          default_address: "aaa",
          default_payment: "bbb",
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  getInformationPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        res.render("information", {
          title: "Information",
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  getOrdersPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        res.render("orders", {
          title: "Orders History",
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  getPaymentsPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        res.render("payments", {
          title: "Payment Methods",
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  getAddressesPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        res.render("addresses", {
          title: "Addresses Book",
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  getLoginPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        return res.redirect("/auth/profile");
      }

      res.render("login", {
        title: "Login",
      });
    } catch (error) {
      next(err);
    }
  },
  getRegisterPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        return res.redirect("/auth/profile");
      }
      res.render("register", {
        title: "Create account",
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

        const rs = await CustomerModel.add(firstname, lastname, email, hash);
        if (!rs.status) {
          return res.render("register", { error: rs.msg });
        }

        res.redirect("/auth/login");
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
          req.session.user = founded;
          req.session.save((err) => {
            if (err) {
              return next(err);
            }

            res.redirect("/");
          });
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
