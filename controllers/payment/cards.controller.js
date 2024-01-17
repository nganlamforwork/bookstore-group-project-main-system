const CardModel = require('../../models/payment/cards.model');

const paymentsController = {
	add: async (req, res, next) => {
		try {
			const { cardholderName, cardNumber, expires, cvv } = req.body;
			const userId = req.params.userId;
			await CardModel.updateCard(userId, {
				cardholderName: cardholderName,
				cardNumber: cardNumber,
				expires: expires,
				cvv: cvv,
			});
			res.status(200).send({
				success: true,
				message: 'Update card success',
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = paymentsController;
