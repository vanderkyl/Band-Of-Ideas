app.controller('credentialsController', ['$scope', '$http',
function($scope, $http) {
  $scope.user = {
    username: ""
  };

  // HTTP GET Request - Get User data
  // userName [String] - use username to find user TODO change this in php file
  // login [boolean] - true if getting a logged in user, false if just looking up user
  // callback [function] - return the response data
  $scope.getUser = function(userName, login, callback) {
    $http.get("/php/getUser.php?username=" + userName + "&login=" + login)
        .then(function (response) {
          CURRENT_USER = response.data;
          $scope.user = response.data;
          callback();
        });
  }

  $scope.findPassword = function() {
    $scope.getUser($scope.user.username, false, function() {
        getElementById("password").innerText = $scope.user.password;
        displayElementById("passwordContainer");
    });
  };

  $scope.loadController = function() {
      setupController();
      displayElementById("authentication");
      finishControllerSetup();
  };

  // Main load method
  $scope.loadController();


}]);
// End of credentialsController scope
