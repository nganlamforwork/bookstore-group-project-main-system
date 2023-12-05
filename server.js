require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const { create } = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const CustomError = require("./modules/custom_err");

const app = express();

// config
const port = process.env.PORT || 21337;
const localhost = process.env.HOST;
const SECRET_KEY = process.env.SECRET_KEY;

// template engine
const hbs = create({ extname: ".hbs" });

app.use("/imgs", express.static("imgs"));
app.use("/views", express.static("views"));

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(SECRET_KEY));
app.use(
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

// authen
app.use(passport.initialize());
app.use(passport.session());

app.engine("hbs", hbs.engine);
app.set("views", "./views");
app.set("view engine", "hbs");

// app.use((req, res, next) => {
// 	res.locals.isLogged = req.session.user ? true : false;
// 	next();
// });

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

// Define routes
const userRoutes = require("./routers/customer.route");
const adminRoutes = require("./routers/admin.route");
app.use("/auth", userRoutes);
app.use("/admin", adminRoutes);

// Using routes

// Handling invalid routes
app.use((req, res, next) => {
  res.status(404).render("error", {
    layout: false,
    code: 404,
    msg: "Page not found",
    description: "The page you’re looking for doesn’t exist.",
  });
});

// Handling custom errors
app.use((err, req, res, next) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  res.status(statusCode).render("error", {
    layout: false,
    code: statusCode,
    msg: "Server error",
    description: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on: http://${localhost}:${port}`);
});
