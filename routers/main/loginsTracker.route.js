const express = require("express");
const router = express.Router();
const LoginsTrackerModel = require("../../models/main/loginsTracker.model");

router.get("/getAll", async (req, res, next) => {
  try {
    const logins = await LoginsTrackerModel.getAll();
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
