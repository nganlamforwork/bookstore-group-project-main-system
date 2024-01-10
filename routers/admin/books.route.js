const express = require("express");
const router = express.Router();
const BooksController = require("../../controllers/admin/books.controller");

router.get("/", BooksController.displayBooks);
router.get("/:id", BooksController.displayDetailBook);
router.post("/:id/update", BooksController.update);
router.post("/new", BooksController.add);
router.post("/delete/:id", BooksController.delete);

module.exports = router;
