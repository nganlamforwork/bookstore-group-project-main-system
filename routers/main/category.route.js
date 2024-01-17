const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/main/category.controller.js");

router.get("/", CategoryController.displayCategories);
router.get("/all", CategoryController.displayAllCategories);
router.get("/detail", CategoryController.displayCategory);
router.get("/detail/filter", CategoryController.filter);

module.exports = router;
