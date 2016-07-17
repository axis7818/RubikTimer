app.controller('timerController', ['$scope', '$http', 'dialog', function(scope, http, dialog) {
   window.timerScope = scope;
   scope.cubeTypes = [];
   scope.cubeTypeId = 1;
   scope.scrambleLength = 0;
   scope.scramble = "";
   scope.solveTime = 0;
   scope.stopwatch = {};

   var ignoreUp = false;
   var ignoreDown = true;
   document.addEventListener("keyup", function(event) {
      if (!ignoreUp && !scope.stopwatch.on && event.keyCode === 32) {
         scope.stopwatch.start();
      }
      ignoreUp = false;
   }, false);
   document.addEventListener("keydown", function(event) {
      if (!ignoreDown && scope.stopwatch.on && event.keyCode === 32) {
         ignoreUp = true;
         scope.solveTime = scope.stopwatch.stop();
         console.log("Time: " + scope.solveTime + "ms");
         scope.newScramble();
      }
      ignoreDown = false;
   }, false);


   scope.currentCube = function() {
      return scope.cubeTypes.find(function(cube) {
         return cube.id === scope.cubeTypeId;
      });
   };

   function initCubeTypes() {
      return http.get('/Cbs').then(function(response) {
         scope.cubeTypes = response.data;
      }).catch(function(err) {
         console.log("Error Getting Cube Types");
      });
   }

   scope.newScramble = function() {
      return http.get('/Cbs/' + scope.cubeTypeId + '/Scbl', {
         params: {
            length: scope.scrambleLength || scope.currentCube().scrambleLength,
         },
      }).then(function(response) {
         scope.scramble = response.data.split(" ").join("&nbsp; ");
      }).catch(function(err) {
         console.log(err);
      });
   };

   (function() {
      initCubeTypes().then(function() {
         scope.newScramble();
      })
   })();
}]);
