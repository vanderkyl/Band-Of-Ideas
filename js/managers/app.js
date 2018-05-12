var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.factory('folders', function () {
    return folders;
});

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'accountController',
    templateUrl: 'views/login.html'
  })
  .when('/login', {
    controller: 'accountController',
    templateUrl: 'views/login.html'
  })
  .when('/user', {
    controller: 'mainController',
    templateUrl: 'views/user.html'
  })
  .when('/band/:name?', {
    controller: 'folderController',
    templateUrl: 'views/folders.html'
  })
  .when('/band/:name?/:folder?', {
    controller: 'fileController',
    templateUrl: 'views/files.html'
  })
  .when('/band/:name?/:folder?/:file?', {
    controller: 'ideaController',
    templateUrl: 'views/idea.html'
  })
  .when('/files', {
    controller: 'fileController',
    templateUrl: 'views/files.html'
  })
  .when('/logout', {
    controller: 'accountController',
    templateUrl: 'views/login.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});
