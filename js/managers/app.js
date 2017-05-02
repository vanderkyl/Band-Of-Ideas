var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.factory('folders', function () {
    return folders;
});

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'mainController',
    templateUrl: 'views/home.html'
  })
  .when('/home', {
    controller: 'mainController',
    templateUrl: 'views/home.html'
  })
  .when('/music', {
    controller: 'musicController',
    templateUrl: 'views/music.html'
  })
  .when('/upload', {
    controller: 'uploadController',
    templateUrl: 'views/upload.html'
  })
  .when('/comment', {
      controller: 'commentController',
      templateUrl: 'views/comment.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});
