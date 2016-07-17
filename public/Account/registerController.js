app.controller('registerController', ['$scope', '$http', '$state', function(scope, http, state) {
   window.registerScope = scope;
   scope.email = '';
   scope.firstName = '';
   scope.lastName = '';
   scope.password = '';
   scope.role = 0;
   scope.termsAccepted = false;

   scope.register = function() {
      http.post("/Prss", {
         email: scope.email,
         firstName: scope.firstName,
         lastName: scope.lastName,
         password: scope.password,
         role: scope.role,
         termsAccepted: scope.termsAccepted,
      }).success(function(response) {
         state.go('login');
      }).catch(function(err) {
         console.log(err);
      });
   };
}]);
