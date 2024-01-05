const CategoriesModel = require('../models/admin/categories.model');
const BooksModel = require('../models/admin/books.model');


const categoryController = {
  show: async (req, res, next) => {
    try {
      let books = await BooksModel.getAll();
      let categories = await CategoriesModel.getAll();


      res.render('category', {
        title: 'Category Page',
        layout: 'main',
        books: books,
        categories: categories,
      });
    } catch (error) {
      next(error);
    }
  },

  filter: async (req, res, next) => {
    let books = await BooksModel.getAll();
    let categories = await CategoriesModel.getAll();
    let filters = req.body;
    let categoryFilterBooks = [];

    if (filters?.minPrice) {
      books = books.filter((item) => item.price >= filters?.minPrice);
    }

    if (filters?.maxPrice) {
      books = books.filter((item) => item.price <= filters?.maxPrice);
    }

    if (filters?.category) {
      if (filters?.category && Array.isArray(filters.category)) {
        for (categoryId of filters?.category) {
          let tmp = await CategoriesModel.getListBooksById(categoryId);
          categoryFilterBooks.push(...tmp);
        }
      } else if (filters?.category && typeof filters.category === 'string') {
        let tmp = await CategoriesModel.getListBooksById(filters?.category);
        categoryFilterBooks.push(...tmp);
      }

      books = books.filter((itemA) =>
        categoryFilterBooks.some((itemB) => {
          return itemA._id.toString() === itemB._id.toString();
        })
      );
    }

    res.render('category', {
      title: 'Category Page',
      layout: 'main',
      books,
      categories,
    });
  },
};

module.exports = categoryController;
