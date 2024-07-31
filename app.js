var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors")
const products = require('./routes/products');
const users = require('./routes/users')
const posts = require('./routes/posts');
const imageDetails = require('./routes/imageDetails');
const auth = require('./routes/auth')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:1234@customer.ddbyyg7.mongodb.net/facebook?retryWrites=true&w=majority&appName=customer')
  .then(() => console.log('Database Connected successfully'))
  .catch((err) => console.error(err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/upload', express.static('uploads'))
app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', posts);
app.use('/image', imageDetails);
app.use('/products', products);

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
