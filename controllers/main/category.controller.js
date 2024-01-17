const CategoriesModel = require("../../models/admin/categories.model");
const BooksModel = require("../../models/admin/books.model");

const PER_PAGE = 8;

const CategoryController = {
  displayCategories: async (req, res, next) => {
    try {
      let categories = await CategoriesModel.getAll();
      let books = await BooksModel.getAll();
      for (let category of categories) {
        let books = await BooksModel.getByCategory(category._id);
        category.bookCount = books.length;
      }
      res.render("main/categories", {
        title: "Categories Page",
        layout: "main",
        categories: categories,
        books: books.length,
      });
    } catch (error) {
      next(error);
    }
  },
  displayAllCategories: async (req, res, next) => {
    try {
      let books = await BooksModel.getAll();
      let categories = await CategoriesModel.getAll();

      const page = 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(books.length / PER_PAGE);

      books = books.slice(offset, offset + PER_PAGE);

      res.render("main/category", {
        title: "Category Page",
        layout: "main",
        books,
        categories,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },
  displayCategory: async (req, res, next) => {
    try {
      let categoryId = req.query.category;
      let books = await BooksModel.getByCategory(categoryId);

      const page = 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(books.length / PER_PAGE);

      books = books.slice(offset, offset + PER_PAGE);

      res.render("main/category", {
        title: "Category Page",
        layout: "main",
        books,
        categories: false,
        currentCategory: categoryId,
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
        } else if (filters?.category && typeof filters.category === "string") {
          let tmp = await CategoriesModel.getListBooksById(filters?.category);
          categoryFilterBooks.push(...tmp);
        }

        books = books.filter((itemA) =>
          categoryFilterBooks.some((itemB) => {
            return itemA._id.toString() === itemB._id.toString();
          })
        );
      }

      // Sorting logic based on the selected option
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "price-asc":
            books.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            books.sort((a, b) => b.price - a.price);
            break;
          case "name-asc":
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "name-desc":
            books.sort((a, b) => a.title.localeCompare(a.title));
            break;
          default:
            // Default sorting or no sorting
            break;
        }
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
