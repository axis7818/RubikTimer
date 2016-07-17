var Express = require('express');
var connections = require('../Connections.js');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
router.baseURL = '/Slvs';

router.post('/', function(request, response) {
   var vld = request.validator;
   var body = request.body;
   var solve = {
      ownerId: request.session.id,
   };

   connections.getConnection(response, function(cnn) {
      async.waterfall([
         // check to see if all fields are present
         function(callback) {
            if (vld.hasFields(body, ['scramble', 'time', 'cubeTypeId'], callback)) {
               solve['scramble'] = body.scramble;
               solve['time'] = body.time;
               solve['cubeTypeId'] = body.cubeTypeId;
               solve['whenSolved'] = new Date();

               var query = 'insert into Solve set ?';
               var params = [solve];
               cnn.query(query, params, callback);
            }
         },
         function(result, fields, callback) {
            response.location("/Prss/" + request.session.id + "/Slvs/" + result.insertId).send();
            callback();
         },
      ], function(err, result) {
         if (vld === err) {
            vld.closeResponse();
         }
         else if (vld.check(!err, Tags.queryFailed, [err]))
            ;
         cnn.release();
      });
   });
});

module.exports = router;
