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

const corsOrigin =
  process.env.APP_FRONTEND_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://yaroshenko.tools' : true)

app.use(cors({ origin: corsOrigin }))
app.options('*', cors({ origin: corsOrigin }))

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
  if (res.headersSent) {
    return next(err)
  }

  const status = err.status || 500

  if (req.path.startsWith('/shortener') || req.path.startsWith('/campaign-generator')) {
    return res.status(status).json({ error: err.message || 'Internal Server Error' })
  }

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(status)
  res.render('error')
})

module.exports = app;
