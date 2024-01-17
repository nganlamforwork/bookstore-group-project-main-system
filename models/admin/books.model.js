const db = require('../db');
const schema = 'books';

const BooksModel = {
	getAll: async () => {
		try {
			const pipeline = [
				{
					$lookup: {
						from: 'categories',
						localField: 'category_id',
						foreignField: '_id',
						as: 'categoryInfo',
					},
				},
				{
					$unwind: {
						path: '$categoryInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$authorInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						thumbnail: 1,
						title: 1,
						votes: 1,
						category_title: '$categoryInfo.title',
						author_name: 1,
						inventory: 1,
						price: 1,
						discount_id: 1,
						created_at: 1,
						last_updated: {
							$dateToString: {
								format: '%H:%M %d-%m-%Y', // Use %Y for a four-digit year
								date: '$last_updated',
								timezone: 'Asia/Ho_Chi_Minh', // Change this based on your timezone
							},
						},
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
			return await db.get(schema, '_id', bookId);
		} catch (error) {
			console.error(error);
		}
	},
	getByCategory: async (categoryId) => {
		try {
			const query = { category_id: categoryId };

			return await db.getAllQuery(schema, query);
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
			data.last_updated = new Date();

			return await db.updateById(schema, bookId, data);
		} catch (error) {
			console.error(error);
		}
	},
	search: async (searchQuery) => {
		try {
			return await db.search(schema, searchQuery);
		} catch (error) {
			console.error(error);
		}
	},
};

module.exports = BooksModel;
