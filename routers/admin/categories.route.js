const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/admin/categories.controller");

router.get("/", categoriesController.getCategories);
router.post("/new", categoriesController.addCategory);
router.post("/delete/:id", categoriesController.deleteCategoryById);

module.exports = router;
