const BooksModel = require("../../models/admin/books.model");
const CategoriesModel = require("../../models/admin/categories.model");
const moment = require("moment");

const ProductController = {
  displayBook: async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const book = await BooksModel.getById(bookId);
      const authors = [];
      const category = await CategoriesModel.getById(book?.category_id);
      let relatedBooks = await CategoriesModel.getListBooksById(category._id);
      if (relatedBooks?.length > 0) {
        relatedBooks = relatedBooks.slice(0, 4);
      }

      res.render("main/product", {
        title: "Detail Book",
        layout: "main",
        book: book,
        authors: authors,
        category: category,
        date: moment(book.published_at).format("DD MMM YYYY"),
        relatedBooks,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
