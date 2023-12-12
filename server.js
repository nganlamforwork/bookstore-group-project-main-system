require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { create } = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const fs = require('fs');
const https = require('https');
const http = require('http');

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const CustomError = require('./modules/custom_err');

const app = express();

// config
const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3001;
const localhost = process.env.HOST;
const SECRET_KEY = process.env.SECRET_KEY;

// template engine
const hbs = create({
	extname: '.hbs',
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
	helpers: require('./helper'),
});

app.use('/imgs', express.static('imgs'));
app.use('/uploads', express.static('uploads'));
app.use('/views', express.static('views'));

app.use(morgan('tiny'));
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
			maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
		},
	})
);
app.use(flash());

require('./modules/passport')(app);

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('home', {
		title: 'Home',
		success: req.flash('success'),
		error: req.flash('error'),
	});
});

// Define routes
const userRoutes = require('./routers/customer.route');
const adminRoutes = require('./routers/admin.route');
const subscriberRoutes = require('./routers/subscriber.route');
const productRoutes = require('./routers/product.route');

app.use('/auth', userRoutes);
app.use('/admin', adminRoutes);
app.use('/subscriber', subscriberRoutes);
app.use('/product', productRoutes);

// Using routes

// Handling invalid routes
app.use((req, res, next) => {
	res.status(404).render('error', {
		layout: false,
		code: 404,
		msg: 'Page not found',
		description: 'The page you’re looking for doesn’t exist.',
	});
});

// Handling custom errors
app.use((err, req, res, next) => {
	const statusCode = err instanceof CustomError ? err.statusCode : 500;
	res.status(statusCode).render('error', {
		layout: false,
		code: statusCode,
		msg: 'Server error',
		description: err.message,
	});
});

// app.listen(port, () => {
// 	console.log(`Server is running on: http://${localhost}:${port}`);
// });

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort, () => {
	console.log(`HTTP Server is running on: http://${localhost}:${httpPort}`);
});
httpsServer.listen(httpsPort, () => {
	console.log(`HTTPS Server is running on: http://${localhost}:${httpsPort}`);
});
