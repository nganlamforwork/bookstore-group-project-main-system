const db = require("../db");
const schema = "categories";

const CategoriesModel = {
  getAll: async () => {
    try {
      return await db.getAll(schema);
    } catch (error) {
      console.error(error);
    }
  },

  add: async (data) => {
    try {
      await db.add(schema, data);
    } catch (error) {
      console.error(error);
    }
  },

  getById: async (categoryId) => {
    try {
      return await db.get(schema, "_id", categoryId);
    } catch (error) {
      console.error(error);
    }
  },

  getBySlug: async (categorySlug) => {
    try {
      return await db.get(schema, "slug", categorySlug);
    } catch (error) {
      console.error(error);
    }
  },
  deleteById: async (categoryId) => {
    try {
      return await db.deleteById(schema, categoryId);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = CategoriesModel;
