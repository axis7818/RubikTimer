var Express = require('express');
var connections = require('../Connections.js');
var Tags = require('../Validator.js').Tags;
var Scramble = require('./scrambles.js');
var async = require('async');
var router = Express.Router({caseSensitive: true});
router.baseURL = '/Cbs';

// gets a list of all cubes in the database
router.get('/', function(request, response) {
   connections.getConnection(response, function(cnn) {
      var query = 'select * from CubeType';
      cnn.query(query, [], function(err, result) {
         response.json(result);
         cnn.release();
      });
   });
});

// get a scramble for the cube
router.get('/:cubeId/Scbl', function(request, response) {
   var vld = request.validator;
   connections.getConnection(response, function(cnn) {
      var query = 'select * from CubeType where id = ?';
      var params = [request.params.cubeId];
      cnn.query(query, params, function(err, result) {
         var cube = result && result[0];
         if (vld.check(cube, Tags.notFound)) {
            var length = request.query.length || cube.scrambleLength;
            response.json(new Scramble(cube.name, length).generate());
         }
         cnn.release();
      });
   });
});

module.exports = router
