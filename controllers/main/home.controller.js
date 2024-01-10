const BooksModel = require("../../models/admin/books.model");
const CategoriesModel = require("../../models/admin/categories.model");
const CartModel = require("../../models/main/cart.model");
const CardModel = require("../../models/payment/cards.model");

const HomeController = {
  displayHome: async (req, res, next) => {
    try {
      let newArrivalBooks = await BooksModel.getAll();
      if (newArrivalBooks?.length > 0) {
        newArrivalBooks = newArrivalBooks.slice(0, 4);
      }
      const categories = await CategoriesModel.getAll();
      const user = req.session.user;
      var balance = undefined;
      if (user) {
        const cart = await CartModel.getCartByCustomerId(user._id);
        const totalQuantity = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        req.session.cart = {
          cart,
          totalQuantity,
        };
        balance = await CardModel.getBalance(user._id);
        req.session.balance = balance;
      }
      res.render("main/home", {
        title: "Home",
        success: req.flash("success"),
        error: req.flash("error"),
        newArrivalBooks,
        categories,
        amount: balance != undefined ? balance.amount : null,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = HomeController;
