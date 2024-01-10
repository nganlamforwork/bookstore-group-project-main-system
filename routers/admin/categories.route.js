const express = require("express");
const router = express.Router();
const CategoriesController = require("../../controllers/admin/categories.controller");

router.get("/", CategoriesController.displayCategories);
router.get("/:id", CategoriesController.displayDetailCategory);
router.post("/:id/update", CategoriesController.update);
router.post("/new", CategoriesController.add);
router.post("/delete/:id", CategoriesController.delete);

module.exports = router;
