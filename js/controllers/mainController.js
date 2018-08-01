app.controller('mainController', ['$scope', '$http',
function($scope, $http) {
  $scope.sqlUser = "";
  $scope.sqlBand = {};
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
  $scope.recentComments = [];
  $scope.recentHighlights = [];
  $scope.pageSize = 10;
  $scope.bandFilter = "";

  // -- MAIN METHODS -- // ----------------------------------------

  $scope.enterBand = function(band) {
    console.log(band);
    hideElementById("band-" + band.id)
    displayElementById("bandLoader-" + band.id);
    CURRENT_BAND = band;
    if (CURRENT_FOLDERS.length > 0) {
      if (CURRENT_FOLDERS[0].bandId === band.id) {
        navigateToURL("/#/band/" + CURRENT_BAND.metaName);
      }
    }


    $scope.getFolders(band, function() {
      $scope.getBandMembers(function(members) {
        console.log(members);
        CURRENT_MEMBERS = members;
        navigateToURL("/#/band/" + CURRENT_BAND.metaName);
      });

    });
  };

  $scope.getBandMembers = function(callback) {
    $http.get("/php/getBandMembers.php?bandId=" + CURRENT_BAND.id)
    .then(function (response) {
      callback(response.data);
    });
  };

  $scope.getFolders = function(band, callback) {
    var bandName = band.name;
    if (bandName === "Test Band") {
      CURRENT_FOLDERS = testFolders;
      CURRENT_MEMBERS = members;
      navigateToURL("/#/band/" + CURRENT_BAND.metaName);
    } else {
      $http.get("/php/getFolders.php?bandName=" + bandName)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FOLDERS = response.data;
        callback();
      });
    }
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


  $scope.backToChooseBand = function() {
    $scope.user.bands[0].name = "";
    hideElementById("joinBand");
    displayElementById("chooseBand");
  }

  // Show add band input
  $scope.addBand = function() {
    var bandName = $scope.newBandName;
    $scope.user.bands.push({name: bandName,
                            metaName: generateMetaName(bandName),
                            memberIds: [$scope.user.id],
                            code: "1234"});
    //TODO check availability of band
    $scope.hideAddBandInput;

  };

  $scope.openFavoritesFolder = function() {
    $scope.getFavoriteFiles(CURRENT_USER.id, function(success) {
      if (success) {
          CURRENT_FOLDER = {
              name: "All Favorites",
              metaName: "all-favorites",
          };
          CURRENT_BAND = {
              name: "My Bands",
              metaName: "my-bands"
          }
        navigateToURL("/#/files");
      } else {
        console.log("Getting files failed.");
      }
    });
  };

  $scope.getFavoriteFiles = function(userId, callback) {
    $http.get("/php/getFiles.php?type=allFavorites&userId=" + userId)
    .then(function (response) {
      console.log(response.data);
      CURRENT_FILES = response.data;
      callback(response.data);
    });
  };

  $scope.openHighlightsFolder = function() {
    $scope.getHighlightedFiles(CURRENT_USER.id, function(success) {
        if (success) {
            CURRENT_FOLDER = {
                name: "All Highlights",
                metaName: "all-highlights",
            };
            CURRENT_BAND = {
                name: "My Bands",
                metaName: "my-bands"
            };
            navigateToURL("/#/files");
        } else {
            console.log("Getting files failed.");
        }
    });
  };

    $scope.getHighlightedFiles = function(userId, callback) {
        $http.get("/php/getFiles.php?type=allHighlights&userId=" + userId)
            .then(function (response) {
                console.log(response.data);
                CURRENT_FILES = response.data;
                callback(response.data);
            });
    };

    $scope.openFile = function(id) {
        openFile(id);
    };

  // Open User Details
  $scope.showUserDetails = function() {
    var detailsDisplay = getElementById("userDetails").style.display;
    var detailsButton = getElementById("userDetailsButton");
    if (detailsDisplay == "none" || detailsDisplay === "") {
      displayElementById("userDetails");
      detailsButton.innerHTML = "Close";
    } else {
      hideElementById("userDetails");
      detailsButton.innerHTML = "Details";
    }
  };

  // -- JOIN NEW BAND METHODS -- // ----------------------------------------

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
              $scope.sqlBand = band;
              displayElementById("joinBand");
          }
      });
  };

  // Get band from database
  $scope.getBand = function(bandName, callback) {
      $http.get("/php/getBand.php?bandName=" + bandName)
          .then(function (response) {
              callback(response.data);
          });
  };

  // Make sure the given code matches the band code in the database
  $scope.checkBandCode = function() {
      if (!inputEmpty($scope.bandCode, "bandCodeInput")) {
          console.log($scope.user.bands[0].code);
          console.log($scope.bandCode);
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
      var bandName = $scope.newBandName;
      if (bandName === CURRENT_BAND.name){
          console.log("Don't add your own band dummy.");
      }
      $scope.getBand(bandName, function(band) {
          // If the response is an empty object, the band does not exist yet.
          if (objectIsEmpty(band)) {
              console.log("Band does not exist.");

              if ($scope.bandCode === "") {
                  $scope.updateUser($scope.user.id, band, function(success) {
                      if (success) {
                          $scope.user.bands.push(band);
                          CURRENT_BANDS = $scope.user.bands;
                          location.href = "/#/user";
                      }
                  });
              }
              $scope.newBandName = "";
              $scope.bandCode = "";
              // Else the band does exist already, so load the band data and prompt user for band code
          } else {
              if (band.code === $scope.bandCode) {
                  console.log($scope.user.id);
                  $scope.updateUser($scope.user.id, band, function(success) {
                      if (success) {
                          $scope.user.bands.push(band);
                          CURRENT_BANDS = $scope.user.bands;
                          $scope.newBandName = "";
                          $scope.bandCode = "";
                      }
                  });
              } else {
                  console.log("Incorrect Band Code.");
                  $scope.bandCode = "";
              }
          }
      });
  };

  $scope.updateUser = function(userId, band, callback) {
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

  $scope.getRecentActivity = function(bands) {
      var bandIds = [];
      for (var i = 0; i < bands.length; i++) {
          console.log(bands[i].id);
          bandIds.push(bands[i].id);
      }
      console.log(bandIds);
      $http.get("/php/getRecentActivity.php?bandIds=" + JSON.stringify(bandIds))
          .then(function (response) {
              hideElementById("loadContainer");
              displayElementById("commentContainer");
              $scope.recentComments = response.data.comments;
              $scope.recentHighlights = response.data.highlights;
          });
  };

  $scope.showRecentComments = function() {
      $scope.pageSize = 10;
      getElementById("activityTitle").innerText = "Recent Comments";
      hideElementById("highlightContainer");
      displayElementById("commentContainer");
      console.log($scope.pageSize);
  };

  $scope.showRecentHighlights = function() {
      $scope.pageSize = 10;
      getElementById("activityTitle").innerText = "Recent Highlights";
      hideElementById("commentContainer");
      displayElementById("highlightContainer");
      console.log($scope.pageSize);
  };

  $scope.showAllRecentActivity = function(newPageSize) {
      $scope.pageSize = newPageSize;
  };

  $scope.recentActivityFilter = function(item) {
      console.log(item);
      return item.band.name === bandFilter;
  };

  $scope.loadController = function() {
      // Check if user is logged in. Show user information instead of authentication forms.
      if (isLoggedIn()) {
          $('document').ready(function() {
              $(window).scrollTop(0);
          });
          $scope.getRecentActivity(CURRENT_BANDS);
          console.log(CURRENT_USER);
          console.log(CURRENT_BANDS);
          $scope.user = CURRENT_USER;
          $scope.user.bands = CURRENT_BANDS;
          getElementById("userLink").innerText = CURRENT_USER.name;
      } else {
          CURRENT_FILE = "";
          CURRENT_FILES = "";
          CURRENT_FOLDER = "";
          CURRENT_FOLDERS = "";
          CURRENT_BANDS = "";
          CURRENT_BAND = "";
          navigateToURL("/#/");
      }
      removeNavLink("#bandLink");
      removeNavLink("#folderLink");
  };

  // Main load method
  $scope.loadController();


}]);
// End of mainController scope
