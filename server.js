require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { create } = require('express-handlebars');

const CustomError = require('./modules/custom_err');

const app = express();
const port = process.env.PORT || 21337;
const localhost = process.env.HOST;

const hbs = create({ extname: '.hbs' });
const SECRET_KEY = process.env.SECRET_KEY;

app.use('/imgs', express.static('imgs'));
app.use('/views', express.static('views'));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(SECRET_KEY));
app.use(
	session({
		secret: SECRET_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
		},
	})
);

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

// app.use((req, res, next) => {
// 	res.locals.isLogged = req.session.user ? true : false;
// 	next();
// });

app.get('/', (req, res) => {
	// if (!req.session.user) {
	// 	return res.redirect('/auth/signin');
	// }
	res.render('home', {
		title: 'Home',
		isLogged: req.session.user ? true : false,
	});
});

// Define routes

// Using routes

// Handling invalid routes
app.use((req, res, next) => {
	res.status(404).render('error', {
		code: 404,
		msg: 'Page not found',
		description: 'The page you’re looking for doesn’t exist.',
	});
});

// Handling custom errors
app.use((err, req, res, next) => {
	const statusCode = err instanceof CustomError ? err.statusCode : 500;
	res.status(statusCode).render('error', {
		code: statusCode,
		msg: 'Server error',
		description: err.message,
	});
});

app.listen(port, () => {
	console.log(`Server is running on: http://${localhost}:${port}`);
});
