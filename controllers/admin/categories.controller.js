const CategoriesModel = require("../../models/admin/categories.model");

const categoriesController = {
  getCategories: async (req, res, next) => {
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
};

module.exports = categoriesController;
