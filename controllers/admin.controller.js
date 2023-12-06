const CustomerModel = require('../models/customer.model');
const SubscriberModel = require('../models/subscriber.model');

const adminController = {
	getLoginAdmin: async (req, res, next) => {
		try {
			if (req.isAuthenticated()) {
				res.redirect('/admin/dashboard');
			}
			res.render('dashboard/login', {
				title: 'Admin Login',
				layout: 'base',
			});
		} catch (error) {
			next(err);
		}
	},
	getAdminDashboard: async (req, res, next) => {
		try {
			res.render('dashboard/dashboards', {
				title: 'Admin Dashboard',
				layout: 'admin',
			});
		} catch (error) {
			next(err);
		}
	},
	getUsers: async (req, res, next) => {
		try {
			const users = await CustomerModel.getAll();
			const sanitizedUsers = users.map((user) => {
				return {
					first_name: user.first_name || '',
					last_name: user.last_name || '',
					email: user.email || '',
					phone: user.phone || '',
					default_payment: user.default_payment || '',
					default_address: user.default_address || '',
				};
			});

			res.render('dashboard/users', {
				title: 'Users',
				layout: 'admin',
				users: sanitizedUsers,
			});
		} catch (error) {
			next(err);
		}
	},
	getSubscribers: async (req, res, next) => {
		try {
			const subscribers = await SubscriberModel.getAll();
			const sanitizedSubscribers = subscribers.map((subscriber) => {
				return {
					email: subscriber.email || '',
					created_at: subscriber.created_at.toLocaleString(),
				};
			});

			res.render('dashboard/subscribers', {
				title: 'Subscribers',
				layout: 'admin',
				subscribers: sanitizedSubscribers,
			});
		} catch (error) {
			next(err);
		}
	},
};
module.exports = adminController;
