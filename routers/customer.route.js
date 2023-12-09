const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uid = req.params.uid;
		const uploadDir = `./uploads/${uid}`; // Directory for the specific catId
		fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
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
router.post(
	'/:uid/profile/avatar',
	upload.single('avatar'),
	customerController.uploadAvatar
);

module.exports = router;
