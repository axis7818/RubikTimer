var Express = require('express');
var connections = require('../Connections.js');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
router.baseURL = '/Prss';

router.get('/', function(req, res) {
   var specifier = req.query.email || !req.session.isAdmin() && req.session.email;

   connections.getConnection(res, function(cnn) {
      var handler = function(err, prsArr) {
         res.json(prsArr);
         cnn.release();
      }

      if (specifier)
         cnn.query('select id, email from Person where email = ?',
          [specifier], handler);
      else
         cnn.query('select id, email from Person', handler);
   });
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();

   if (admin && !body.password)
      body.password = "*";                       // Blocking password
   body.whenRegistered = new Date();

   // This chain seems like it will always return the last test, not false if any fail
   // This can be seen by an attempt to post an admin with no AU
   if (vld.hasFields(body, ["email", "lastName", "role", "password"])
    && vld.chain(body.role == 0 || admin, Tags.noPermission)
    .chain(body.hasOwnProperty("termsAccepted") || admin, Tags.missingField, ["termsAccepted"])
    .check(body.role >= 0, Tags.badValue, ["role"])
    && vld.check(body.termsAccepted === true || admin, Tags.badValue, ["termsAccepted"])) {
      connections.getConnection(res,
      function(cnn) {
         cnn.query('SELECT * from Person where email = ?', body.email,
         function(err, result) {
            if (req.validator.check(!result.length, Tags.dupEmail)) {
               body.termsAccepted = body.termsAccepted && new Date();
               delete body.termsAccepted;
               cnn.query('INSERT INTO Person SET ?', body,
               function(err, result) {
                  if (err){
                     console.log(JSON.stringify(err));
                     res.status(400).json(err);
                  }
                  else
                     res.location(router.baseURL + '/' + result.insertId).end();
                  cnn.release();
               });
            } else
               cnn.release();
         });
      });
   }
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      connections.getConnection(res,
      function(cnn) {
         cnn.query('select * from Person where id = ?', [req.params.id],
         function(err, prsArr) {
            if (vld.check(prsArr.length, Tags.notFound)) {
               res.json(prsArr[0]);
            }
            cnn.release();
         });
      });
   }
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var admin = req.session.isAdmin();

   if (vld.checkPrsOK(req.params.id)
    && vld.chain(!body.hasOwnProperty('role') || body.role === 0 || admin, Tags.noPermission)
    .check(body.password === undefined || body.oldPassword || admin, Tags.noOldPwd)) {

      connections.getConnection(res, function(cnn) {
         cnn.query('select * from Person where id = ?', [req.params.id], function(err, result) {
            if (vld.check(admin || !body.password || result[0].password === body.oldPassword, Tags.oldPwdMismatch)) {
               delete body.oldPassword;
               cnn.query('update Person set ? where id = ?', [body, req.params.id], function(err) {
                  if (err)
                     res.status(400);
                  res.end();
                  cnn.release();
               });
            }
            else {
               cnn.release();
            }
         });
      });
   }

   res.end();
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkAdmin()) {
      connections.getConnection(res, function(cnn) {
         cnn.query('select * from Person where id = ?', [req.params.id],
         function (err, result) {
            result = result.length && result[0];
            if (vld.check(result, Tags.notFound)) {
               cnn.query('DELETE from Person where id = ?', [req.params.id],
               function (err) {
                  res.end();
                  cnn.release();
               });
            }
            else {
               cnn.release();
            }
         });
      });
   }
});

router.get('/:id/Slvs', function(request, response) {
   if (request.validator.checkPrsOK(request.params.id)) {
      connections.getConnection(response, function(cnn) {
         var query = 'select * from Solve where ownerId = ?';
         var params = [request.params.id];
         cnn.query(query, params, function(err, result) {
            response.json(result);
            cnn.release();
         });
      });
   }
});

router.get('/:id/Slvs/:slvId', function(request, response) {
   var vld = request.validator;

   connections.getConnection(response, function(cnn) {
      async.waterfall([
         // check person ok
         function(callback) {
            if (vld.checkPrsOK(request.params.id, callback)) {
               callback();
            }
         },
         function(callback) {
            var query = 'select * from Solve where id = ? and ownerId = ?';
            var params = [request.params.slvId, request.params.id];
            cnn.query(query, params, callback);
         },
         function(result, fields, callback) {
            var solve = result.length && result[0];
            if (vld.check(solve, Tags.notFound, [], callback)) {
               response.json(solve);
               callback();
            }
         },
      ], function(err, result) {
         if (vld === err)
            vld.closeResponse();
         else if (vld.check(!err, Tags.queryFailed, [err]))
            ;
         cnn.release();
      });
   });
});

module.exports = router;
