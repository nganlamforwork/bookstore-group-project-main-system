const express = require("express");
const router = express.Router();
const addressController = require("../../controllers/customer/addresses.controller");

router.get("/", addressController.getAddressesPage);
router.post("/:uid/add", addressController.add);
router.post("/:uid/:id/delete", addressController.delete);
module.exports = router;
