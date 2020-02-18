app.controller('bandController', ['$scope', '$sce', '$http', '$filter',
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
          location.reload(true);
        } else {
          $scope.addFolderMessage = "Failed to add folder.";
        }
      },
      function (response) {
        console.log(response.data);
      });

  };

  $scope.openFolder = function(folder) {
    CURRENT_BAND = $scope.band;
    CURRENT_FOLDERS = $scope.folders;
    CURRENT_FOLDER = folder;
    navigateToURL("/#/folder?id=" + folder.id);
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
      navigateToURL("/#/playlist?id=bandFavorites");
  };

  $scope.openHighlightsFolder = function() {
      navigateToURL("/#/playlist?id=bandHighlights");
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
  };

  $scope.hideFolderButtons = function() {
    hideElementById("hideButtonsButton");
    displayElementById("showButtonsButton");
    hideElementById("hiddenFolderButtons");
    hideElementById("bandDetails");
    displayElementById("bandName");
  };

  $scope.showFolderSearchBar= function() {
    hideElementById("searchFoldersButton");
    displayElementById("folderSearchBar");
  };

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

    $scope.openFolderDetails = function(folder, event) {
      event.stopPropagation();
      hideElementById("folderDetailsOpen-" + folder.id);
      displayElementById("folderDetailsClose-" + folder.id);
      getElementById("folderDetails-" + folder.id).style.height = "0";
      getElementById("folderDetails-" + folder.id).style.borderTop = "1px solid #CCC";
      getElementById("folderDetails-" + folder.id).style.padding = "20px";
      displayElementById("detailsDiv-" + folder.id);
    }

    $scope.closeFolderDetails = function(folder, event) {
      event.stopPropagation();
      hideElementById("folderDetailsClose-" + folder.id);
      displayElementById("folderDetailsOpen-" + folder.id);
      getElementById("folderDetails-" + folder.id).style.height = "0";
      getElementById("folderDetails-" + folder.id).style.borderTop = "none";
      getElementById("folderDetails-" + folder.id).style.padding = "0";
      hideElementById("detailsDiv-" + folder.id);
    }

    $scope.getFolders = function(band, callback) {
      var id = band.id;
      if (id === "-1") {
        callback(testFolders);
      } else {
        $http.get("/php/getFolders.php?bandName=" + band.name)
            .then(function (response) {
              console.log(response.data);
              CURRENT_FOLDERS = response.data;
              callback(response.data);
            });
      }
    };

    $scope.getBandMembers = function(callback) {
      if (CURRENT_BAND.id === "-1") {
        callback(members);
      } else {
        $http.get("/php/getBandMembers.php?bandId=" + CURRENT_BAND.id)
            .then(function (response) {
              callback(response.data);
            });
      }
    };

    // Get band from database
    $scope.getBand = function(id, callback) {
      if (id === "-1") {
        callback(testBand);
      } else {
        $http.get("/php/getBand.php?id=" + id)
            .then(function (response) {
              callback(response.data);
            });
      }

    };

    $scope.loadUIObjects = function() {
      $scope.band = CURRENT_BAND;
      $scope.files = CURRENT_FILES;
      $scope.folder = CURRENT_FOLDER;
      $scope.members = CURRENT_MEMBERS;
      $scope.folders = CURRENT_FOLDERS;
      var bandUrl = "/#/band?id=" + CURRENT_BAND.id;
      removeNavLink("bandLink");
      addNavLink("bandLink", CURRENT_BAND.name, bandUrl);
      displayElementById("bandView");
      finishControllerSetup();
    };

    $scope.loadController = function() {
      setupController();
      // Do this if logged in
      if (isLoggedIn()) {
        updateTitle(CURRENT_BAND.name);
        var id = getParameterByName("id");
        console.log(id);
        if (id) {
          $scope.getBand(id, function(band) {
            CURRENT_BAND = band;
            $scope.getFolders(band, function(folders) {
              CURRENT_FOLDERS = folders;
              if (CURRENT_FOLDERS.length == 0) {
                $scope.folderMessage = "Click the green button to Add a Folder!";
                CURRENT_FOLDERS = [];
              }
              $scope.getBandMembers(function(members) {
                CURRENT_MEMBERS = members;
                $scope.loadUIObjects();
              });
            });
          });
        } else {
          navigateToURL("/#/dashboard");
        }
      }

    };

    $scope.loadController();

}]);

