const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const schema = "login";

const LoginsTrackerModel = {
  create: async function ({ user, req }) {
    // get ip address
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress;

    // get the user agent
    const ua = req.headers["user-agent"];
    const device = ua
      .substring(ua.indexOf("(") + 1, ua.indexOf(")"))
      .replace(/_/g, ".");
    const uarr = ua.split(" ");
    const browser = uarr[uarr.length - 1];

    const newLogin = {
      id: uuidv4(),
      user_id: user,
      ip: ip,
      time: new Date(),
      browser: browser,
      device: device,
    };

    await db.add(schema, newLogin);
    return { status: true, msg: `A User has logged in` };
  },
  getAll: async () => {
    try {
      const logins = await db.getAll(schema);
      return logins;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = LoginsTrackerModel;
