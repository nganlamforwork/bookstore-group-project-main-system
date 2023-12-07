const db = require("../db");
const schema = "categories";

const CategoriesModel = {
  getAll: async () => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "category_id",
            as: "books",
          },
        },
        {
          $addFields: {
            book_count: { $size: "$books" },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1,
            thumbnail: 1,
            book_count: 1,
          },
        },
      ];
      return await db.aggregate(schema, pipeline);
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
  getListBooksById: async (categoryId) => {
    try {
      return await db.getAll("books", "category_id", categoryId);
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
  updateById: async (categoryId, data) => {
    try {
      return await db.updateById(schema, categoryId, data);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = CategoriesModel;
