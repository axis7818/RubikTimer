app.directive('stopwatch', [function() {
   return {
      restrict: 'E',
      scope: {
         bindTo: '=',
         control: '=',
      },
      template: "{{ bindTo | date:'mm:ss.sss' }}",
      link: function(scope, element, attrs) {
         var intervalId = null;
         var startTime = 0;
         var endTime = 0;

         scope.control = scope.control || {};
         scope.control.on = false;
         scope.control.start = function() {
            if (!scope.control.on) {
               startTime = new Date();
               scope.control.on = true;
               intervalId = setInterval(function() {
                  scope.bindTo = new Date() - startTime;
                  scope.$apply();
               }, 1);
            }
         };
         scope.control.stop = function() {
            if (scope.control.on) {
               endTime = new Date();
               scope.control.on = false;
               scope.bindTo = endTime - startTime;
               clearInterval(intervalId);
            }
            return scope.bindTo;
         };
      },
   };
}]);
