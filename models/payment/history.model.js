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
			const transactions = await db.getAll(schema, 'customerId', customerId);
			return transactions;
		} catch (err) {
			console.log(err);
		}
	},
	getAll: async () => {
		try {
			const query = {
				income: false,
			};
			const transactions = await db.getAllQuery(schema, query);
			return transactions;
		} catch (err) {
			console.error(err);
		}
	},
	getBankTransactions: async () => {
		try {
			const query = {
				income: true,
			};
			const transactions = await db.getAllQuery(schema, query);
			return transactions;
		} catch (err) {
			console.error(err);
		}
	},
};

module.exports = PaymentHistoryModel;
