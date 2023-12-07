const db = require("../db");
const schema = "books";

const BooksModel = {
  getAll: async () => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: {
            path: "$categoryInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "authorInfo",
          },
        },
        {
          $unwind: {
            path: "$authorInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            thumbnail: 1,
            title: 1,
            votes: 1,
            category_title: "$categoryInfo.title",
            author_name: "$authorInfo.name", // Thay thế 'name' bằng trường tên của tác giả
            inventory: 1,
            price: 1,
            discount_id: 1,
            created_at: 1,
            last_updated: 1,
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

  getById: async (bookId) => {
    try {
      return await db.get(schema, "_id", bookId);
    } catch (error) {
      console.error(error);
    }
  },

  deleteById: async (bookId) => {
    try {
      return await db.deleteById(schema, bookId);
    } catch (error) {
      console.error(error);
    }
  },

  updateById: async (bookId, data) => {
    try {
      return await db.updateById(schema, bookId, data);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = BooksModel;
