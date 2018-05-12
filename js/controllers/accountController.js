app.controller('accountController', ['$scope', '$http',
function($scope, $http) {
  $scope.loginMessage = "Login";
  $scope.addBandMessage = "New Band";
  $scope.joinBandMessage = "Join Band"
  $scope.newBandName = "";
  $scope.joinBandName = "";
  $scope.bandCode = "";
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

  // Test login - Data from account.js
  $scope.testLogin = function() {
    console.log(testUser);
    CURRENT_USER = testUser;
    CURRENT_BANDS = testUser.bands;
    loginUser();
  };

  // This function runs when submitting sign in form.
  $scope.login = function() {
    $scope.validLogin(function(valid) {
      if (valid) {
        $scope.user = CURRENT_USER;
        $scope.loginUser();
      } else {
        $scope.loginMessage = "Login";
        getElementById("signInSubmitButton").disabled = false;
      }
    });
  };

  // Before logging in user, get the user from the database
  $scope.loginUser = function() {
    $http.get("/php/getUser.php?email=" + CURRENT_USER.email + "&login=true")
    .then(function (response) {
      var user = response.data;
      if (typeof user == "object") {
        CURRENT_USER = response.data;
        CURRENT_BANDS = response.data.bands;
        loginUser();
      } else {
        console.log("Login Failed.");
      }
    });
  };

  // Validate login credentials. Started by $scope.login() function.
  $scope.validLogin = function(callback) {
    var valid = true;
    var email = $scope.user.email;
    var password = $scope.user.password;
    // Validate that the credentials match the database
    $scope.validCreds(function(dbUser) {
      if (dbUser) {
        valid = checkEmail(email, dbUser.email) && checkPassword(password, dbUser.password);
        if (valid) {
          CURRENT_USER = dbUser;
        }
      } else {
        valid = false;
      }
      callback(valid);
    });
  };

  // Validate credentials in database
  $scope.validCreds = function(callback) {
    var email = $scope.user.email;
    var password = $scope.user.password;
    if (inputEmpty(email, "signInEmail") || inputEmpty(password, "signInPassword")) {
      callback(false);
    }
    $scope.loginMessage = "Looking up account...";
    getElementById("signInSubmitButton").disabled = true;
    $http.get("/php/getUser.php?email=" + email + "&login=false")
    .then(function (response) {
      if (objectIsEmpty(response.data)) {
        console.log("Sorry, " + email + " doesn't exist.");
        showInvalidInput("signInEmail");
        $scope.loginMessage = "Log In";
        callback(false);
      } else {
        $scope.loginMessage = "Logging In...";
        callback(response.data);
      }
    });
  }

  // Start of Sign Up functionality //

  // Checks if the band name given already exists
  $scope.checkBandAvailability = function() {
    var bandName = $scope.user.bands[0].name;
    $scope.getBand(bandName, function(band) {
      hideElementById("chooseBand");
      // If the response is an empty object, the band does not exist yet.
      if (objectIsEmpty(band)) {
        $scope.user.bands = [
          {id: "",
           name: bandName,
           metaName: generateMetaName(bandName),
           memberIds: "",
           code: generateBandCode()}
        ];
        displayElementById("chooseUser");
        // Else the band does exist already, so load the band data and prompt user for band code
      } else {
        $scope.user.bands = [band];
        console.log($scope.user.bands[0].code);
        displayElementById("joinBand");
      }
    });
  };



  // Make sure the given code matches the band code in the database
  $scope.checkBandCode = function() {
    if (!inputEmpty($scope.bandCode, "bandCodeInput")) {
      if ($scope.user.bands[0].code === $scope.bandCode) {
        existingBand = $scope.user.bands[0].name;
        hideElementById("joinBand");
        displayElementById("chooseUser");
      } else {
        console.log("Please try again.");
        showInvalidInput("bandCodeInput");
      }
    }
  }

  $scope.joinBand = function() {
    var bandName = $scope.joinBandName;
    $scope.getBand(bandName, function(band) {
      // If the response is an empty object, the band does not exist yet.
      if (objectIsEmpty(band)) {
        console.log("Band does not exist.");
        $scope.joinBandName = "";
        // Else the band does exist already, so load the band data and prompt user for band code
      } else {
        if (band.code === $scope.bandCode) {
          console.log($scope.user.id);
          $scope.updateUserAndBand($scope.user.id, band, function(success) {
            if (success) {
              $scope.user.bands.push(band);
              CURRENT_BANDS = $scope.user.bands;
            }
          });
        } else {
          console.log("Incorrect Band Code.");
          $scope.bandCode = "";
        }
      }
    });
  };

  $scope.updateUserAndBand = function(userId, band, callback) {
    $http.post("/php/updateUser.php?userId=" + userId + "&type=bandUpdate", band)
    .then(function (response) {
      console.log(response.data);
      callback(true);
    },
    function (response) {
      console.log(response);
      console.log(response.data);
      callback(false);
    });
  };

  $scope.updateToken = function(userId, callback) {
    $scope.updateUser(userId, "tokenUpdate", "token", function (success) {
      callback(success);
    })
  };


  // -- JOIN BAND FORM -- // ---------------------------------------------------

  // Check validity of join the band form input. Add user and band if successful.
  $scope.joinTheBand = function() {
    $scope.checkValidity(function(valid) {
      if (valid) {
        $scope.user.metaName = generateMetaName($scope.user.name);
        CURRENT_USER = $scope.user;
        console.log("Adding new user.");
        $scope.saveUser(function(saved) {
          if (saved) {
            $scope.loginUser();
          } else {
            console.log("Something went wrong...");
          }
        });
      } else {
        console.log("Band is invalid. Please try again.");
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

  // TODO change email to username
  // Validate the given username in the database
  $scope.validEmail = function(callback) {
    var username = $scope.user.email;
    if(inputEmpty(username, "signUpEmail")) {
      callback(false);
    };
    $scope.getUser(username, false, function (user) {
      $scope.loginMessage = user;
      if (objectIsEmpty(user)) {
        callback(true);
      } else {
        console.log("Sorry, " + username + " already exists.");
        showInvalidInput("signUpEmail");
        callback(false);
      }
    });
  };



  // -- ACCOUNT UI MANAGEMENT -- // --------------------------------------------

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

  // Go back to the band name input form
  $scope.backToChooseBand = function() {
    $scope.user.bands[0].name = "";
    hideElementById("joinBand");
    displayElementById("chooseBand");
  }
  // -- END OF ACCOUNT UI MANAGEMENT -- // -------------------------------------



  // -- START OF PHP CALLS -- // -----------------------------------------------

  // HTTP POST Request - Update user information
  // userId [String] - the identifier to find the user in the database
  // type [String] - the type of update that will occur [token, band]
  // data [object] - the data that will be used in the update
  // callback [function] - return the response data
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
  }

  // HTTP POST Request - Add the user to the database
  // callback [function] - return if the post succeeded
  $scope.saveUser = function(callback) {
    var newUser = $scope.user;
    newUser.existingBand = existingBand;
    $http.post("/php/addUser.php", newUser)
    .then(
      function (response) {
        console.log("The user was added successfully!");
        callback(true);
      },
      function (response) {
        console.log("The add failed: " + response.data);
        callback(false);
      }
    );
  }

  // HTTP GET Request - Get User data
  // userName [String] - use username to find user TODO change this in php file
  // login [boolean] - true if getting a logged in user, false if just looking up user
  // callback [function] - return the response data
  $scope.getUser = function(userName, login, callback) {
    $http.get("/php/getUser.php?email=" + userName + "&login=" + login)
    .then(function (response) {
      console.log("Retrieved User: " + response.data);
      callback(response.data);
    });
  }

  // Send GET request to retrieve band information.
  $scope.getBand = function(bandName, callback) {
    $http.get("/php/getBand.php?bandName=" + bandName)
    .then(function (response) {
      console.log(response.data);
      callback(response.data);
    });
  };
  // -- END OF PHP CALLS -- // -------------------------------------------------

  // Check if user is still logged in. Based on token in database.
  $scope.checkDatabaseIfLoggedIn = function(callback) {
    var unknownUser = "";
    return $scope.getUser(unknownUser, false, function(rememberedUser) {
      if (typeof rememberedUser == "string" || !rememberedUser) {
        callback(rememberedUser, false);
      } else {
        callback(rememberedUser, true);
      }
    });
  };

  // Check if user is logged in. Show user information instead of authentication forms.
  if (isLoggedIn()) {
    console.log(loggedIn);
    $scope.user = CURRENT_USER;
    $scope.user.bands = CURRENT_BANDS;
    //hideAuthenticationUI();
    navigateToURL("/#/user");
  } else {
    console.log(signedOut);
    if (signedOut) {
      // change token
      $scope.updateToken(CURRENT_USER.id, function(success) {
        if (success) {
          console.log("Updated token successfully.");

        } else {
          console.log("Update unsuccessful.");
        }
        hideElementById("startBandForm");
        displayElementById("authentication");
      });

    } else {
      $scope.checkDatabaseIfLoggedIn(function(loggedInUser, success) {
        console.log
        if (success) {
          console.log("logged in: " + loggedInUser);
          loggedIn = true;
          CURRENT_USER = loggedInUser;
          CURRENT_BANDS = loggedInUser.bands;
          $scope.user = CURRENT_USER;
          $scope.user.bands = CURRENT_BANDS;
          console.log(lastUrl);
          loginUser();
        } else {
          clearAccountData();
          console.log("Showing login form");
          displayElementById("authentication");
          hideElementById("startBandForm");
        }
      });
    }
  }
  removeNavLink("#bandLink");
  removeNavLink("#folderLink");
}]);
// End of mainController scope
