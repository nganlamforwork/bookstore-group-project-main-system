const express = require("express");
const router = express.Router();
const customerController = require("../../../controllers/main/customer.controller");

router.get("/", customerController.getProfilePage);
router.get("/information", customerController.getInformationPage);
router.post("/information", customerController.updateInformation);

router.get("/orders", customerController.getOrdersPage);
router.get("/payments", customerController.getPaymentsPage);

// Addresses Books
router.use("/addresses", require("./addresses.route"));

module.exports = router;
