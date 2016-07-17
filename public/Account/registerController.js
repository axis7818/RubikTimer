app.controller('registerController', ['$scope', '$http', '$state', 'dialog', function(scope, http, state, dialog) {
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
         var body = dialog.makeErrorBody(err.data || err);
         var header = "Could Not Register";
         dialog.notify(scope, body, header, true).catch(function() {
            state.go('home');
         });
      });
   };
}]);
