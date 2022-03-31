app.controller('bandController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
    // Band Controller scoped variables
    $scope.folders = [];
    $scope.newFolder = "";
    $scope.band = {};
    $scope.members = [];
    $scope.songs = [];
    $scope.newSong = "";

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
    $scope.filesTitle = "";
    $scope.currentSelectedFileId = -1;
    $scope.files = [];
    $scope.favoriteFiles = [];
    $scope.highlightedFiles = [];
    $scope.recentComments = [];

    // -- MAIN BAND CONTROLLER METHODS -- // -------------------------------------------------

    // Open Folder and navigate to Folder controller
    $scope.openFolder = function(folder) {
        CURRENT_BAND = $scope.band;
        CURRENT_FOLDERS = $scope.folders;
        CURRENT_FOLDER = folder;
        navigateToURL("/#/folder?id=" + folder.id);
    };

    // Open Song and navigate to Song controller
    $scope.openSong = function(song) {
        CURRENT_BAND = $scope.band;
        CURRENT_SONGS = $scope.folders;
        CURRENT_SONG = song;
        navigateToURL("/#/songs?id=" + song.id);
    };

    $scope.openFilesSection = function() {
        showElementById("filesSection");
    };

    $scope.closeFilesSection = function() {
        hideElementByIdWithAnimation("filesSection");
    };

    $scope.openFavoriteFilesSection = function() {
        $scope.files = $scope.favoriteFiles;
        $scope.filesTitle = "Favorite";
        $scope.openFilesSection();
    };

    $scope.openHighlightedFilesSection = function() {
        $scope.files = $scope.highlightedFiles;
        $scope.filesTitle = "Highlighted";
        $scope.openFilesSection();
    };

    $scope.getBandFavoriteFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=bandFavorites&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
                callback(response.data);
            });
    };

    $scope.openHighlightsFolder = function() {
      navigateToURL("/#/playlist?id=bandHighlights");
    };

    $scope.getBandHighlightedFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=bandHighlights&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
                callback(response.data);
            });
    };

    $scope.openFile = function(file, event) {
        stopPropogation(event);
        getElementById("audioPlayerAudio").pause();

        console.log("Opening file:");
        console.log(file);
        CURRENT_FILE = file;
        quitPlayer();
        navigateToURL("/#/idea?id=" + file.id);
    };

    $scope.openRecentlyCommentedFile = function(id, time) {
        var numTime = parseInt(time);
        if (numTime > 0) {
            openFile(id, time);
        } else {
            openFile(id, 0);
        }
    };

    $scope.closeFile = function() {
        getElementById("audio").pause();
        document.title = CURRENT_FOLDER.name;
        closeFile($scope.file.id);
    };

    $scope.openMiniPlayer = function() {
        var source = getElementById("m4aSource").src;
        var currentTime = getElementById("audio").currentTime;
        openMiniPlayer($scope.file.id, $scope.file.name, source, currentTime);
    };

    $scope.openMiniAudioPlayer = function(file) {
        showPauseButton(file);
        CURRENT_FILE = file;
        CURRENT_SELECTED_FILE = file;
        $scope.updateFileViews(file);
        openMiniPlayer(file.id, file.name, file.link, 0);
    };

    $scope.playMiniAudioPlayer = function(file) {
        showPauseButton(file);
        playAudioFromPlayer();
    };

    $scope.pauseMiniAudioPlayer = function(file) {
        showPlayButton(file);
        pauseAudioFromPlayer();
    };

    $scope.updateFileViews = function(file) {
        updateFileViews($http, file);
    };

    $scope.goToRecentComments = function() {
        scrollToElementById("recentComments");
    };

    $scope.showPopup = function(id) {
        if ($scope.currentSelectedFileId !== -1) {
            $scope.togglePopup($scope.currentSelectedFileId);
        }
        $scope.currentSelectedFileId = id;
        $scope.togglePopup(id);
    };

    $scope.hidePopup = function(id, event) {
        stopPropogation(event);
        $scope.currentSelectedFileId = -1;
        var popup = document.getElementById("filePopup-" + id);
        popup.classList.remove("show");
    };

    $scope.togglePopup = function(id) {
        var popup = document.getElementById("filePopup-" + id);
        popup.classList.toggle("show");
    };

    $scope.showFileSearchBar= function() {
        hideElementById("searchFilesButton");
        displayElementById("fileSearchBar");
        displayElementById("fileFilters");
    };

    $scope.showSongSearchBar= function() {
        hideElementById("searchSongsButton");
        displayElementById("songSearchBar");
        displayElementById("songFilters");
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

    $scope.getRecentActivity = function() {
        var bandIds = [ $scope.band.id ];
        $http.get("/php/getRecentActivity.php?type=bandList&bandIds=" + JSON.stringify(bandIds))
            .then(function (response) {
                hideElementById("loadCommentsContainer");
                displayElementById("commentContainer");
                $scope.recentComments = response.data.highlights;
            });
    };

    //TODO Create functionality for a recent file selection
    $scope.addFolder = function() {
        var folder = {
            name: $scope.newFolder,
            metaName: generateMetaName($scope.newFolder),
            band: $scope.band.name,
            userId: CURRENT_USER.id
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

    $scope.addSong = function() {
        var song = {
            name: $scope.newSong,
            description: $scope.newSongDescription,
            bandId: CURRENT_BAND.id,
            userId: CURRENT_USER.id
        };
        // TODO verify that the right data is there
        $http.post("/php/addSong.php", song)
            .then(
                function (response) {
                    if (response.data === "New record created successfully!") {

                        $scope.songs.push(song);
                        console.log($scope.songs);
                        location.reload(true);
                    } else {
                      console.log("Failed to add song");
                        //$scope.addFolderMessage = "Failed to add folder.";
                    }
                },
                function (response) {
                    console.log(response.data);
                });
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

    // Get Songs for given band
    $scope.getSongs = function(band, callback) {
      var id = band.id;
      if (id === "-1") {
        callback(testSongs);
      } else {
        $http.get("/php/getSongs.php?type=songs&bandId=" + band.id)
            .then(function (response) {
              console.log(response.data);
              CURRENT_SONGS = response.data;
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
      $scope.songs = CURRENT_SONGS;
      var bandUrl = "/#/band?id=" + CURRENT_BAND.id;
      $scope.getRecentActivity();
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
            $scope.getSongs(band, function(songs) {
              CURRENT_SONGS = songs;
              if (CURRENT_SONGS.length == 0) {
                CURRENT_SONGS = [];
              }
            });
            $scope.getFolders(band, function(folders) {
              CURRENT_FOLDERS = folders;
              if (CURRENT_FOLDERS.length == 0) {
                $scope.folderMessage = "Click the green button to Add a Folder!";
                CURRENT_FOLDERS = [];
              }
              $scope.getBandFavoriteFiles(CURRENT_USER.id, id, function(files) {
                  $scope.favoriteFiles = files;
              });
              $scope.getBandHighlightedFiles(CURRENT_USER.id, id, function(files) {
                  $scope.highlightedFiles = files;
              });

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
