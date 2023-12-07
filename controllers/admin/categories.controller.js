const CategoriesModel = require("../../models/admin/categories.model");

const categoriesController = {
  getCategoriesPage: async (req, res, next) => {
    try {
      const allCategories = await CategoriesModel.getAll();
      res.render("dashboard/categories", {
        title: "Categories",
        layout: "admin",
        categories: allCategories,
      });
    } catch (error) {
      next(error);
    }
  },
  getDetailCategoryPage: async (req, res, next) => {
    try {
      const category = await CategoriesModel.getById(req.params.id);
      const books = await CategoriesModel.getListBooksById(req.params.id);

      const successMessage = req.query.success;
      res.render("dashboard/categoryDetail", {
        title: "Detail Category",
        layout: "admin",
        category: category,
        books: books,
        updateSuccess: successMessage,
      });
    } catch (error) {
      next(error);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      console.log(req.body);
      await CategoriesModel.add(req.body);
      res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const category = await CategoriesModel.getById(categoryId);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  getCategoryBySlug: async (req, res, next) => {
    try {
      const categorySlug = req.params.slug;
      const category = await CategoriesModel.getBySlug(categorySlug);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  deleteCategoryById: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      await CategoriesModel.deleteById(categoryId);
      res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  },
  updateDetailCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      await CategoriesModel.updateById(categoryId, req.body);
      res.redirect(
        `/admin/categories/${categoryId}?success=Category information updated successfully`
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoriesController;
