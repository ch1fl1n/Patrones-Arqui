let createError = require('http-errors');
let express = require('express');
let path = require('node:path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./index');

let app = express();

// enable CORS for all routes
app.use(cors());

// initialize database (creates table if missing)
require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  const wantsJson = req.xhr || (req.get('Accept')?.includes('application/json')) || req.originalUrl.startsWith('/todos');
  if (wantsJson) {
    return res.status(status).json({ error: err.message ? `Error: ${err.message}` : 'Error interno del servidor' });
  }

  // Mensajes en español para respuestas HTML
  res.locals.message = err.message ? `Error: ${err.message}` : 'Error interno del servidor';
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // renderizar la página de error
  res.status(status);
  res.render('error');
});

module.exports = app;
