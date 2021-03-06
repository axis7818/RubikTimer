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
   }).state('timer', {
      url: '/timer/{prsId}',
      templateUrl: 'Timer/timer.template.html',
      controller: 'timerController',
      resolve: {
         user: ['$q', '$http', '$stateParams', function($q, http, stateParams) {
            return http.get('/Prss/' + stateParams.prsId).then(function(response) {
               return $q.resolve(response.data);
            });
         }],
      }
   });
}]);
