const BalanceModel = require('../../models/payment/balance.model');
const PaymentHistoryModel = require('../../models/payment/history.model');

const balanceController = {
	show: async (req, res, next) => {
		try {
			const userId = req.params.userId;
			const balance = await BalanceModel.getBalance(userId);
			res.render('balance/recharge', {
				title: 'Recharge Your Balance',
				layout: 'base',
				balance: balance,
			});
		} catch (error) {
			next(error);
		}
	},
	rechargeBalance: async (req, res, next) => {
		try {
			const { cardholderName, cardNumber, expires, cvv, amount } = req.body;

			const userId = req.params.userId;

			// check if balance exists, refill
			const existingBalance = await BalanceModel.getBalance(userId);
			var result;
			if (existingBalance) {
				// If the balance already exists, update its amount in the balance
				const updatedAmount =
					parseInt(existingBalance.amount) + parseInt(amount);

				result = await BalanceModel.updateBalance(
					existingBalance._id,
					updatedAmount
				);
				if (!result.acknowledged) {
					await PaymentHistoryModel.add({
						customerId: userId,
						activity: 'Top-up Visa card',
						amount: amount,
						income: true,
						success: false,
					});
					res.status(400).send({
						succes: false,
						message: 'Recharge balance failed',
					});
				}
			} else {
				result = await BalanceModel.rechargeBalance(
					userId,
					cardholderName,
					cardNumber,
					expires,
					cvv,
					parseInt(amount)
				);
				if (!result.acknowledged) {
					await PaymentHistoryModel.add({
						customerId: userId,
						activity: 'Top-up Visa card',
						amount: amount,
						income: true,
						success: false,
					});
					res.status(400).send({
						succes: false,
						message: 'Recharge balance failed',
					});
				}
			}

			await PaymentHistoryModel.add({
				customerId: userId,
				activity: 'Top-up Visa card',
				amount: amount,
				income: true,
				success: true,
			});

			res.status(200).send({
				success: true,
				message: 'Recharge balance successfully',
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = balanceController;
