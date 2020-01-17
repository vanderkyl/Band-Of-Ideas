app.controller('playlistController', ['$scope', '$sce', '$http', '$filter',
    function($scope, $sce, $http, $filter) {
        // Folders
        $scope.band = {};
        $scope.playlists = [];
        $scope.playlist = {};
        $scope.playlistName = "";
        // Files
        $scope.files = [];
        $scope.fileLinks = [];
        $scope.currentFileIndex = 0;
        $scope.uploadFiles = [];

        $scope.numberOfFiles = 0;
        $scope.search = "";

        $scope.user = {};
        $scope.userLikes = [];
        $scope.members = [];


        $scope.goToLink = function() {
            var source = $scope.file.source;
            if (source != "") {
                openLinkInNewTab($scope.file.source);
            }
        };

        $scope.openFolder = function(song, event) {
            stopPropogation(event);
            var folderUrl = "/#/band/" + song.folder.metaName + "/";
            var folderName = song.folder.name;
            var folderMetaName = song.folder.metaName;
            $scope.getFiles(folderMetaName, song.bandId, song.folder, function(success) {
                song.folder.name = folderName;
                if (success) {
                    folderUrl += CURRENT_FOLDER.metaName;
                    navigateToURL(folderUrl);
                } else {
                    console.log("Getting files failed.");
                }
            });

        };

        $scope.openFile = function(file) {
            getElementById("audioPlayerAudio").pause();

            console.log("Opening file:");
            console.log(file);
            CURRENT_FILE = file;
            navigateToURL("/#/idea?id=" + file.id);

        };


        $scope.openMiniPlayer = function() {
            var source = getElementById("m4aSource").src;
            var currentTime = getElementById("audio").currentTime;
            openMiniPlayer($scope.file.id, $scope.file.name, source, currentTime);
        };

        $scope.openMiniAudioPlayer = function(file) {
            openMiniPlayer(file.id, file.name, file.link, 0);
        };


        $scope.showLikes = function() {
            // Fill out like data if it hasn't been done yet
            for (var j = 0; i < $scope.files.length; i++) {
                for (var i = 0; i < $scope.files[j].userLikes.length; i++) {
                    var result = $scope.members.filter(function( user ) {
                        return user.id == file.userLikes[i];
                    });
                    if (result) {
                        var user = result[0].name;
                        if (result[0].id === CURRENT_USER.id) {
                            user = "Me";
                        }
                        document.getElementById("playListFileDetails-" + $scope.files[j].id).innerText += user;
                    }
                }
            }




        };

        $scope.showLikesOnFile = async function(file) {
            // Fill out like data if it hasn't been done yet
            if (getElementById("openFileDetails").childElementCount === 0) {
                for (var i = 0; i < file.userLikes.length; i++) {
                    var result = $scope.band.memberIds.filter(function( user ) {
                        return user.id == file.userLikes[i];
                    });
                    if (result) {
                        var user = result[0].email;
                        if (result[0].id === CURRENT_USER.id) {
                            user = "Me";
                        }
                        $("#openFileDetails").append('<p class="fileData">' + user + ' <img src="/img/black-metal.png"/></p>');
                    }
                }
            }

            displayElementById("openFileDetails");
            await sleep(3000);
            hideElementById("openFileDetails");
        };

        $scope.showFilter = function() {
            var filterDisplay = getElementById("filesFilter").style.display;
            if (filterDisplay == "none" || filterDisplay == "") {
                displayElementById("filesFilter");
            } else {
                hideElementById("filesFilter");
            }
        };

        $scope.getData = function () {
            // needed for the pagination calc
            // https://docs.angularjs.org/api/ng/filter/filter
            return $filter('filter')($scope.files, $scope.search);
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

        $scope.formatFileData = function() {
            for (var i = 0; i < CURRENT_FILES.length; i++) {
                CURRENT_FILES[i].name = getFriendlyTitle(CURRENT_FILES[i]);
                CURRENT_FILES[i].size = calculateFileSize(CURRENT_FILES.size);
            }
        };

        $scope.checkIfFilesAreLiked = async function(file) {
            //TODO figure out better way to do this.
            await sleep(10);
            console.log("Checking files");
            file.liked = false;
            var userId = CURRENT_USER.id;
            var index = file.id;
            var userLikes = file.userLikes;
            for (var i = 0; i < userLikes.length; i++) {
                console.log(userLikes[i]);
                if (userId === userLikes[i]) {
                    file.liked = true;
                    hideElementById("likeButton-" + index);
                    displayElementInlineById("likedButton-" + index);
                }
            }
        };



        $scope.goBackToBandPage = function() {
            CURRENT_BAND = $scope.band;
            navigateToURL("/#/band/" + CURRENT_BAND.metaName);
        };

        $scope.goBackToFolderPage = function() {
            CURRENT_FOLDER = $scope.folder;
            navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName);
        };

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

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

        $scope.showFilters = function() {
            var filters = getElementById("fileFilters");
            console.log(filters.style.display);
            if (filters.style.display === "none") {
                showElementById("fileFilters");
            } else {
                hideElementByIdWithAnimation("fileFilters");
            }

        };

        $scope.getPlaylists = function(callback) {
            $http.get("/php/getPlaylists.php?userId=" + CURRENT_USER.id)
                .then(function (response) {
                  CURRENT_PLAYLISTS = response.data;
                  callback(response.data);
                });
        };

      $scope.openPlaylist = function(playlist) {
        $scope.getPlaylistFiles(playlist, function(files) {
          if (files) {
            $scope.files = files;
            CURRENT_PLAYLIST = {
                id: playlist.id,
                name: playlist.name,
                metaName: generateMetaName(playlist.name),
                userId: playlist.userId,
                bandId: playlist.bandId,
                public: playlist.public,
                files: $scope.files
            };
            $scope.playlist = CURRENT_PLAYLIST;
            $scope.addPlaylistNavLink();
            displayElementById("files");
          } else {
            console.log("Getting files failed.");
          }
        });
      };

      $scope.addPlaylist = function() {
        if ($scope.playlistName != "") {
          var playlist = {
            name: $scope.playlistName,
            metaName: generateMetaName($scope.playlistName),
            bandId: 0,
            userId: CURRENT_USER.id,
            public: true
          };
          //showPlaylistLoader();
          $http.post("/php/addPlaylist.php", playlist)
              .then(function (response) {
                    console.log(response.data);
                    $scope.getPlaylists(function(playlists) {
                      $scope.playlists = playlists;
                    });
                    //hidePlaylistLoader();
                  },
                  function (response) {
                    console.log(response.data);
                    //hidePlaylistLoader();
                  });

        } else {
          console.log("No Playlist");
        }

      };

      $scope.getPlaylist = function(playlistId, callback) {
        $http.get("/php/getPlaylists.php?id=" + playlistId)
            .then(function (response) {
              CURRENT_PLAYLIST = response.data;
              callback(response.data);
            });
      };

      // Http request to get favorited files
      $scope.getPlaylistFiles = function(playlist, callback) {

        $http.get("/php/getFiles.php?type=playlist&playlistId=" + playlist.id)
            .then(function (response) {
              CURRENT_PLAYLIST = {
                id: playlist.id,
                name: playlist.name,
                metaName: playlist.metaName,
                public: playlist.public,
                bandId: playlist.bandId,
                userId: playlist.userId,
                files: response.data
              };
              callback(response.data);
            });
      };

        // Http request to get favorited files
      $scope.getFavoriteFiles = function(userId, callback) {
          $http.get("/php/getFiles.php?type=allFavorites&userId=" + userId)
              .then(function (response) {
                CURRENT_PLAYLIST = {
                  id: "allFavorites",
                  name: "All Favorited Ideas",
                  metaName: "all-favorites",
                  files: response.data
                };
                callback(response.data);
          });
      };

      $scope.getBandFavoriteFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=allFavorites&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
              CURRENT_PLAYLIST = {
                id: "bandFavorites",
                name: "Favorited Ideas",
                metaName: "band-favorites",
                files: response.data
              };
              callback(response.data);
            });
      };

      $scope.openFavoritesPlaylist = function() {
        displayElementById("files");
        navigateToURL("/#/playlist?id=allFavorites");
      };

      $scope.getHighlightedFiles = function(userId, callback) {
        $http.get("/php/getFiles.php?type=allHighlights&userId=" + userId)
            .then(function (response) {
              CURRENT_PLAYLIST = {
                id: "allHighlights",
                name: "All Highlighted Ideas",
                metaName: "all-highlights",
                files: response.data
              };
              callback(response.data);
            });
      };

      $scope.getBandHighlightedFiles = function(userId, bandId, callback) {
        $http.get("/php/getFiles.php?type=allHighlights&userId=" + userId + "&bandId=" + bandId)
            .then(function (response) {
              CURRENT_PLAYLIST = {
                id: "bandHighlights",
                name: "Highlighted Ideas",
                metaName: "band-highlights",
                files: response.data
              };
              callback(response.data);
            });
      };

      $scope.openHighlightsPlaylist = function() {
        displayElementById("files");
        navigateToURL("/#/playlist?id=allHighlights");
      };

        $scope.loadUIObjects = function() {
          $scope.band = CURRENT_BAND;
          $scope.user = CURRENT_USER;

          $scope.files = CURRENT_PLAYLIST.files;
          $scope.numberOfFiles = CURRENT_PLAYLIST.files.length;
          $scope.playlist = CURRENT_PLAYLIST;
          $scope.playlists = CURRENT_PLAYLISTS;
          document.title = CURRENT_FOLDER.name;
          $scope.showLikes();
          displayElementById("playlistsView");
          finishControllerSetup();
        };

        $scope.loadPlaylists = function() {
          $scope.getPlaylists(function(playlists) {
            displayElementById("files");
            $scope.addPlaylistNavLink();
            $scope.loadUIObjects();
          });
        };

        $scope.addPlaylistNavLink = function() {
          var playlistUrl = "/#/playlists?id=" + CURRENT_PLAYLIST.id;
          removeNavLink("playlistLink");
          addNavLink("playlistLink", CURRENT_PLAYLIST.name, playlistUrl);
        };

        $scope.loadController = function() {
            setupController();
            // Do this if logged in
            if (isLoggedIn()) {
                updateTitle("Playlists");
                var id = getParameterByName("id");
                if (id) {
                    if (id === "allFavorites") {
                        $scope.getFavoriteFiles(CURRENT_USER.id, function(files) {
                          $scope.loadPlaylists();
                        });
                    } else if (id === "allHighlights") {
                        $scope.getHighlightedFiles(CURRENT_USER.id, function(files) {
                            $scope.loadPlaylists();
                        });
                    } else if (id === "bandFavorites") {
                      $scope.getBandFavoriteFiles(CURRENT_USER.id, CURRENT_BAND.id, function(files) {
                        $scope.loadPlaylists();
                      });
                    } else if (id === "bandHighlights") {
                      $scope.getBandHighlightedFiles(CURRENT_USER.id, CURRENT_BAND.id, function(files) {
                        $scope.loadPlaylists();
                      });
                    } else {
                        $scope.getPlaylist(id, function(playlist) {
                          $scope.getPlaylistFiles(playlist, function(files) {
                            $scope.loadPlaylists();
                          });
                        });

                    }

                } else {
                  $scope.getPlaylists(function(playlists) {
                      if (objectIsEmpty(CURRENT_PLAYLIST)) {
                        CURRENT_PLAYLIST = {
                          files: []
                        };
                      } else {
                        $scope.addPlaylistNavLink();
                      }
                    $scope.loadUIObjects();
                  });
                }
            }

        }

        $scope.loadController();
    }
]);

