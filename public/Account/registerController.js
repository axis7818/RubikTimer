app.controller('registerController', ['$scope', function(scope) {
   window.registerScope = scope;
   scope.email = '';
   scope.firstName = '';
   scope.lastName = '';
   scope.password = '';
   scope.role = 0;
   scope.termsAccepted = false;

   scope.register = function() {
      console.log("registering...");
   };
}]);
