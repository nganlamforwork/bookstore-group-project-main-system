const UserModel = require("../../models/payment/user.model");
const bcrypt = require("bcrypt");

const homeController = {
  show: async (req, res, next) => {
    const fakeData = [
      {
        id: 1,
        activity: "Pay bookstore bill",
        date: "January 5th, 2024",
        amount: -1000,
        status: "Success",
      },
      {
        id: 2,
        activity: "Pay bookstore bill",
        date: "January 5th, 2024",
        amount: -1000,
        status: "Success",
      },
      {
        id: 3,
        activity: "Top-up Visa card",
        date: "January 6th, 2024",
        amount: 500,
        status: "Success",
      },
      {
        id: 4,
        activity: "Top-up Visa card",
        date: "January 6th, 2024",
        amount: 500,
        status: "Success",
      },
      {
        id: 5,
        activity: "Top-up Visa card",
        date: "January 7th, 2024",
        amount: 300,
        status: "Success",
      },
    ];
    try {
      if (!req.session.user) {
        res.redirect("/auth/login");
        return;
      }
      res.render("payment/home", {
        title: "Payment - Home",
        layout: "payment",
        transactions: fakeData,
      });
    } catch (error) {
      next(error);
    }
  },
  showLogIn: async (req, res, next) => {
    try {
      if (req.session.user) {
        return res.redirect("/");
      }
      res.render("payment/login", {
        title: "Log In",
        layout: "payment",
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const founded = await UserModel.get(email);
      // console.log(founded);
      if (!founded)
        return res.render("login", {
          error: `User with ${email} not founded`,
        });

      // // Create user login for tracking
      // await LoginModel.create({ user: founded._id, req: req });

      bcrypt.compare(password, founded.password, function (err, result) {
        if (err || !result) {
          req.flash("error", "Wrong password for that email");
          // console.log("Wrong password for that email");
          req.session.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/auth/login");
          });
        } else {
          req.session.user = founded;
          req.flash("success", "Welcome back");
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
  logOut: async (req, res, next) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/auth/login");
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = homeController;
