app.controller('loginController', ['$scope', '$http', '$state', 'dialog', function(scope, http, state, dialog) {
   window.loginScope = scope;
   scope.email = '';
   scope.password = '';

   scope.login = function() {
      http.post('/Ssns', {
         email: scope.email,
         password: scope.password,
      }).then(function(response) {
         return http.get('/Prss', {
            params: {
               email: scope.email,
            },
         });
      }).then(function(response) {
         state.go('timer', {
            prsId: response.data[0].id,
         });
      }).catch(function(err) {
         var msg = dialog.makeErrorBody(err.data || err);
         dialog.notify(scope, msg, "Could Not Login");
      });
   };
}]);
