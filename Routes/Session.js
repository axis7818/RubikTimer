// This middleware assumes cookieParser has been "used" before this

var crypto = require('crypto');

var sessions = {};
var duration = 7200000; // Two hours in milliseconds
var cookieName = 'RubikAuth';

exports.router = function(req, res, next) {
   if (req.cookies[cookieName]) {
      var thisSession = sessions[req.cookies[cookieName]];
      if (thisSession) {
         if (thisSession.lastUsed < new Date().getTime() - duration) {
            delete thisSession;
         }
         else {
            thisSession.lastUsed = new Date().getTime();
            req.session = sessions[req.cookies[cookieName]];
         }
      }
   }
   next();
};

var Session = function Session(user) {
   this.firstName = user.firstName;
   this.lastName = user.lastName;
   this.id = user.id;
   this.email = user.email;
   this.loginTime = new Date().getTime();
   this.lastUsed = new Date().getTime();
   this.role = user.role;
};

Session.prototype.isAdmin = function() {
   return this.role == 1;
};

exports.makeSession = function makeSession(user, res) {
   var cookie = crypto.randomBytes(16).toString('hex');
   var session = new Session(user);

   res.cookie(cookieName, cookie, { maxAge: duration, httpOnly: true });
   sessions[cookie] = session;

   return cookie;
};

exports.deleteSession = function(cookie) {
   delete sessions[cookie];
};

exports.cookieName = cookieName;
exports.sessions = sessions;
