app.controller('accountController', ['$scope', '$http',
function($scope, $http) {
  $scope.loginMessage = "Log In";
  $scope.newBandName = "";
  $scope.joinBandName = "";
  $scope.bandCode = "";
  $scope.user = {
    id: "",
    bands: [],
    name: "",
    metaName: "",
    username: "",
    email: "",
    password: "",
    passwordAgain: ""
  };
  var existingBand = "";

  // -- SIGN IN / LOGIN METHODS -- // -------------------------------------------------

  // Test login - Data from account.js
  $scope.testLogin = function() {
    testLogin = true;
    CURRENT_USER = testUser;
    CURRENT_BANDS = testUser.bands;
    loginUser();
  };

  // This function runs when submitting sign in form.
  $scope.login = function() {
    if ($scope.user.username == testUserName) {
      $scope.testLogin();
    } else {
        // Check validity of login creds
        $scope.validLogin(function(valid) {
            if (valid) {
                $scope.user = CURRENT_USER;
                $scope.loginUser();
            } else {
                $scope.loginMessage = "Log In";
                getElementById("signInSubmitButton").disabled = false;
            }
        });
    }

  };

  // Before logging in user, get the user from the database
  $scope.loginUser = function() {
    $http.get("/php/getUser.php?username=" + CURRENT_USER.username + "&login=true")
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
    var username = $scope.user.username;
    var password = $scope.user.password;
    // Validate that the credentials match the database
    $scope.validCreds(function(dbUser) {
      if (dbUser) {
        valid = checkUsername(username, dbUser.username) && checkPassword(password, dbUser.password);
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
    var username = $scope.user.username;
    var password = $scope.user.password;
    if (inputEmpty(username, "signInUsername") || inputEmpty(password, "signInPassword")) {
      callback(false);
    }
    $scope.loginMessage = "Looking up account...";
    getElementById("signInSubmitButton").disabled = true;
    $http.get("/php/getUser.php?username=" + username + "&login=false")
    .then(function (response) {
      if (objectIsEmpty(response.data)) {
        console.log("Sorry, " + username + " doesn't exist.");
        showInvalidInput("signInUsername");
        showInvalidUserMessage(username);
        $scope.loginMessage = "Log In";
        callback(false);
      } else {
        $scope.loginMessage = "Logging In...";
        callback(response.data);
      }
    });
  };

  // -- END OF SIGN IN / LOGIN METHODS -- // -------------------------------------------------

  // -- SIGN UP METHODS -- // -------------------------------------------------

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

  // Update user with new band info
  $scope.updateUserAndBand = function(userId, band, callback) {
    $http.post("/php/updateUser.php?userId=" + userId + "&type=bandUpdate", band)
    .then(function (response) {
      console.log(response.data);
      callback(true);
    },
    function (response) {
      console.log(response.data);
      callback(false);
    });
  };

  // Update user with login token
  $scope.updateToken = function(userId) {
    $scope.updateUser(userId, "tokenUpdate", "token", function (success) {
      if (success) {
        console.log("Updated token successfully.");
      } else {
        console.log("Update unsuccessful.");
      }
      hideElementById("startBandForm");
      displayElementById("authentication");
    })
  };

  // -- END OF SIGN UP METHODS -- // -------------------------------------------------

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
    $scope.validUsername(function(validUsername) {
      valid = validUsername && valid;
      valid = passwordsMatch($scope.user.password, $scope.user.passwordAgain) && valid;
      valid = checkName($scope.user.name) && valid;
      callback(valid);
    });
  };

  // TODO change email to username
  // Validate the given username in the database
  $scope.validUsername = function(callback) {
    var username = $scope.user.username;
    if(inputEmpty(username, "signUpUsername")) {
      callback(false);
    };
    $scope.getUser(username, false, function (user) {
      $scope.loginMessage = user;
      if (objectIsEmpty(user)) {
        callback(true);
      } else {
        console.log("Sorry, " + username + " already exists.");
        showInvalidInput("signUpUsername");
        callback(false);
      }
    });
  };

  // -- END OF JOIN BAND FORM -- // -------------------------------------------------

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
        var email = {
          email: newUser.email,
            subject: "Subject",
            body: "You just created a new account!"
        };
          $http.post("/php/sendEmail.php", email)
              .then(function (response) {
                      console.log(response.data);
                      callback(true);
                  },
                  function (response) {
                      console.log(response.data);
                      callback(false);
                  });
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
    $http.get("/php/getUser.php?username=" + userName + "&login=" + login)
    .then(function (response) {
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

  // -- STARTUP CONTROLLER METHODS -- // ----------------------------------------

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

  $scope.loadUserData = function () {
    $scope.user = CURRENT_USER;
    $scope.user.bands = CURRENT_BANDS;
  };

  $scope.loadController = function() {
      setupController();
      // Check if user is logged in. Show user information instead of authentication forms.
      if (loggedIn) {
          $scope.loadUserData();
          navigateToURL("/#/dashboard");
      } else {
          if (signedOut) {
              // change token
              $scope.updateToken(CURRENT_USER.id);

          } else {
              // Check user token to see if the user has already logged in
              $scope.checkDatabaseIfLoggedIn(function(loggedInUser, success) {
                  if (success) {
                      CURRENT_USER = loggedInUser;
                      CURRENT_BANDS = loggedInUser.bands;
                      if (LAST_URL === "") {
                        $scope.loadUserData();
                        loginUser();
                      } else {
                        goToLastURL();
                      }

                  } else {
                      clearAccountData();
                      displayElementById("authentication");
                      hideElementById("startBandForm");
                  }
              });
          }
      }
      removeNavLink("#bandLink");
      removeNavLink("#folderLink");
      finishControllerSetup();
  };

  // Main load method
  $scope.loadController();


}]);
// End of mainController scope
