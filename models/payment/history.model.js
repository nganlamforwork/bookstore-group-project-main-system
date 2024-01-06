const db = require('../db');
const schema = 'payment_history';

const PaymentHistoryModel = {
	add: async (newHistory) => {
		try {
			await db.add(schema, newHistory);
		} catch (err) {
			console.error(err);
		}
	},
	get: async (customerId) => {
		try {
			const history = await db.getAll(schema, 'customerId', customerId);
			return history;
		} catch (err) {
			console.log(err);
		}
	},
};

module.exports = PaymentHistoryModel;
