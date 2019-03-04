
var app = angular.module('myApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);

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
  .when('/dashboard', {
    controller: 'mainController',
    templateUrl: 'views/main.html'
  })
  .when('/user', {
    controller: 'userController',
    templateUrl: 'views/user.html'
  })
  .when('/band', {
    controller: 'bandController',
    templateUrl: 'views/band.html'
  })
  .when('/folder', {
    controller: 'folderController',
    templateUrl: 'views/folder.html'
  })
  .when('/idea', {
      controller: 'ideaController',
      templateUrl: 'views/idea.html'
  })
  .when('/idea/:name?', {
      controller: 'ideaController',
      templateUrl: 'views/idea.html'
  })
  .when('/files', {
    controller: 'playlistController',
    templateUrl: 'views/playlist.html'
  })
  .when('/playlist', {
    controller: 'playlistController',
    templateUrl: 'views/playlist.html'
  })
  .when('/playlists', {
    controller: 'playlistController',
    templateUrl: 'views/playlist.html'
  })
  .when('/logout', {
    controller: 'accountController',
    templateUrl: 'views/login.html'
  })
  .when('/settings', {
      controller: 'settingsController',
      templateUrl: 'views/settings.html'
  })
  .when("/forgot-password", {
    controller: 'credentialsController',
    templateUrl: 'views/forgot-password.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
