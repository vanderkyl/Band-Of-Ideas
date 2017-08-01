app.controller('mainController', ['$scope', '$http',
function($scope, $http) {
  $scope.loginMessage = "Login";
  $scope.addBandMessage = "";
  $scope.sqlUser = "";
  $scope.sqlBand = {};
  $scope.currentBandCode = "";
  $scope.newBand = "";
  $scope.user = {
    id: "",
    bands: [],
    name: "",
    metaName: "",
    email: "",
    password: "",
    passwordAgain: ""
  };
  var existingBand = "";

  // Test login
  $scope.testLogin = function() {
    CURRENT_USER = testUser;
    $scope.user = CURRENT_USER;
    loginUser();
  };

  $scope.loginUser = function() {
    $http.get("/php/getUser.php?email=" + CURRENT_USER.email)
    .then(function (response) {
      console.log(response.data);
      CURRENT_USER = response.data;
    });
    loginUser();
  };

  $scope.login = function() {
    $scope.validLogin(function(valid) {
      if (valid) {
        $scope.user = CURRENT_USER;
        console.log(CURRENT_USER.email);
        console.log(CURRENT_USER);
        $scope.loginUser();
      } else {
        $scope.loginMessage = "Login";
        getElementById("signInSubmitButton").disabled = false;
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
        CURRENT_USER = dbUser;
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
    $scope.loginMessage = "Logging In...";
    getElementById("signInSubmitButton").disabled = true;
    $http.get("/php/getUser.php?email=" + email)
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
    $http.get("/php/getBand.php?bandName=" + bandName)
    .then(function (response) {
      hideElementById("chooseBand");
      // If the response is an empty object, the band does not exist yet.
      if (objectIsEmpty(response.data)) {
        $scope.user.bands = [
          {id: "",
           name: bandName,
           metaName: generateMetaName(bandName),
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
        $scope.user.metaName = generateMetaName($scope.user.name);
        CURRENT_USER = $scope.user;
        $scope.saveUser(function(saved) {
          if (saved) {
            $scope.loginUser();
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
    $http.get("/php/getUser.php?email=" + email)
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
    $http.post("/php/addUser.php", newUser)
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
    CURRENT_BAND = $scope.user.bands[index];
    navigateToURL("/#/band/" + CURRENT_BAND.metaName);
  };

  // Open the Sign Up form
  $scope.openBandForm = function() {
    openJoinBandForm();
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
    displayElementById("cancelNewBand");
    displayElementById("addBandInput");
  };

  // Hide add band input
  $scope.hideAddBandInput = function() {
    hideElementById("addBandInput");
    hideElementById("cancelNewBand");
    displayElementById("addBand");
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
                            metaName: generateMetaName(bandName),
                            memberIds: [$scope.user.id],
                            code: "1234"});
    //TODO check availability of band
    $scope.hideAddBandInput;

  };

  // Open User Details
  $scope.showUserDetails = function() {
    var detailsDisplay = getElementById("userDetails").style.display;
    var detailsButton = getElementById("userDetailsButton");
    if (detailsDisplay == "none" || detailsDisplay === "") {
      displayElementById("userDetails");
      detailsButton.innerHTML = "^";
    } else {
      hideElementById("userDetails");
      detailsButton.innerHTML = "v";
    }
  };

  // Check if user is logged in. Show user information instead of authentication forms.
  if (isLoggedIn()) {
    $scope.user = CURRENT_USER;
    hideAuthenticationUI();
  } else {
    CURRENT_FILE = "";
    CURRENT_FILES = "";
    CURRENT_FOLDER = "";
    CURRENT_FOLDERS = "";
    hideElementById("startBandForm");
  }
  removeNavLink("#bandLink");
  removeNavLink("#folderLink");
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
