const SubscriberModel = require('../../models/main/subscriber.model');

const SubscriberController = {
	add: async (req, res, next) => {
		try {
			const { email } = req.body;

			await SubscriberModel.add(email);
			req.flash('success', 'Thank you for support');
			res.redirect('/');
		} catch (err) {
			next(err);
		}
	},
	getAll: async (req, res, next) => {
		try {
			const subscribers = await SubscriberModel.getAll();
			const sanitizedSubscribers = subscribers.map((subscriber) => {
				return {
					email: subscriber.email || '',
					created_at: subscriber.created_at.toLocaleDateString(),
				};
			});
			res.status(200).send(sanitizedSubscribers);
		} catch (err) {
			next(err);
		}
	},
};

module.exports = SubscriberController;
