const CategoriesModel = require('../models/admin/categories.model');
const moment = require('moment');

const categoryController = {
	show: async (req, res, next) => {
		try {
			const slug = req.params.slug;
      let category = await CategoriesModel.getBySlug(slug);
      let books = await CategoriesModel.getListBooksById(category._id);

			res.render("category", {
        title: "Category Page",
        layout: "main",
        category: category,
        books: books,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
