app.directive('solveHistory', ['$http', 'dialog', function(http, dialog) {
   return {
      restrict: 'E',
      scope: {
         control: '=',
      },
      templateUrl: 'Timer/solveHistory.template.html',
      link: function(scope, element, attrs) {
         window.histScope = scope;
         scope.control = scope.control || {};
         scope.solveHistory = [];

         scope.control.getHistory = function(user, cubeTypeId) {
            var request = '/Prss/' + user.id + '/Slvs';
            var queryParams = {};
            if (cubeTypeId)
               queryParams.cubeTypeId = cubeTypeId;
            return http.get(request, {
               params: queryParams,
            }).then(function(response) {
               scope.solveHistory = response.data.sort(function(a, b) {
                  return a.whenSolved < b.whenSolved;
               });
            }).catch(function(err) {
               console.log(err);
            });
         };

         function statsRecord() {
            var result = null;
            scope.solveHistory.forEach(function(slv) {
               if (result === null || slv.time < result) {
                  result = slv.time;
               }
            });
            return result;
         }
         function statsAvg() {
            var result = 0;
            scope.solveHistory.forEach(function(slv) {
               result += slv.time;
            });
            result /= scope.solveHistory.length;
            return result;
         }
         function statsAvgX(x) {
            if (scope.solveHistory.length < x)
               return NaN;
            var result = 0;
            for (var i = 0; i < x; i++) {
               result += scope.solveHistory[i].time;
            }
            result /= x;
            return result;
         }

         scope.control.getStats = function() {
            return {
               pr: statsRecord(),
               avg: statsAvg(),
               avg_5: statsAvgX(5),
               avg_10: statsAvgX(10),
            };
         };

         scope.deleteSolve = function(slvId) {
            return http.delete('/Slvs/' + slvId).then(function(response) {
               for (var i = 0; i < scope.solveHistory.length; i++) {
                  if (scope.solveHistory[i].id === slvId) {
                     scope.solveHistory.splice(i, 1);
                     break;
                  }
               }
               if (scope.control.hasOwnProperty('refresh') && typeof(scope.control.refresh) === "function")
                  scope.control.refresh();
            }).catch(function(err) {
               console.log(err);
            });
         };

         scope.deleteAll = function() {
            var body = $('<p></p>').html("Are you sure you want to delete all solves? This action cannot be undone.");
            dialog.confirm(scope, body, "Warning").then(function() {
               scope.solveHistory.forEach(function(solve) {
                  http.delete('/Slvs/' + solve.id).then(function() {
                     if (scope.control.hasOwnProperty('refresh') && typeof(scope.control.refresh) === "function")
                        scope.control.refresh();
                  });
               });
               scope.solveHistory = [];
            });
         };
      },
   };
}]);
