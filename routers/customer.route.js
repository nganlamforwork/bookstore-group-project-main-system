const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
const upload = multer({ storage: storage });

const customerController = require('../controllers/customer.controller');

router.get('/login', customerController.getLoginPage);
router.get('/register', customerController.getRegisterPage);
router.post('/login', customerController.login);
router.post('/register', customerController.register);
router.post('/change-password', customerController.changePassword);
router.get('/logout', customerController.logOut);
router.get('/profile/', customerController.getProfilePage);
router.get('/profile/information', customerController.getInformationPage);
router.post('/profile/information', customerController.updateInformation);
router.get('/profile/orders', customerController.getOrdersPage);
router.get('/profile/payments', customerController.getPaymentsPage);
router.get('/profile/addresses', customerController.getAddressesPage);

module.exports = router;
