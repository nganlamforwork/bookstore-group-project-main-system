const db = require('../db');
const schema = 'payment_balances';

const CardModel = {
	updateCard: async (customerId, cardInfo) => {
		try {
			const result = await db.update(
				schema,
				'customerId',
				customerId,
				cardInfo
			);
			return result;
		} catch (err) {
			console.error(err);
		}
	},
	getBalance: async (customerId) => {
		try {
			const balance = await db.get(schema, 'customerId', customerId);
			return balance;
		} catch (err) {
			console.log(err);
		}
	},
	updateBalance: async (balanceId, updatedBalance) => {
		try {
			const updateData = { amount: updatedBalance };
			const result = await db.update(schema, '_id', balanceId, updateData);
			return result;
		} catch (err) {
			console.log(err);
		}
	},
	getAdminBalance: async () => {
		try {
			const adminBalance = await db.get(schema, 'cardholderName', 'PAYMENT');
			return adminBalance;
		} catch (err) {
			console.log(err);
		}
	},
};

module.exports = CardModel;
