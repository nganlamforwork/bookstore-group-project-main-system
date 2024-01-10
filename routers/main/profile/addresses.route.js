const express = require("express");
const router = express.Router();
const AddressController = require("../../../controllers/main/profile/addresses.controller");

router.get("/", AddressController.displayAddresses);
router.post("/:uid/add", AddressController.add);
router.post("/:uid/:id/delete", AddressController.delete);
router.post("/:uid/:id/update", AddressController.update);
module.exports = router;
