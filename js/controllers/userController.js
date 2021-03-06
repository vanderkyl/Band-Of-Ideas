app.controller('userController', ['$scope', '$http',
function($scope, $http) {
  $scope.user = {};

  $scope.changeProfileImage = function(icon) {
    $scope.updateUserImage(icon, "color");

  };

  $scope.updateUserImage = function(icon, color) {
    var postData = {
      icon: icon,
      color: color
    }
    $http.post("/php/updateUser.php?userId=" + $scope.user.id + "&type=userImage", postData)
    .then(function (response) {
      console.log(response);
      getElementById("profileImage").style.backgroundImage = "url(" + icon + ")";
      changeUserIcon(icon);
    },
    function (response) {
      console.log(response);
    });
  };



  $scope.loadUIObjects = function() {
    displayElementById("userView");
    finishControllerSetup();
  };

  $scope.loadController = function() {
      setupController();

      // Check if user is logged in. Show user information instead of authentication forms.
      if (isLoggedIn()) {
        $scope.user = CURRENT_USER;
        var icon = CURRENT_USER.userIcon || "../img/default-profile.png";
        getElementById("profileImage").style.backgroundImage = "url(" + icon + ")";
        $scope.loadUIObjects();
      }

  };

  // Main load method
  $scope.loadController();


}]);
// End of userController scope
