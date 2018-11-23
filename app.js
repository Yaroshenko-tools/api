require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080' , 'https://yaroshenko.tools'];
// const corsOptions = {
// 	origin: function (origin, callback) {
// 		if (allowedOrigins.indexOf(origin) !== -1) {
// 			callback(null, true)
// 		} else {
// 			callback(new Error('Not allowed by CORS'))
// 		}
// 	},
// 	methods: ['POST'],
// }

app.use(cors(corsOptions));
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
