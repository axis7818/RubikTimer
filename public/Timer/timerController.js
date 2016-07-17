app.controller('timerController', ['$scope', '$http', 'dialog', 'user', '$timeout', function(scope, http, dialog, user, timeout) {
   window.timerScope = scope;
   scope.cubeTypes = [];
   scope.cubeTypeId = 1;
   scope.scrambleLength = 0;
   scope.scramble = "";
   scope.solveTime = 0;
   scope.stopwatch = {};
   scope.user = user;
   scope.historyPanel = {};

   scope.refreshHistory = function() {
      return scope.historyPanel.getHistory(scope.user, scope.cubeTypeId);
   }
   timeout(function() {
      scope.refreshHistory();
   }, 100);

   function saveSolve() {
      var slv = {
         scramble: scope.scramble.split("&nbsp;").join(''),
         time: scope.solveTime,
         cubeTypeId: scope.cubeTypeId,
      };
      http.post('/Slvs', slv).then(function(response) {
         scope.refreshHistory();
      }).catch(function(err) {
         console.log(err);
      })
   }

   // stopwatch control
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
         saveSolve();
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
