app.controller('loginController', ['$scope', '$http', function(scope, http) {
   window.loginScope = scope;
   scope.email = '';
   scope.password = '';

   scope.login = function() {
      http.post('/Ssns', {
         email: scope.email,
         password: scope.password,
      }).success(function(response) {
         console.log("Login success!");
      })
   };
}]);
