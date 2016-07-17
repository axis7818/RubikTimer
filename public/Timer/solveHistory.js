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

         scope.control.getHistory = function(user) {
            var request = '/Prss/' + user.id + '/Slvs';
            return http.get(request).then(function(response) {
               scope.solveHistory = response.data;
            }).catch(function(err) {
               console.log(err);
            });
         };

         scope.deleteSolve = function(slvId) {
            return http.delete('/Slvs/' + slvId).then(function(response) {
               for (var i = 0; i < scope.solveHistory.length; i++) {
                  if (scope.solveHistory[i].id === slvId) {
                     scope.solveHistory.splice(i, 1);
                     break;
                  }
               }
            }).catch(function(err) {
               console.log(err);
            });
         };

         scope.deleteAll = function() {
            var body = $('<p></p>').html("Are you sure you want to delete all solves? This action cannot be undone.");
            dialog.confirm(scope, body, "Warning").then(function() {
               scope.solveHistory.forEach(function(solve) {
                  http.delete('/Slvs/' + solve.id);
               });
               scope.solveHistory = [];
            });
         };
      },
   };
}]);
