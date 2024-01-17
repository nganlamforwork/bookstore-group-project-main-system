const express = require('express');
const router = express.Router();
const HomeController = require('../../controllers/main/home.controller.js');

router.get('/', HomeController.displayHome);
router.get('/search', HomeController.displaySearchPage);

module.exports = router;
