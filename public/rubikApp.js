var app = angular.module('mainApp', [
   'ui.router',
   'ui.bootstrap',
   'ngCookies',
]);

app.filter("cubeType", function() {
   var types = ['3x3', '4x4', '5x5'];
   return function(input) {
      return types[input];
   };
});
