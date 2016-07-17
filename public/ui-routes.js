app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $router) {
   //redirect to home if path is not matched
   $router.otherwise("/");

   $stateProvider.state('home',  {
      url: '/',
      templateUrl: 'home.template.html',
      controller: 'homeController',
   }).state('login', {
      url: '/login',
      templateUrl: 'Account/login.template.html',
      controller: 'loginController',
   }).state('register', {
      url: '/register',
      templateUrl: 'Account/register.template.html',
      controller: 'registerController',
   });
}]);
