app.controller('folderController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.visibleFolders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};
  $scope.members = [];

  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";

  $scope.currentPage = 1;
  $scope.numberOfFolders = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = 20;
  $scope.maxSize = 5;
  $scope.search = "";

  $scope.playlistName = "";
  $scope.playlists = [];

  //TODO Create functionality for a recent file selection
  $scope.addFolder = function() {
    var folder = {
      name: $scope.newFolder,
      metaName: generateMetaName($scope.newFolder),
      band: $scope.band.name
    };
    // TODO verify that the right data is there
    $http.post("/php/addFolder.php", folder)
    .then(
      function (response) {
        if (response.data === "New record created successfully!") {
          $scope.addFolderMessage = "Success!";
          $scope.folderMessage = "";

          $scope.folders.push(folder);
          console.log($scope.folders);
        } else {
          $scope.addFolderMessage = "Failed to add folder.";
        }
      },
      function (response) {
        console.log(response.data);
      });

  };

  $scope.openFolder = function(folder) {
    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/";
    var folderName = folder.name;
    folder.name = "Loading...";
    // Open Test Files
    if (folder.metaName == "test_folder") {
      CURRENT_FILES = testFiles;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = folder;
      folderUrl += CURRENT_FOLDER.metaName;
      console.log("folder link: " + folderUrl);
      folder.name = folderName;
      navigateToURL(folderUrl);
    } else {
      var folderMetaName = folder.metaName;
      var bandId = CURRENT_BAND.id;
      $scope.getFiles(folderMetaName, bandId, folder, function(success) {
        folder.name = folderName;
        if (success) {
          folderUrl += CURRENT_FOLDER.metaName;
          navigateToURL(folderUrl);
        } else {
          console.log("Getting files failed.");
        }
      });

    }
  };

    $scope.showFilters = function() {
        var filters = getElementById("folderFilters");
        console.log(filters.style.display);
        if (filters.style.display === "none") {
            showElementById("folderFilters");
        } else {
            hideElementByIdWithAnimation("folderFilters");
        }

    };

  $scope.getFiles = function(folderName, bandId, folder, callback) {
    $http.get("/php/getFiles.php?type=folder&folderName=" + folder.metaName + "&bandId=" + CURRENT_BAND.id)
    .then(function (response) {
      console.log(response.data);
      CURRENT_FILES = response.data;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = folder;
      callback(response.data);
    });
  };

  $scope.archiveFolder = function(folder) {
    console.log("Archiving folder");
    var confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (confirmDelete) {
      $http.get("/php/archiveFolder.php?folderName=" + folder.metaName + "&bandName=" + $scope.band.metaName)
      .then(function (response) {
        console.log(response.data);
        $scope.folders = response.data;
        CURRENT_FOLDERS = response.data;
      });
    }
  };

    $scope.openFavoritesFolder = function() {
        $scope.getFavoriteFiles(CURRENT_USER.id, CURRENT_BAND.id, function(success) {
            if (success) {
                CURRENT_FOLDER = {
                    name: "Favorites",
                    metaName: "favorites",
                };
                navigateToURL("/#/files");
            } else {
                console.log("Getting files failed.");
            }
        });
    };

    $scope.getFavoriteFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=bandFavorites&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
                console.log(response.data);
                CURRENT_FILES = response.data;
                callback(response.data);
            });
    };

    $scope.openHighlightsFolder = function() {
        $scope.getHighlightedFiles(CURRENT_USER.id, CURRENT_BAND.id, function(success) {
            if (success) {
                CURRENT_FOLDER = {
                    name: "Highlights",
                    metaName: "highlights",
                };
                navigateToURL("/#/files");
            } else {
                console.log("Getting files failed.");
            }
        });
    };

    $scope.getHighlightedFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=bandHighlights&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
                console.log(response.data);
                CURRENT_FILES = response.data;
                callback(response.data);
            });
    };

  $scope.goToUserInfo = function() {
    navigateToURL("/#/");
  };

  // Safely wait until the digest is finished before applying the ui change
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  /*
  $scope.$watch('currentPage + pageSize', function() {
    var begin = (($scope.currentPage - 1) * $scope.pageSize);
    var end = begin + $scope.pageSize;

    $scope.visibleFolders = $scope.folders.slice(begin, end);
    console.log($scope.visibleFolders);
    var elements = document.getElementById("pagination").getElementsByTagName("ul");
    elements[0].classList.add("pagination");
  });
*/

  $scope.getData = function () {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.folders, $scope.search);
    };

  $scope.numberOfPages = function() {
    return Math.ceil($scope.getData().length/$scope.pageSize);
  };

  $scope.numberOfFilesOnPage = function() {
    var numFiles = ($scope.currentPage + 1) * $scope.pageSize;
    if (numFiles >= $scope.numberOfFiles) {
      return $scope.numberOfFiles;
    } else {
      return numFiles;
    }
  };

  // Open User Details
  $scope.showBandDetails = function() {
    var detailsDisplay = getElementById("bandDetails").style.display;
    if (detailsDisplay == "none" || detailsDisplay === "") {
      displayElementById("bandDetails");
    } else {
      hideElementById("bandDetails");
    }
  };

  $scope.showFolderButtons = function() {
    hideElementById("showButtonsButton");
    displayElementById("hideButtonsButton");
    displayElementById("hiddenFolderButtons");
    hideElementById("bandName");
  }

  $scope.hideFolderButtons = function() {
    hideElementById("hideButtonsButton");
    displayElementById("showButtonsButton");
    hideElementById("hiddenFolderButtons");
    hideElementById("bandDetails");
    displayElementById("bandName");
  }

    $scope.addPlaylist = function() {
        if ($scope.playlistName != "") {
            var playlist = {
                name: $scope.playlistName,
                bandId: CURRENT_BAND.id,
                userId: CURRENT_USER.id
            };

            $http.post("/php/addPlaylist.php", playlist)
                .then(function (response) {
                    console.log(response.data);
                    $scope.playlists.push(playlist);
                },
                 function (response) {
                    console.log(response.data);
                 });

        } else {
            console.log("No Playlist");
        }

    };

  $scope.getPlaylists = function() {
      console.log("Getting Playlists...");
      $http.get("/php/getPlaylists.php?bandId=" + CURRENT_BAND.id + "&userId=" + CURRENT_USER.id)
          .then(function (response) {
              console.log(response.data);
              $scope.playlists = response.data;

          });
  };

    $scope.openPlaylist = function(playlist) {
        $scope.getPlaylistFiles(playlist.id, function(success) {
            if (success) {
                /*
                CURRENT_PLAYLIST = {
                    name: playlist.name,
                    metaName: generateMetaName((playlist.name)),
                    userId: playlist.userId,
                    bandId: playlist.bandId,
                    public: playlist.public
                };
                */
                CURRENT_FOLDER = {
                    name: playlist.name,
                    metaName: generateMetaName(playlist.name)
                };
                CURRENT_BAND = {
                    name: "Playlist",
                    metaName: "playlist"
                };
                navigateToURL("/#/files");
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

    showAppLoader();
  // Do this if logged in
  if (isLoggedIn()) {
    console.log("Folder Controller");
    if (CURRENT_BAND.name === "My Bands") {
      navigateToURL("/#/user")
    }
    $scope.band = CURRENT_BAND;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    $scope.members = CURRENT_MEMBERS;
    //$scope.playlists = CURRENT_SETLISTS;

    if (CURRENT_FOLDERS === "") {
      $scope.folderMessage = "Click the green button to Add a Folder!";

    } else {
      $scope.folders = CURRENT_FOLDERS;
    }
    //$scope.getSetLists();
    var urlPaths = window.location.hash.split('/');
    document.title = CURRENT_BAND.name;
    var bandUrl = "/#/band/" + CURRENT_BAND.metaName;
    lastUrl = bandUrl;
    removeNavLink("bandLink");
    console.log(CURRENT_BAND.name);
    addNavLink("bandLink", CURRENT_BAND.name, bandUrl)
  }
  hideAppLoader();
}]);
