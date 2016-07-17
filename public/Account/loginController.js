app.controller('loginController', ['$scope', '$http', '$state', function(scope, http, state) {
   window.loginScope = scope;
   scope.email = '';
   scope.password = '';

   scope.login = function() {
      http.post('/Ssns', {
         email: scope.email,
         password: scope.password,
      }).success(function(response) {
         state.go('timer');
      })
   };
}]);
