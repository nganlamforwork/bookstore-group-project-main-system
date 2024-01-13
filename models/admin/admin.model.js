const db = require('../db');
const schema = 'users';

const AdminModel = {
	get: async (email) => {
		try {
			const adminQuery = {
				email: email,
				role: { $in: ['superadmin', 'admin'] },
			};

			const admin = await db.getQuery(schema, adminQuery);
			return admin;
		} catch (err) {
			console.error(err);
		}
	},
};

module.exports = AdminModel;
