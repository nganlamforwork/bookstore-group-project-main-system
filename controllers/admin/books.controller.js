const BooksModel = require("../../models/admin/books.model");
const CategoriesModel = require("../../models/admin/categories.model");

const booksController = {
  getBooks: async (req, res, next) => {
    try {
      const allBooks = await BooksModel.getAll();
      const allCategories = await CategoriesModel.getAll();
      res.render("dashboard/books", {
        title: "Books",
        layout: "admin",
        books: allBooks,
        categories: allCategories,
      });
    } catch (error) {
      next(error);
    }
  },

  addBook: async (req, res, next) => {
    try {
      await BooksModel.add(req.body);
      res.redirect("/admin/books");
    } catch (error) {
      next(error);
    }
  },

  getBookById: async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const book = await BooksModel.getById(bookId);
      res.json(book);
    } catch (error) {
      next(error);
    }
  },

  deleteBookById: async (req, res, next) => {
    try {
      const bookId = req.params.id;
      await BooksModel.deleteById(bookId);
      res.redirect("/admin/books");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = booksController;
