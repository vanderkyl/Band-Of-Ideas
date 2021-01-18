app.controller('mainController', ['$scope', '$http',
function($scope, $http) {
  $scope.newBand = {};
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
  $scope.recentComments = [];
  $scope.recentHighlights = [];
  $scope.pageSize = 10;
  $scope.bandFilter = "";
  $scope.playlists = [];
  $scope.playlistName = "";
  $scope.numberOfIdeas = 0;
  $scope.welcomeMessage = "Welcome back!"

  // -- MAIN METHODS -- // ----------------------------------------

  $scope.enterBand = function(band) {
    console.log(band);
    hideElementById("band-" + band.id)
    displayElementById("bandLoader-" + band.id);
    CURRENT_BAND = band;
    if (CURRENT_FOLDERS.length > 0) {
      if (CURRENT_FOLDERS[0].bandId === band.id) {

      }
    }
    navigateToURL("/#/band?id=" + band.id);



  };

  $scope.getBandMembers = function(callback) {
    $http.get("/php/getBandMembers.php?bandId=" + CURRENT_BAND.id)
    .then(function (response) {
      callback(response.data);
    });
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
    };


  $scope.addBand = function(callback) {
      var newBand = {
          band: $scope.newBand,
          userId: $scope.user.id
      };
      $http.post("/php/addBand.php", newBand)
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

  // Open user favorites playlist/folder
  $scope.openFavoritesFolder = function() {
    navigateToURL("/#//playlist?id=allFavorites");
  };

  // Open user highlights playlist/folder
  $scope.openHighlightsFolder = function() {
    navigateToURL("/#//playlist?id=allHighlights");
  };

    $scope.openFile = function(id, time) {
        var numTime = parseInt(time);
        if (numTime > 0) {
            openFile(id, time);
        } else {
            openFile(id, 0);
        }
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

  $scope.showBandDetails = function(event, band) {
    event.stopPropagation();
    $('#bandDetails-' + band.id).modal();
  };

  // -- JOIN NEW BAND METHODS -- // ----------------------------------------

  // Checks if the band name given already exists
  $scope.checkBandAvailability = function() {
      var bandName = $scope.newBandName;
      $scope.getBand(bandName, function(band) {
          hideElementById("chooseBand");
          // If the response is an empty object, the band does not exist yet.
          if (objectIsEmpty(band)) {
              $scope.newBand = {
                  id: "",
                  name: bandName,
                  metaName: generateMetaName(bandName),
                  memberIds: "",
                  code: generateBandCode(),
                  joiningBand: false
              };
              displayElementInlineById("addBandButton");
              displayElementById("joinBand");
              // Else the band does exist already, so load the band data and prompt user for band code
          } else {
              $scope.newBand = band;
              $scope.newBand.joiningBand = true;
              //$scope.sqlBand = band;
              displayElementById("checkBandCode");
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
          if ($scope.newBand.code === $scope.bandCode) {
              hideElementById("checkBandCode");
              displayElementInlineById("addBandButton");
              displayElementById("joinBand");
          } else {
              console.log("Please try again.");
              showInvalidInput("bandCodeInput");
          }
      }
  }

  $scope.joinBand = function() {
      var bandName = $scope.newBand.name;
      if (bandName === CURRENT_BAND.name){
          console.log("Don't add your own band dummy.");
      }
      $scope.addBand(function (success) {
          console.log(success);
          $scope.getUser($scope.user.username, false, function() {
              closeModal("addBandModal");
              $scope.closeAddBandModal();
          });
      });
      $
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

    // Go back to the band name input form
    $scope.backToChooseBand = function() {
        $scope.newBandName = "";
        $scope.newBand = {};
        hideElementById("checkBandCode");
        displayElementById("chooseBand");
    }

    // Go back to the band name input form
    $scope.closeAddBandModal = function() {
        $scope.newBandName = "";
        $scope.newBand = {};
        hideElementById("checkBandCode");
        hideElementById("joinBand");
        displayElementById("chooseBand");
    }

  $scope.getRecentActivity = function(bands) {
      var bandIds = [];
      for (var i = 0; i < bands.length; i++) {
          console.log(bands[i].id);
          bandIds.push(bands[i].id);
        $http.get("/php/getRecentActivity.php?type=activityCount&bandId=" + bands[i].id)
            .then(function (response) {
              ACTIVITY_COUNTS.push(response);
            });
      }

      console.log(ACTIVITY_COUNTS);
      $http.get("/php/getRecentActivity.php?type=bandList&bandIds=" + JSON.stringify(bandIds))
          .then(function (response) {
              hideElementById("loadCommentsContainer");
              displayElementById("commentContainer");
              //$scope.recentComments = response.data.comments;
              $scope.recentHighlights = response.data.highlights;
              console.log($scope.recentHighlights);
          });
  };

  $scope.showIdeaGraph = function () {
      showElementById("ideaGraph");
  };

  $scope.hideIdeaGraph = function () {
      hideElementByIdWithAnimation("ideaGraph");
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

  $scope.currentTimeToString = function(currentTime) {
    return timeToString(parseInt(currentTime));
  };


  $scope.showAllRecentActivity = function(newPageSize) {
      $scope.pageSize = newPageSize;
  };

  $scope.recentActivityFilter = function(item) {
      console.log(item);
      return item.band.name === bandFilter;
  };

    $scope.addPlaylist = function() {
        if ($scope.playlistName != "") {
            var playlist = {
                name: $scope.playlistName,
                bandId: 0,
                userId: CURRENT_USER.id
            };
            showPlaylistLoader();
            $http.post("/php/addPlaylist.php", playlist)
            .then(function (response) {
                    console.log(response.data);
                    $scope.playlists.push(playlist);
                    hidePlaylistLoader();
                },
                function (response) {
                    console.log(response.data);
                    hidePlaylistLoader();
                });

        } else {
            console.log("No Playlist");
        }

    };

    $scope.getPlaylists = function() {
        showPlaylistLoader();
        $http.get("/php/getPlaylists.php?userId=" + CURRENT_USER.id)
            .then(function (response) {
                CURRENT_PLAYLISTS = response.data;
                $scope.playlists = response.data;
                hidePlaylistLoader();
            });
    };

    $scope.openPlaylist = function(playlist) {
        $scope.getPlaylistFiles(playlist.id, function(success) {
            if (success) {
                CURRENT_PLAYLIST = {
                    id: playlist.id,
                    name: playlist.name,
                    metaName: generateMetaName((playlist.name)),
                    userId: playlist.userId,
                    bandId: playlist.bandId,
                    public: playlist.public
                };
                navigateToURL("/#/playlist?id=" + playlist.id);
            } else {
                console.log("Getting files failed.");
            }
        });
    };

  // Http request to get favorited files
  $scope.getPlaylistFiles = function(playlistId, callback) {
      $http.get("/php/getFiles.php?type=playlist&playlistId=" + playlistId)
          .then(function (response) {
              console.log(response.data);
              CURRENT_FILES = response.data;
              callback(response.data);
          });
  };

  // Get a random Welcome Message from a list of choices
  $scope.getRandomWelcomeMessage = function(user) {
    var message = "";
    // Generate a random number between 1 and 5
    var choice = Math.floor((Math.random() * 5) + 1);
    switch (choice) {
      case 1:
        message = "Hello " + user.name;
        break;
      case 2:
        message = "Welcome back " + user.name;
        break;
      case 3:
        message = user.name + "'s Dashboard";
        break;
      case 4:
        message = "Hi " + user.name;
        break;
      case 5:
        message = "Hello " + user.name;
        break;
      default:
        message = "Hello " + user.name;
    }
    return message;
  };

  $scope.loadUIObjects = function() {
    $scope.user = CURRENT_USER;
    $scope.user.bands = CURRENT_BANDS;
    for (var i = 0; i < $scope.user.bands.length; i++) {
        $scope.numberOfIdeas += $scope.user.bands[i].numFiles;
    }
    $scope.welcomeMessage = getRandomWelcomeMessage($scope.user);
    removeNavLink("#bandLink");
    removeNavLink("#folderLink");
    displayElementById("mainView");
    finishControllerSetup();
  };

  // Load Main Controller method
  $scope.loadController = function() {
      setupController();
      // Check if user is logged in. Show user information instead of authentication forms.
      if (isLoggedIn()) {
          if (!testLogin) {
            $scope.getUser(CURRENT_USER.username, true, function() {
              console.log("Getting user");
            });
          $scope.getPlaylists();
          $scope.getRecentActivity(CURRENT_BANDS);
          }

          $scope.loadUIObjects();
      }
  };

  // Main load method
  $scope.loadController();


}]);
// End of mainController scope
