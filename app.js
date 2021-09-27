require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

import cors from 'cors';
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const allowedOrigins = process.env.NODE_ENV === "production" ? [process.env.APP_FRONTEND_URL] : false;
const corsOptions = {
	origin: function (origin, callback) {
		let corsOptions = {origin: false};

    if (!allowedOrigins) {
      corsOptions.origin = true;
    }

		if (allowedOrigins && allowedOrigins.indexOf(req.header('Origin')) !== -1) {
			corsOptions.origin = true; // disable CORS for this request
		}

		callback(null, corsOptions) // callback expects two parameters: error and
	},
	methods: ['GET', 'POST', 'OPTIONS'],
}
app.use(cors(corsOptions))

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });
// app.use(function(req, res, next) {
//
// 	const origin = req.headers.origin;
// 	if(allowedOrigins.indexOf(origin) > -1){
// 		res.setHeader('Access-Control-Allow-Origin', origin);
// 	}
// 	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	res.header('Access-Control-Allow-Credentials', true);
// 	return next();
// });

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
