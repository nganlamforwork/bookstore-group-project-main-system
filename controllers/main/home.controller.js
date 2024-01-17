const BooksModel = require("../../models/admin/books.model");
const CategoriesModel = require("../../models/admin/categories.model");
const CartModel = require("../../models/main/cart.model");

const HomeController = {
  displayHome: async (req, res, next) => {
    try {
      const newArrivalBooks = await getAllArrivalBooks();
      const categories = await CategoriesModel.getAll();

      for (const category of categories) {
        const categoryId = category._id;
        const newBooks = await getNewArrivalBooksByCategory(categoryId);
        category.newBooks = newBooks;
      }
      const user = req.session.user;
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
      }
      res.render("main/home", {
        title: "Home",
        success: req.flash("success"),
        error: req.flash("error"),
        newArrivalBooks,
        categories,
      });
    } catch (error) {
      next(error);
    }
  },
  displaySearchPage: async (req, res, next) => {
    try {
      const searchQuery = req.query.query;
      if (!searchQuery) {
        res.status(400).render("error", {
          layout: false,
          code: 400,
          msg: "An error has occurred",
          description: "Invalid search query",
        });
      }
      const books = await BooksModel.search(searchQuery);

      res.render("main/search", {
        title: "Search Page",
        searchQuery,
        books,
      });
    } catch (error) {
      next(error);
    }
  },
};

const getAllArrivalBooks = async () => {
  try {
    let newArrivalBooks = await BooksModel.getAll();
    if (newArrivalBooks?.length > 0) {
      newArrivalBooks = newArrivalBooks.slice(0, 4);
    }
    return newArrivalBooks;
  } catch (error) {
    throw error;
  }
};

const getNewArrivalBooksByCategory = async (categoryId) => {
  try {
    const newArrivalBooks = await BooksModel.getByCategory(categoryId);
    if (newArrivalBooks?.length > 0) {
      return newArrivalBooks.slice(0, 4);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

module.exports = HomeController;
