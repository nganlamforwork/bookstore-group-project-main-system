const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/login', customerController.getLoginPage);
router.get('/register', customerController.getRegisterPage);
router.post('/login', customerController.login);
router.post('/register', customerController.register);
router.get('/logout', customerController.logOut);
router.get('/profile/', customerController.getProfilePage);
router.get('/profile/information', customerController.getInformationPage);
router.post('/profile/information', customerController.updateInformation);
router.get('/profile/orders', customerController.getOrdersPage);
router.get('/profile/payments', customerController.getPaymentsPage);
router.get('/profile/addresses', customerController.getAddressesPage);

module.exports = router;
