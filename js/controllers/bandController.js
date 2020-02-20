app.controller('bandController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
    // Band Controller scoped variables
    $scope.folders = [];
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

    // -- MAIN BAND CONTROLLER METHODS -- // -------------------------------------------------

    // Open Folder and navigate to Folder controller
    $scope.openFolder = function(folder) {
    CURRENT_BAND = $scope.band;
    CURRENT_FOLDERS = $scope.folders;
    CURRENT_FOLDER = folder;
    navigateToURL("/#/folder?id=" + folder.id);
    };

    $scope.openFavoritesFolder = function() {
      navigateToURL("/#/playlist?id=bandFavorites");
    };

    $scope.openHighlightsFolder = function() {
      navigateToURL("/#/playlist?id=bandHighlights");
    };

    // -- END OF MAIN BAND CONTROLLER METHODS -- // -------------------------------------------------

    // -- PAGINATION METHODS -- // --------------------------------------------

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

    // -- END OF PAGINATION METHODS -- // --------------------------------------------

    // -- BAND UI MANAGEMENT -- // --------------------------------------------

    // Show Folder filter dropdown
    $scope.showFilters = function() {
        var filters = getElementById("folderFilters");
        console.log(filters.style.display);
        if (filters.style.display === "none") {
            showElementById("folderFilters");
        } else {
            hideElementByIdWithAnimation("folderFilters");
        }
    };

    // Show Folder Search Bar
    $scope.showFolderSearchBar= function() {
        hideElementById("searchFoldersButton");
        displayElementById("folderSearchBar");
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

    // -- END OF BAND UI MANAGEMENT -- // -------------------------------------

    // -- START OF Data PHP CALLS -- // -----------------------------------------------

    // Get Files with given folder and band
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
    // Add Playlist method
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

    // Getting user playlists for given band
    $scope.getPlaylists = function() {
        console.log("Getting Playlists...");
        $http.get("/php/getPlaylists.php?bandId=" + CURRENT_BAND.id + "&userId=" + CURRENT_USER.id)
            .then(function (response) {
                console.log(response.data);
                $scope.playlists = response.data;

            });
    };

    // Get playlist files with given id
    $scope.getPlaylistFiles = function(playlistId, callback) {
        $http.get("/php/getFiles.php?type=playlist&playlistId=" + playlistId)
            .then(function (response) {
                console.log(response.data);
                CURRENT_FILES = response.data;
                callback(response.data);
            });
    };

    // Get Folders for given band
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

    // Get Band Members for given band
    $scope.getBandMembers = function(callback) {
        // If Test Band
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
        // If Test Band
        if (id === "-1") {
        callback(testBand);
        } else {
        $http.get("/php/getBand.php?id=" + id)
            .then(function (response) {
              callback(response.data);
            });
        }
    };

    // -- END OF Data PHP CALLS -- // -------------------------------------------------

    // -- STARTUP CONTROLLER METHODS -- // ----------------------------------------

    // Load UI for Band Controller
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

    // Load Band Controller method
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

