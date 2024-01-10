const bcrypt = require("bcrypt");
const moment = require("moment");
const UserModel = require("../../models/payment/user.model");
const CardModel = require("../../models/payment/cards.model");
const PaymentHistoryModel = require("../../models/payment/history.model");

const HomeController = {
  displayHome: async (req, res, next) => {
    try {
      if (!req.session.user) {
        res.redirect("/auth/login");
        return;
      }
      const user = req.session.user;
      balance = await CardModel.getBalance(user._id);
      req.session.balance = balance;

      transactions = await PaymentHistoryModel.get(user._id);
      transactions.sort((a, b) => b.date - a.date);
      transactions.forEach((transaction) => {
        transaction.date = moment(transaction.date).format(
          "DD MMM YYYY - HH:mm:ss"
        );
      });

      var income = 0,
        expense = 0;
      transactions.map((trans) => {
        if (trans.success) {
          if (trans.income) {
            income += parseInt(trans.amount);
          } else {
            expense += parseInt(trans.amount);
          }
        }
      });

      res.render("payment/home", {
        title: "Payment - Home",
        layout: "payment",
        transactions: transactions,
        balance: balance,
        income: income,
        expense: expense,
      });
    } catch (error) {
      next(error);
    }
  },
  displayLogIn: async (req, res, next) => {
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

  logIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const founded = await UserModel.get(email);
      // console.log(founded);
      if (!founded)
        return res.render("main/login", {
          error: `User with ${email} not founded`,
        });

      // // Create user login for tracking
      // await LoginsTrackerModel.create({ user: founded._id, req: req });

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

module.exports = HomeController;
