var Express = require('express');
var connections = require('../Connections.js');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
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

router.get('/:id/Atts', function(req, res) {
   var query, params;

   if (req.validator.checkPrsOK(req.params.id))
      query = 'SELECT * from Attempt where ownerId = ?';
      params = [req.params.id];
      if (req.query.challengeName) {
         query += ' and challengeName = ?';
         params.push(req.query.challengeName);
      }

      connections.getConnection(res,
      function(cnn) {
         cnn.query(query, params,
         function(err, result) {
            res.json(result);
            cnn.release();
         });
      });
});

router.post('/:id/Atts', function(req, res) {
   var vld = req.validator;
   var chlName = req.body.challengeName;
   var owner = req.params.id;
   var chl;

   // console.log("\n\nChecking challengeName...");
   if (vld.chain(chlName, Tags.missingField, ['challengeName']).checkPrsOK(owner)) {

      // console.log(chlName + " verified! Getting connection...");
      connections.getConnection(res,
      function(cnn) {

         // console.log("Got connection, getting challenge...");
         cnn.query('select * from Challenge where name = ?', [chlName],
         function(err, result) {

            if (vld.check(result.length, Tags.badChlName)) {

               chl = result[0];
               // console.log("Got challenge: " + JSON.stringify(chl));
               cnn.query('SELECT * from Attempt where state = 2 and ownerId = ? '
                + 'and challengeName = ?',  [owner, chlName],
               function(err, result) {

                  // console.log("Got attempts: " + JSON.stringify(result));
                  if (vld.check(!result.length, Tags.incompAttempt)) {

                     // console.log("Getting attempts...");
                     cnn.query('SELECT * from Attempt where ownerId = ? '
                      + 'and challengeName = ?',  [owner, chlName],
                     function(err, result) {

                        // console.log("Got attempts: " + JSON.stringify(result));
                        if (vld.check(result.length < chl.attsAllowed, Tags.excessAtts)) {

                           // console.log("Making new attempt!!!!");
                           var attempt = {
                              ownerId: owner,
                              challengeName: chlName,
                              duration: 0,
                              score: -1,
                              startTime: new Date(),
                              state: 2
                           };
                           // console.log("Inserting into Attempt: " + JSON.stringify(attempt));
                           cnn.query('INSERT INTO Attempt SET ?', attempt,
                           function(err, result) {
                              // console.log("error: " + JSON.stringify(err));
                              // console.log("result: " + JSON.stringify(result));

                              res.location(router.baseURL + '/' + owner + '/Atts/'
                               + result.insertId).end();
                              cnn.release();
                           });
                        }
                        else {  // Att count exceeded
                           // console.log("Att count exceeded.");
                           cnn.release();
                        }
                     });
                  }
                  else { // Active att was found
                     // console.log("Active att was found.");
                     cnn.release();
                  }
               });
            }
            else { // Challenge name was bad
               // console.log("ERROR: bad challenge name.");
               cnn.release();
            }
         });
      });
   }
});

router.get('/:id/Crss', function(req, res) {
   // gets all courses that the person owns
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      var query = 'select * from Course where ownerId = ?';
      var params = [req.params.id];

      connections.getConnection(res, function(cnn) {
         cnn.query(query, params, function(err, result) {
            res.json(result);
            cnn.release();
         });
      });
   }
});

module.exports = router;
