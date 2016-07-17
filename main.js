var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var cnnPool = require('./Routes/Connections.js');

var async = require('async');

var app = express();
app.numRequests = 0;

app.use(function(req, res, next) {
   app.numRequests++;
   console.log("[" + app.numRequests + "] " + req.method + ": " + req.path);
   next();
})

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'public')));

// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

app.use(function(req, res, next) {
   req.validator = new Validator(req, res);

   if (req.session || (req.method === 'POST' &&
    (req.path === '/Prss' || req.path === '/Ssns')))
      next();
   else
      res.status(401).json([{tag: Validator.Tags.noLogin}]);

});

app.use('/Prss', require('./Routes/Account/Prss'));
app.use('/Ssns', require('./Routes/Account/Ssns'));
app.use('/Cbs', require('./Routes/Cubes/Cbs'));

app.delete('/DB', function(req, res) {

   cnnPool.getConnection(res, function(cnn) {
      async.series([
         function(callback){
            cnn.query('delete from Person', callback);
         },
         function(callback) {
            cnn.query('delete from SolveGroup', callback);
         },
         function(callback){
            cnn.query('alter table Person auto_increment = 1', callback);
         },
         function(callback){
            cnn.query('alter table SolveGroup auto_increment = 1', callback);
         },
         function(callback){
            cnn.query('alter table Solve auto_increment = 1', callback);
         },
         function(callback){
            cnn.query('INSERT INTO Person (id, firstName, lastName, email,' +
                ' password, whenRegistered, role) VALUES (' +
                '1, "Admin", "IAM", "Admin@11.com","password", NOW(), 2);'
            , callback);
         },
         function(callback){
            for (var session in Session.sessions)
               delete Session.sessions[session];
            res.send();
         }
      ],
      function(err, status) {
         console.log(err);
      }
   );
   cnn.release();
   });
});

app.use(function(err, req, res, next) {
   console.error(err.stack);
   res.status(500).send('error', {error: err});
});

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
   console.log('App Listening on port 3000');
});
