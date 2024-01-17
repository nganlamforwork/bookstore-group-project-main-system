const bcrypt = require('bcrypt');
const moment = require('moment');
const UserModel = require('../../models/payment/user.model');
const CardModel = require('../../models/payment/cards.model');
const PaymentHistoryModel = require('../../models/payment/history.model');

const HomeController = {
	displayHome: async (req, res, next) => {
		try {
			if (!req.session.user) {
				res.redirect('/auth/login');
				return;
			}
			const user = req.session.user;
			var income = 0,
				expense = 0;

			var balance = await CardModel.getBalance(user._id);

			if (user.role === 'superadmin') {
				transactions = await PaymentHistoryModel.getAll();
				transactions.sort((a, b) => b.date - a.date);
				transactions.map((trans) => {
					if (trans.success && !trans.income) {
						income += parseInt(trans.amount);
					}
				});

				bank_transactions = await PaymentHistoryModel.getBankTransactions();
				bank_transactions.sort((a, b) => b.date - a.date);
				bank_transactions.map((trans) => {
					if (trans.success && trans.income && trans.amount < 0)
						expense += trans.amount * -1;
				});
				withdraw_transactions = bank_transactions
					.filter((trans) => trans.income && trans.amount < 0)
					.map((trans) => {
						if (trans.amount < 0) {
							return {
								...trans._doc,
								amount: trans.amount * -1,
							};
						}
						return trans;
					});
			} else {
				transactions = await PaymentHistoryModel.get(user._id);
				transactions.sort((a, b) => b.date - a.date);
				transactions.forEach((transaction) => {
					transaction.date = moment(transaction.date).format(
						'DD MMM YYYY - HH:mm:ss'
					);
				});

				transactions.map((trans) => {
					if (trans.success) {
						if (trans.income) {
							income += parseInt(trans.amount);
						} else {
							expense += parseInt(trans.amount);
						}
					}
				});
			}
			req.session.balance = balance;

			let filters = req.query;

			const PER_PAGE = 4;
			const page = parseInt(filters?.page) || 1;
			const offset = (page - 1) * PER_PAGE;
			const totalPages = Math.ceil(transactions.length / PER_PAGE);

			transactions = transactions.slice(offset, offset + PER_PAGE);

			res.render('payment/home', {
				title: 'Payment - Home',
				layout: 'payment',
				transactions: transactions,
				withdraw_transactions:
					user.role === 'superadmin' ? withdraw_transactions : null,
				balance: balance,
				income: income,
				expense: expense,
				error: req.flash('error'),
				success: req.flash('success'),
				admin: user.role === 'superadmin',
				currentPage: page,
				totalPages,
				available:
					balance.cardNumber &&
					balance.cardholderName &&
					balance.cvv &&
					balance.expires,
			});
		} catch (error) {
			next(error);
		}
	},
	displayLogIn: async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/');
			}
			res.render('payment/login', {
				title: 'Log In',
				layout: 'payment',
				error: req.flash('error'),
				success: req.flash('success'),
			});
		} catch (err) {
			next(err);
		}
	},

	logIn: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const founded = await UserModel.get(email);

			if (!founded) {
				req.flash('error', `User with ${email} not founded`);
				return res.redirect('/auth/login');
			}

			bcrypt.compare(password, founded.password, function (err, result) {
				if (err || !result) {
					req.flash('error', 'Wrong password for that email');
					req.session.save((err) => {
						if (err) {
							return next(err);
						}
						res.redirect('/auth/login');
					});
				} else {
					req.session.user = founded;
					req.flash('success', 'Welcome back');
					req.session.save((err) => {
						if (err) {
							return next(err);
						}
						res.redirect('/');
					});
				}
			});
		} catch (err) {
			next(err);
		}
	},
	logOut: async (req, res, next) => {
		try {
			req.session.destroy((err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/auth/login');
			});
		} catch (err) {
			next(err);
		}
	},

	paging: async (req, res, next) => {
		try {
			const user = req.session.user;
			var income = 0,
				expense = 0;

			var balance = await CardModel.getBalance(user._id);

			if (user.role === 'superadmin') {
				transactions = await PaymentHistoryModel.getAll();
				transactions.sort((a, b) => b.date - a.date);
				transactions.map((trans) => {
					if (trans.success && !trans.income) {
						income += parseInt(trans.amount);
					}
				});

				bank_transactions = await PaymentHistoryModel.getBankTransactions();
				bank_transactions.sort((a, b) => b.date - a.date);
				bank_transactions.map((trans) => {
					if (trans.success && trans.income && trans.amount < 0)
						expense += trans.amount * -1;
				});
				withdraw_transactions = bank_transactions
					.filter((trans) => trans.income && trans.amount < 0)
					.map((trans) => {
						if (trans.amount < 0) {
							return {
								...trans._doc,
								amount: trans.amount * -1,
							};
						}
						return trans;
					});
			} else {
				transactions = await PaymentHistoryModel.get(user._id);
				transactions.sort((a, b) => b.date - a.date);
				transactions.forEach((transaction) => {
					transaction.date = moment(transaction.date).format(
						'DD MMM YYYY - HH:mm:ss'
					);
				});

				transactions.map((trans) => {
					if (trans.success) {
						if (trans.income) {
							income += parseInt(trans.amount);
						} else {
							expense += parseInt(trans.amount);
						}
					}
				});
			}
			const PER_PAGE = 4;
			let filters = req.query;

			const page = parseInt(filters?.page) || 1;
			const offset = (page - 1) * PER_PAGE;
			const totalPages = Math.ceil(transactions.length / PER_PAGE);

			transactions = transactions.slice(offset, offset + PER_PAGE);

			req.session.balance = balance;

			res.json({
				currentPage: page,
				totalPages,
				income: income,
				expense: expense,
				balance: balance,
				transactions: transactions,
				withdraw_transactions:
					user.role === 'superadmin' ? withdraw_transactions : null,
				admin: user.role === 'superadmin',
				available:
					balance.cardNumber &&
					balance.cardholderName &&
					balance.cvv &&
					balance.expires,
			});
		} catch (err) {
			res.status(500).json(err);
			console.log(err);
		}
	},
};

module.exports = HomeController;
