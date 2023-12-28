require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { create } = require('express-handlebars');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

// setup https
const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const CustomError = require('./modules/custom_err.js');

const app = express();

// config
const paymentPort = process.env.PAYMENT_PORT || 5000;
const localhost = process.env.HOST;

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
app.use(express.static('public'));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Define routes
app.get('/', (req, res) => {
	res.send('Hello world');
});

// Using routes

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

const paymentServer = https.createServer(credentials, app);

paymentServer.listen(paymentPort, () => {
	console.log(
		`HTTPS Payment Server is running on: https://${localhost}:${paymentPort}`
	);
});
