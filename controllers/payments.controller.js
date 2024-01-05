const BalanceModel = require('../models/balance.model');

const paymentsController = {
	addNewPayment: async (req, res, next) => {
		try {
			const { cardholderName, cardNumber, expires, cvv } = req.body;
			const amount = 0;
			const userId = req.params.userId;
			await BalanceModel.rechargeBalance(
				userId,
				cardholderName,
				cardNumber,
				expires,
				cvv,
				amount
			);
			res.status(200).send({
				success: true,
				message: 'Add new payment method success',
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = paymentsController;
