const express = require("express");
const router = express.Router();
const LoginModel = require("../../models/main/login.model");

router.get("/getAll", async (req, res, next) => {
  try {
    const logins = await LoginModel.getAll();
    const sanitizedLogins = logins.map((log) => {
      return {
        ...log,
        time_login: log.time.toLocaleDateString(),
      };
    });

    res.status(200).send(sanitizedLogins);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
