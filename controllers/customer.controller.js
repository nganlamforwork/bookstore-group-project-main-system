const CustomerModel = require('../models/customer.model');
const AddressModel = require('../models/customer/addresses.model');
const bcrypt = require('bcrypt');

const customerController = {
	getProfilePage: async (req, res, next) => {
		try {
			if (req.session.user) {
				const { email } = req.session.user;
				const rs = await CustomerModel.get(email);
				let user = rs._doc;
				let defaultAddress = await AddressModel.get(
					user.default_address
				);
				let modifiedAvatar = user.avatar;
				if (user.avatar && user.avatar.startsWith('uploads')) {
					modifiedAvatar = '/' + user.avatar;
				}
				delete user.__v;
				delete user.password;
				const data = {
					title: 'Profile',
					full_name: user.first_name + ' ' + user.last_name,
					...user,
					avatar: modifiedAvatar,
					defaultAddress: defaultAddress,
					success: req.flash('success'),
					error: req.flash('error'),
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
	getLoginPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/auth/profile');
			}

			res.render('login', {
				title: 'Login',
				error: req.flash('error'),
				success: req.flash('success'),
			});
		} catch (err) {
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
	getInformationPage: async (req, res, next) => {
		try {
			if (req.session.user) {
				const rs = await CustomerModel.get(req.session.user.email);
				let user = rs._doc;
				let defaultAddress = await AddressModel.get(
					user.default_address
				);
				let modifiedAvatar = user.avatar;
				if (user.avatar && user.avatar.startsWith('uploads')) {
					modifiedAvatar = '/' + user.avatar;
				}
				delete user._id;
				delete user.__v;
				delete user.password;
				const data = {
					title: 'Information',
					...user,
					avatar: modifiedAvatar,
					defaultAddress: defaultAddress,
					success: req.flash('success'),
					error: req.flash('error'),
				};
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
			if (req.session.user) {
				const { cur_pw, new_pw } = req.body;
				const { email } = req.session.user;
				const customer = await CustomerModel.get(email);

				// Check if the current password matches the user's stored password
				const isPasswordMatch = await bcrypt.compare(
					cur_pw,
					customer.password
				);

				if (!isPasswordMatch) {
					req.flash('error', 'Current password is not matched');
					return res.redirect('/auth/profile');
				}

				const hash = await bcrypt.hash(new_pw, 10);

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
				req.flash('success', 'Change password successfully');
				res.redirect('/auth/profile');
			} else {
				res.redirect('/auth/login');
			}
		} catch (err) {
			next(err);
		}
	},
	uploadAvatar: async (req, res, next) => {
		try {
			const file = req.file;
			const { email } = req.session.user;
			if (!file) {
				const error = new Error('Please upload a file');
				error.httpStatusCode = 400;
				return next(error);
			}
			const updateData = {
				avatar: file.path,
			};

			const updateResult = await CustomerModel.update(email, updateData);
			if (!updateResult) {
				return res.redirect('/auth/profile/information');
			}

			req.session.user = { ...req.session.user, ...updateData };
			res.redirect('/auth/profile');
		} catch (err) {
			next(err);
		}
	},
};

module.exports = customerController;
