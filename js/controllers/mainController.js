app.controller('mainController', ['$scope',
function($scope) {
  $scope.user = {
    id: "",
    bands: [],
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: ""
  };

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
    if ($scope.checkValidity()) {
      console.log("Adding new user.");
      var newUser = $scope.user;
      saveUser(newUser);
      loginUser();
      console.log("Success!");
    } else {
      console.log("Please try again.");
    }
  };

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
  }

  // Check the validity of the sign up form input
  $scope.checkValidity = function() {
    var valid = true;
    valid = bandIsValid($scope.bandName) && valid;
    valid = validSignUpEmail($scope.email) && valid;
    valid = passwordsMatch($scope.password, $scope.passwordAgain) && valid;
    valid = checkName($scope.firstName, $scope.lastName) && valid;
    console.log(valid);
    return valid;
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
