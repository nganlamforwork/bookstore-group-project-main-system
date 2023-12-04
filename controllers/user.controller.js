const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const userController = {
	getLoginPage: async (req, res, next) => {
		try {
			res.render('login', {
				title: 'Login',
			});
		} catch (error) {
			next(err);
		}
	},
	getRegisterPage: async (req, res, next) => {
		try {
			res.render('register', {
				title: 'Register',
			});
		} catch (error) {
			next(err);
		}
	},
	signUp: async (req, res, next) => {
		try {
			const { username, password, fullname, email, dob } = req.body;
			bcrypt.hash(password, 10, async function (err, hash) {
				if (err) {
					return next(err);
				}

				await UserModel.addUser(username, hash, email, fullname, dob);
				res.redirect('/');
			});
		} catch (err) {
			next(err);
		}
	},

	signIn: async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const foundUser = await UserModel.getUser(username);
			if (!foundUser) return;
			bcrypt.compare(
				password,
				foundUser.Password,
				function (err, result) {
					if (err) {
						return next(err);
					}
					res.redirect('/');
				}
			);
		} catch (err) {
			next(err);
		}
	},
	signOut: async (req, res, next) => {
		try {
			res.redirect('/auth/signin');
		} catch (err) {
			next(err);
		}
	},
};

module.exports = userController;
