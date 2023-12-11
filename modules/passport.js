const passport = require('passport');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/admin.model');
const CustomerModel = require('../models/customer.model');
const MyStrategy = require('./strategy');
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.email);
});

passport.deserializeUser(async (user, done) => {
	const foundUser = await AdminModel.get(user);

	if (foundUser) {
		return done(null, foundUser);
	}

	done('Invalid Admin');
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

	passport.use(
		'google',
		new OAuth2Strategy(
			{
				authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
				tokenURL: 'https://accounts.google.com/o/oauth2/token',
				clientID:
					'836146666513-o329tmhh1d76dpep6nj9tv25mknmjpf1.apps.googleusercontent.com',
				clientSecret: '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',
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Check if the user already exists in your database
					const user = await CustomerModel.get({
						googleId: profile.id,
					});

					if (user) {
						return done(null, user);
					}

					// If the user doesn't exist, create a new user using Google profile data
					const newUser = await CustomerModel.create({
						googleId: profile.id,
						// Add other relevant profile information here
					});
					return done(null, newUser);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};
