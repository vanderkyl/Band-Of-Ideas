app.controller('userController', ['$scope', '$http',
function($scope, $http) {
  $scope.user = {};
  $scope.editUserMessage = "";
  $scope.confirmPassword = "";
  $scope.userImage = "";
  $scope.userColor = "";
  $scope.currentSelectedImage = "";


  $scope.updateUser = function(userId, type, data, callback) {
    $http.post("/php/updateUser.php?userId=" + userId + "&type=" + type, data)
    .then(function (response) {
      console.log("Updated user successfully.");
      callback(true);
    },
    function (response) {
      console.log("The update failed: " + response.data);
      callback(false);
    });
  };

  $scope.updateUserInfo = function() {
    if ($scope.user.password === $scope.confirmPassword) {
      $scope.updateUser(CURRENT_USER.id, "userInfo", $scope.user, function(success) {
        if (success) {
          closeEditUser();
          $scope.editUserMessage = "Updated successfully";
        } else {
          $scope.editUserMessage = "Update unsuccessful";
        }
      });
    } else {
      $scope.editUserMessage = "Passwords don't match";
    }

  };

  $scope.updateUserImage = function(icon, color) {
    $scope.userImage = icon;
    $scope.userColor = color;
    showElementById("saveProfileImageButton");
  };

  $scope.changeProfileImage = function(id, icon) {
    $scope.updateUserImage(icon, "color");
    if ($scope.currentSelectedImage != "") {
      getElementById($scope.currentSelectedImage).style.border = "1px solid black";
    }
    $scope.currentSelectedImage = id;
    getElementById(id).style.border = "3px solid green";
  };

  $scope.saveProfileImage = function() {
    var postData = {
      icon: $scope.userImage,
      color: $scope.userColor
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

  $scope.goToBand = function(band) {
    navigateToURL("/#/band?id=" + band.id);
  };

  $scope.closeEditUser = function() {
    closeEditUser();
    $scope.editUserMessage = "";
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
        $scope.userImage = icon;
        getElementById("profileImage").style.backgroundImage = "url(" + icon + ")";
        $scope.loadUIObjects();
      }

  };

  // Main load method
  $scope.loadController();


}]);
// End of userController scope
