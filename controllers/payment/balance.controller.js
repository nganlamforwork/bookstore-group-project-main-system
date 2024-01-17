const CardModel = require('../../models/payment/cards.model');
const PaymentHistoryModel = require('../../models/payment/history.model');

const BalanceController = {
	displayRecharge: async (req, res, next) => {
		try {
			const userId = req.params.userId;
			const user = req.session.user;
			const balance = await CardModel.getBalance(userId);
			res.render('payment/recharge', {
				title: 'Recharge Your Balance',
				layout: 'base',
				balance: balance,
				admin: user.role === 'superadmin',
			});
		} catch (error) {
			next(error);
		}
	},
	rechargeBalance: async (req, res, next) => {
		try {
			const { amount } = req.body;
			const userId = req.params.userId;

			// check if balance exists, refill
			const existingBalance = await CardModel.getBalance(userId);

			if (existingBalance) {
				// If the balance already exists, update its amount in the balance
				const updatedAmount =
					parseInt(existingBalance.amount) + parseInt(amount);

				if (updatedAmount < 0 && parseInt(amount) < 0) {
					await PaymentHistoryModel.add({
						customerId: userId,
						activity: 'Withdrawal',
						amount: parseInt(amount),
						income: true,
						success: false,
					});
					return res.status(400).send({
						success: false,
						message: 'Not enough money to withdraw',
					});
				}

				const result = await CardModel.updateBalance(
					existingBalance._id,
					updatedAmount
				);
				if (result.acknowledged) {
					if (parseInt(amount) >= 0) {
						await PaymentHistoryModel.add({
							customerId: userId,
							activity: 'Top-up Visa card',
							amount: parseInt(amount),
							income: true,
							success: true,
						});
						return res.status(200).send({
							success: true,
							message: 'Recharge balance successfully',
						});
					} else {
						await PaymentHistoryModel.add({
							customerId: userId,
							activity: 'Withdrawal',
							amount: parseInt(amount),
							income: true,
							success: true,
						});
						return res.status(200).send({
							success: true,
							message: 'Withdraw money successfully',
						});
					}
				} else {
					if (parseInt(amount) >= 0) {
						await PaymentHistoryModel.add({
							customerId: userId,
							activity: 'Top-up Visa card',
							amount: parseInt(amount),
							income: true,
							success: false,
						});
						return res.status(400).send({
							succes: false,
							message: 'Recharge balance failed',
						});
					} else {
						await PaymentHistoryModel.add({
							customerId: userId,
							activity: 'Withdrawal',
							amount: parseInt(amount),
							income: true,
							success: false,
						});
						return res.status(400).send({
							succes: false,
							message: 'Withdraw money failed',
						});
					}
				}
			}
		} catch (error) {
			next(error);
		}
	},
};

module.exports = BalanceController;
