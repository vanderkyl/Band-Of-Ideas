var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.factory('folders', function () {
    return folders;
});

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'mainController',
    templateUrl: 'views/user.html'
  })
  .when('/home', {
    controller: 'mainController',
    templateUrl: 'views/home.html'
  })
  .when('/user', {
    controller: 'mainController',
    templateUrl: 'views/user.html'
  })
  .when('/band/:name?', {
    controller: 'musicController',
    templateUrl: 'views/music.html'
  })
  .when('/band/:name?/:folder?/:file?', {
    controller: 'fileController',
    templateUrl: 'views/file.html'
  })
  .when('/uploads/band/:name?/:folder?/:file?', {
    controller: 'driveController',
    templateUrl: 'uploads/index.php'
  })
  .when('/file', {
    controller: 'fileController',
    templateUrl: 'views/file.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});
