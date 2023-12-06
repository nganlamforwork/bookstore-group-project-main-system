const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const passport = require('passport');

router.get('/', adminController.getLoginAdmin);
router.post(
	'/login',
	passport.authenticate('myStrategy', {
		failureRedirect: '/admin',
	}),
	(req, res) => {
		res.redirect('/admin/dashboard');
	}
);
router.use((req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/admin');
});

// Protected routes - after the authentication middleware
router.get('/dashboard', adminController.getAdminDashboard);
router.get('/users', adminController.getUsers);
router.get('/subscribers', adminController.getSubscribers);

module.exports = router;
