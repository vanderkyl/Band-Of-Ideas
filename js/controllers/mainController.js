app.controller('mainController', ['$scope', '$http',
function($scope, $http) {
  $scope.user = {
    id: "",
    bands: [],
    name: "",
    email: "",
    password: "",
    passwordAgain: ""
  };
  $scope.loginMessage = "";
  $scope.sqlUser = "";
  $scope.sqlBand = {};
  $scope.currentBandCode = "";
  $scope.newBand = "";
  var existingBand = "";

  $scope.login = function() {
    $scope.validLogin(function(valid) {
      if (valid) {
        $scope.user = user;
        console.log(user.email);
        console.log(user);
        loginUser();
      }
    });
  };

  $scope.validLogin = function(callback) {
    var valid = true;
    var email = $scope.user.email;
    var password = $scope.user.password;
    $scope.validCreds(function(dbUser) {
      if (dbUser) {
        valid = checkEmail(email, dbUser.email) && checkPassword(password, dbUser.password);
      } else {
        valid = false;
      }
      if (valid) {
        user = dbUser;
      }
      callback(valid);
    });
  };

  $scope.validCreds = function(callback) {
    var email = $scope.user.email;
    var password = $scope.user.password;
    if (inputEmpty(email, "signInEmail") || inputEmpty(password, "signInPassword")) {
      callback(false);
    }
    $http.get("getUser.php?email=" + email)
    .then(function (response) {
      console.log(response.data);
      if (objectIsEmpty(response.data)) {
        console.log("Sorry, " + email + " doesn't exist.");
        showInvalidInput("signInEmail");
        callback(false);
      } else {
        callback(response.data);
      }

    });
  }

  // Checks if the band name given already exists
  $scope.checkBandAvailability = function() {
    var bandName = $scope.user.bands[0].name;
    $http.get("getBand.php?bandName=" + bandName)
    .then(function (response) {
      hideElementById("chooseBand");
      // If the response is an empty object, the band does not exist yet.
      if (objectIsEmpty(response.data)) {
        $scope.user.bands = [
          {id: "",
           name: bandName,
           memberIds: "",
           code: "1234"}
        ];
        displayElementById("chooseUser");
        // Else the band does exist already, so load the band data and prompt user for band code
      } else {
        $scope.user.bands[0] = response.data;
        $scope.sqlBand = response.data;
        displayElementById("joinBand");
      }
    });
  };

  // Make sure the given code matches the band code in the database
  $scope.checkBandCode = function() {
    if (!inputEmpty($scope.currentBandCode, "bandCode")) {
      if ($scope.user.bands[0].code === $scope.currentBandCode) {
        existingBand = $scope.user.bands[0].name;
        hideElementById("joinBand");
        displayElementById("chooseUser");
      } else {
        console.log("Please try again.");
        showInvalidInput("bandCode");
      }
    }
  }

  $scope.joinTheBand = function() {
    $scope.checkValidity(function(valid) {
      if (valid) {
        console.log("Adding new user.");
        user = $scope.user;
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

  // Check the validity of the sign up form input
  $scope.checkValidity = function(callback) {
    var valid = true;
    $scope.validEmail(function(validEmail) {
      valid = validEmail && valid;
      valid = passwordsMatch($scope.user.password, $scope.user.passwordAgain) && valid;
      valid = checkName($scope.user.name) && valid;
      console.log(valid);
      callback(valid);
    });
  };

  $scope.validEmail = function(callback) {
    var email = $scope.user.email;
    if(inputEmpty(email, "signUpEmail")) {
      return false;
    };
    $http.get("getUser.php?email=" + email)
    .then(function (response) {
      $scope.loginMessage = response.data;
      if (objectIsEmpty(response.data)) {
        callback(true);
      } else {
        console.log("Sorry, " + email + " already exists.");
        showInvalidInput("signUpEmail");
        callback(false);
      }
    });
  };

  $scope.saveUser = function(callback) {
    var newUser = $scope.user;
    newUser.existingBand = existingBand;
    $http.post("addUser.php", newUser)
    .then(
      function (response) {
        console.log(response.data);

        callback(true);
      },
      function (response) {
        console.log(response);
        console.log(response.data);
        callback(false);
      }
    );
  }

  $scope.enterBand = function(index) {
    currentBand = $scope.user.bands[index];
    navigateToURL("/#/music");
  };

  // Open the Sign Up form
  $scope.openBandForm = function() {
    displayElementById("signUpForm");
    displayElementById("startBandForm");
    hideElementById("startBand");
    hideElementById("signInForm");
    displayElementById("startSignIn");
  };

  // Open the Sign Up form
  $scope.openSignInForm = function() {
    displayElementById("signInForm");
    displayElementById("startBand");
    hideElementById("signUpForm");
    hideElementById("startSignIn");
  };

  // Show add band input
  $scope.showAddBandInput = function() {
    hideElementById("addBand");
    displayElementById("addBandInput");
  };

  $scope.backToChooseBand = function() {
    $scope.user.bands[0].name = "";
    hideElementById("joinBand");
    displayElementById("chooseBand");
  }

  // Show add band input
  $scope.addBand = function() {
    var bandName = $scope.newBand;
    $scope.user.bands.push({name: bandName,
                            memberIds: [$scope.user.id],
                            code: "1234"});
    hideElementById("addBandInput");
    displayElementById("addBand");
  };

  // Check if user is logged in. Show user information instead of authentication forms.
  if (isLoggedIn()) {
    $scope.user = user;
    hideAuthenticationUI();
  } else {
    hideElementById("startBandForm");
  }
}]);
// End of mainController scope

function inputEmpty(input, inputId) {
  if (input === "") {
    console.log("Please try again.");
    showInvalidInput(inputId);
    return true;
  } else {
    return false;
  }
}

function clearStorage() {
  localStorage.clear();
  console.log("Storage cleared.");
}
