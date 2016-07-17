app.service("dialog", ["$uibModal", function(modal) {
   return {
      notify: function(scope, body, header, showCancel) {
         scope.bodyContent = body;
         scope.header = header;
         scope.showCancel = showCancel;
         return modal.open({
            templateUrl: 'Utils/dialog.template.html',
            scope: scope,
            size: 'sm',
         }).result;
      },

      confirm: function(scope, body, header) {
         scope.bodyContent = body;
         scope.header = header;
         scope.showCancel = true;
         return modal.open({
            templateUrl: 'Utils/dialog.template.html',
            scope: scope,
            size: 'sm',
         }).result;
      },

      makeErrorBody: function(err) {
         var elem;
         if (Array.isArray(err)) {
            var elem = $("<ul></ul>");
            err.forEach(function(e) {
               elem.append($("<li></li>").html(e.tag));
            });
         }
         else if (typeof(err) === "string")
            elem = $("<p></p>").html(err);
         else
            elem = $("<p></p>").html(JSON.stringify(err));
         return elem;
      },
   }
}]);

app.directive("dialogBody", [function() {
   return {
      restrict: "E",
      scope: {
         bodyContent: '=',
      },
      template: "<div ng-show='bodyContent'></div>",
      link: function(scope, element, attrs) {
         element.append(scope.bodyContent);
      },
   };
}]);
