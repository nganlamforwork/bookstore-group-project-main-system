const passport = require('passport');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/admin.model');
const MyStrategy = require('./strategy');

passport.serializeUser((user, done) => {
	done(null, user.email);
});

passport.deserializeUser(async (user, done) => {
	const foundUser = await AdminModel.get(user);

	if (foundUser) {
		return done(null, foundUser);
	}

	done('Invalid admin');
});

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(
		new MyStrategy(async (email, password, done) => {
			try {
				const user = await AdminModel.get(email);
				const rs = await bcrypt.compare(password, user.password);
				if (rs) {
					return done(null, user);
				}
				done('Invalid authentication', null);
			} catch (error) {
				done(error);
			}
		})
	);
};
