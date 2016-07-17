app.controller('timerController', ['$scope', '$http', 'dialog', function(scope, http, dialog) {
   window.timerScope = scope;
   scope.cubeTypes = [];
   scope.cubeTypeId = 1;
   scope.scrambleLength = 0;
   scope.scramble = "";

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
