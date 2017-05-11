app.controller('mainController', ['$scope', '$http',
function($scope, $http) {
  $scope.user = {
    id: "",
    bands: [],
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: ""
  };
  $scope.loginMessage = "";
  $scope.sqlUser = "";

  $scope.login = function() {
    if ($scope.validLogin()) {
      var user = JSON.parse(getItemFromLocalStorage($scope.user.email));
      console.log(user.email);
      console.log(user);
      loginUser();
      $scope.user = user;
    }
  };

  $scope.joinTheBand = function() {
    $scope.checkValidity(function(valid) {
      if (valid) {
        console.log("Adding new user.");
        var newUser = $scope.user;
        $scope.saveUser(function(saved) {
          if (saved) {
            loginUser();
            console.log("Success!");
          } else {
            console.log("The user was not added to the database");
          }
        });
      } else {
        console.log("Please try again.");
      }
    });
  };

  $scope.saveUser = function(callback) {
    var newUser = $scope.user;
    console.log("saving user");
    $http.post("addUser.php", newUser)
    .then(
      function (response) {
        console.log(response.data);
        console.log(response.error);
        callback(true);
      },
      function (response) {
        console.log(response);
        console.log(response.data);
        console.log(response.error);
        callback(false);
      }
    );
  }

  // Open the Sign Up form
  $scope.openBandForm = function() {
    displayElementById("startBandForm");
    hideElementById("signInForm");
  };

  $scope.enterBand = function(index) {
    currentBand = $scope.user.bands[index];
    navigateToURL("/#/music");
  }

  $scope.validLogin = function() {
    var valid = true;
    valid = checkEmail($scope.user.email) && valid;
    valid = checkPassword($scope.user.email, $scope.user.password) && valid;
    if (valid) {
      user = JSON.parse(getItemFromLocalStorage($scope.user.email));
    }
    return valid;
  };

  $scope.getSQLUser = function(email) {
    $http.get("users.php?email=" + email)
    .then(function (response) {
      $scope.loginMessage = response.data;
      console.log(response.data);
    });
  };

  // Check the validity of the sign up form input
  $scope.checkValidity = function(callback) {
    var valid = true;
    $scope.validEmail(function(validEmail) {
      valid = validEmail && valid;
      valid = passwordsMatch($scope.user.password, $scope.user.passwordAgain) && valid;
      valid = checkName($scope.user.firstName, $scope.user.lastName) && valid;
      console.log(valid);
      callback(valid);
    });
  };

  $scope.validEmail = function(callback) {
    var email = $scope.user.email;
    if (email == "") {
      console.log("Please give your email.");
      showInvalidInput("signUpEmail");
      return false;
    }
    $http.get("users.php?email=" + email)
    .then(function (response) {
      $scope.loginMessage = response.data;
      console.log(response.data);
      if (objectIsEmpty(response.data)) {
        callback(true);
      } else {
        console.log("Sorry, " + email + " already exists.");
        showInvalidInput("signUpEmail");
        callback(false);
      }
    });
  };

  // Check if user is logged in. Show user information instead of authentication forms.
  console.log(isLoggedIn());
  if (isLoggedIn()) {
    loadUserInfo();
    $scope.user = user;
  } else {
    hideElementById("startBandForm");
  }
}]);
// End of mainController scope

function login(form) {
  if (validLogin(form)) {
    var user = JSON.parse(getItemFromLocalStorage(form.email.value));
    console.log(form.email.value);
    console.log(user);
    loginUser();
    navigateToURL("/#/user");
    navigateToURL("/#/");
  }
};

function validLogin(form) {
  var valid = true;
  valid = checkEmail(form.email.value) && valid;
  valid = checkPassword(form.email.value, form.password.value) && valid;
  if (valid) {
    user = JSON.parse(getItemFromLocalStorage(form.email.value));
  }
  return valid;
}

function clearStorage() {
  localStorage.clear();
  console.log("Storage cleared.");
}
