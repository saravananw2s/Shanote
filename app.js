var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var braintree = require("braintree");
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2xznv882bsn3x79f",
  publicKey: "c4tpqcbpxvsx9b3b",
  privateKey: "3ef7ef6614b02dd5c0fe79c1c8916fb2"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});
app.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  gateway.transaction.sale({
  amount: "10.00",
  paymentMethodNonce: nonceFromTheClient,
  options: {
    submitForSettlement: true
  }
}, function (err, result) {
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found file');
  err.status = 404;
  next(err);
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
app.listen(9000, function () {  
  console.log('Example app listening on port 8000!');  
});  
module.exports = app;
