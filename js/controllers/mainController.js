app.controller('mainController', ['$scope',
function($scope) {
  $scope.navigateToSongIdeas = function() {
    navigateToURL("/#/music");
  };
  $scope.navigateToComments = function() {
    navigateToURL("/#/comment");
  };
}]);
function signIn() {
  hideElementById("signIn");
  displayElementById("signOut");
};
function signOut() {
  hideElementById("signOut");
  displayElementById("signIn");
};
