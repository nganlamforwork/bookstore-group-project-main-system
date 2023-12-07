const CustomerModel = require('../models/customer.model');
const bcrypt = require('bcrypt');

const customerController = {
	getProfilePage: async (req, res, next) => {
		try {
			if (req.session.user) {
				const { email } = req.session.user;
				const rs = await CustomerModel.get(email);
				let user = rs._doc;
				delete user._id;
				delete user.__v;
				delete user.password;
				const data = {
					title: 'Profile',
					full_name: user.first_name + ' ' + user.last_name,
					...user,
				};
				res.render('customers/profile', data);
			} else res.redirect('/auth/login');
		} catch (error) {
			next(err);
		}
	},
	getOrdersPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				res.render('customers/orders', {
					title: 'Orders History',
				});
			} else res.redirect('/auth/login');
		} catch (error) {
			next(err);
		}
	},
	getPaymentsPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				res.render('customers/payments', {
					title: 'Payment Methods',
				});
			} else res.redirect('/auth/login');
		} catch (error) {
			next(err);
		}
	},
	getAddressesPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				res.render('customers/addresses', {
					title: 'Addresses Book',
				});
			} else res.redirect('/auth/login');
		} catch (error) {
			next(err);
		}
	},
	getLoginPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/auth/profile');
			}

			res.render('login', {
				title: 'Login',
			});
		} catch (error) {
			next(err);
		}
	},
	getRegisterPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/auth/profile');
			}
			res.render('register', {
				title: 'Create account',
			});
		} catch (error) {
			next(err);
		}
	},
	register: async (req, res, next) => {
		try {
			const { firstname, lastname, email, password } = req.body;

			bcrypt.hash(password, 10, async function (err, hash) {
				if (err) {
					return next(err);
				}

				const rs = await CustomerModel.add(
					firstname,
					lastname,
					email,
					hash
				);
				if (!rs.status) {
					return res.render('register', { error: rs.msg });
				}

				res.redirect('/auth/login');
			});
		} catch (err) {
			next(err);
		}
	},

	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const founded = await CustomerModel.get(email);
			if (!founded)
				return res.render('login', {
					error: `User with ${email} not founded`,
				});

			bcrypt.compare(password, founded.password, function (err, result) {
				if (err || !result) {
					return res.render('login', {
						error: 'Wrong password for that email',
					});
				} else {
					req.session.user = founded;
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
	getInformationPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				const rs = await CustomerModel.get(req.session.user.email);
				let user = rs._doc;
				delete user._id;
				delete user.__v;
				delete user.password;
				const data = { title: 'Information', ...user };
				res.render('customers/information', data);
			} else res.redirect('/auth/login');
		} catch (error) {
			next(err);
		}
	},
	updateInformation: async (req, res, next) => {
		try {
			if (req.session.user) {
				const { email } = req.session.user;
				const { firstname, lastname, phone } = req.body;

				const updateData = {
					first_name: firstname,
					last_name: lastname,
					phone: String(phone),
				};

				const updateResult = await CustomerModel.update(
					email,
					updateData
				);
				if (!updateResult) {
					return res.redirect('/auth/profile/information');
				}

				req.session.user = { ...req.session.user, ...updateData };

				res.redirect('/auth/profile');
			} else {
				res.redirect('/auth/login');
			}
		} catch (error) {
			next(error);
		}
	},
	changePassword: async (req, res, next) => {
		try {
			const { cur_pw, new_pw } = req.body;
			const email = req.session?.user?.email;
			const customer = await CustomerModel.get(email);
			if (!customer) {
				return res.status(404).json({ error: 'User not found' });
			}

			// Check if the current password matches the user's stored password
			bcrypt.compare(cur_pw, customer.password, function (err, result) {
				if (err || !result) {
					console.log({ error: 'Current password is not matched' });
				}
			});

			// Hash new password
			bcrypt.hash(new_pw, 10, async function (err, hash) {
				if (err) {
					return next(err);
				}

				// Update the customer's password
				customer.password = hash;
				// update customer information
				const updateResult = await CustomerModel.update(
					email,
					customer
				);
				if (!updateResult) {
					return res.redirect('/auth/profile');
				}

				req.session.user = customer;
				res.redirect('/auth/profile');
			});
		} catch (err) {
			next(err);
		}
	},
};

module.exports = customerController;
