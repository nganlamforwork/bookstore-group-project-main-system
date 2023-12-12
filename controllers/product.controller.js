const BooksModel = require("../models/admin/books.model");
const CategoriesModel = require("../models/admin/categories.model");
const moment = require('moment');


const productController = {
	showBook: async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const book = await BooksModel.getById(bookId);
			const authors = [];
      const category = await CategoriesModel.getById(book?.category_id);

			res.render("product", {
        title: "Detail Book",
        layout: "main",
        book: book,
        authors: authors,
        category: category,
        date: moment(book.published_at).format('DD MMM YYYY')
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
