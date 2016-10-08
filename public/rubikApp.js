var app = angular.module('mainApp', [
   'ui.router',
   'ui.bootstrap',
   'ngCookies',
   'ngSanitize',
]);

app.filter("cubeType", function() {
   var types = [null, '3x3', '4x4', '5x5'];
   return function(input) {
      return types[input];
   };
});

app.directive("securityWarning", function() {
   return {
      restrict: 'E',
      templateUrl: "securityWarning.template.html",
   };
});
