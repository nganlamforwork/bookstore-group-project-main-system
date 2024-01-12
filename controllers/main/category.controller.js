const CategoriesModel = require('../../models/admin/categories.model');
const BooksModel = require('../../models/admin/books.model');

const PER_PAGE = 8;

const CategoryController = {
  displayCategory: async (req, res, next) => {
    try {
      let books = await BooksModel.getAll();
      let categories = await CategoriesModel.getAll();

      const page = 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(books.length / PER_PAGE);

      books = books.slice(offset, offset + PER_PAGE);

      res.render('main/category', {
        title: 'Category Page',
        layout: 'main',
        books,
        categories,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  filter: async (req, res, next) => {
    try {
      let books = await BooksModel.getAll();
      let filters = req.query;

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

      const page = parseInt(filters?.page) || 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(books.length / PER_PAGE);

      books = books.slice(offset, offset + PER_PAGE);

      res.json({
        books,
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
};

module.exports = CategoryController;
