app.controller('mainController', ['$scope',
function($scope) {
  $scope.title = 'Band of Ideas';
  $scope.message = '';
  $scope.navigateToSongIdeas = function() {
    navigateToURL("/#/music");
  };
  $scope.navigateToComments = function() {
    navigateToURL("/#/comment");
  };
}]);
