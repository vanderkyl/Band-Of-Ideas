app.controller('songController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Song and Band
  $scope.song = {};
  $scope.band = {};
  // Files
  $scope.files = [];
  $scope.visibleFiles = [];
  $scope.file = {};
  $scope.fileLinks = [];
  $scope.currentSelectedFileId = -1;
  $scope.recentComments = [];

  $scope.currentPage = 1;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "10";
  $scope.maxSize = 5;
  $scope.search = "";

  $scope.maxComments = "5";
  $scope.fileIcon = "/img/music.png";

  $scope.user = {};
  $scope.userLikes = [];
  $scope.members = [];
  $scope.arrangement = [];
  $scope.newArrangement = {};
  $scope.editArrangement = {};
  $scope.currentArrangement = {};
  $scope.arrangementIndex = 1;

  //TODO Create functionality for a recent file selection

  // globals
var miniAudioPlayer = getElementById("audioPlayer");
var currentSelectedFile = {};

function playNext() {
  console.log("Play next");
  console.log($scope.file);
  console.log($scope.file.fileIndex);
  var nextFile = $scope.files[$scope.file.fileIndex+1];
  console.log(nextFile);
    if (nextFile) {
        $scope.openFile(nextFile);
    }
}

  miniAudioPlayer.addEventListener("ended", playNext);

  //Files Section
  $scope.openPreviousFolder = function() {
    var previousUrl = "/#/band/" + CURRENT_BAND.metaName;
    navigateToURL(previousUrl);
  };

  $scope.goToLink = function() {
    var source = $scope.file.source;
    if (source != "") {
      openLinkInNewTab($scope.file.source);
    }
  };

  $scope.goToSongFiles = function() {
    scrollToElementById("fileList");
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

  $scope.showFolderDetails = function() {
    var detailsDisplay = getElementById("folderDetails").style.display;
    if (detailsDisplay === "none" || detailsDisplay === "") {
      displayElementById("folderDetails");
    } else {
      hideElementById("folderDetails");
    }
  };

  $scope.deleteFile = function() {
    var prompt = confirm("Are you sure you want to delete this file?");
    //deleteFile($scope.file.id);
  };

  // Add like on file when opened
  $scope.plusOneOnFile = function() {
    $scope.plusOne($scope.file);
  };

  // Add like on file button
  $scope.plusOne = function(file) {
    // Keeps this from adding twice
    var index = file.id;

    displayElementInlineById("likedButton-" + index);
    hideElementById("likeButton-" + index);
    console.log(CURRENT_USER);
    $http.post("/php/updateFile.php?type=likes&user=" + CURRENT_USER.email, file)
    .then(
      function (response) {
        console.log(response.data);
        file.likes++;
        console.log(file.likes);
      },
      function (response) {
        console.log(response.data);
        console.log("Sorry, that didn't work.");
      });
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

  $scope.reloadIdeas = function() {
    if (addedIdeas > 0) {
      location.reload(true);
    }
  };

  // Add like/favorite on file button
  $scope.favoriteFile = function(file) {
    var index = $scope.file.id;

    displayElementInlineById("likedButton-" + index);
    hideElementById("likeButton-" + index);
    $http.post("/php/updateFile.php?type=likes&user=" + CURRENT_USER.email, file)
        .then(
            function (response) {
              console.log(response.data);
              file.likes++;
            },
            function (response) {
              console.log(response.data);
              console.log("Sorry, that didn't work.");
            });
  };


  $scope.goBackToBandPage = function() {
    CURRENT_BAND = $scope.band;
    navigateToURL("/#/band?=" + CURRENT_BAND.id);
  };

  $scope.goBackToFolderPage = function() {
      CURRENT_FOLDER = $scope.folder;
      navigateToURL("/#/folder?=" + CURRENT_FOLDER.id);
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

  function loadFileList() {
    for (var i = 0; i < $scope.files.length; i++) {
      $scope.files[i].fileIndex = i;
      console.log($scope.files[i]);
      $scope.fileLinks[i] = $scope.files[i].link;
      $scope.files[i].durationTime = timeToString($scope.files[i].duration);
      var userLikes = $scope.files[i].userLikes;
      for (var j = 0; j < userLikes.length; j++) {
        if (userLikes[j].id === CURRENT_USER.id) {
          $scope.likedFiles++;
        }
      }
    }
    console.log($scope.files);
  }

  $scope.openFileActions = function(file, event) {
    event.stopPropagation();
    hideElementById("fileActionsOpen-" + file.id);
    displayElementById("fileActionsClose-" + file.id);
    getElementById("fileActions-" + file.id).style.height = "100%";
    getElementById("fileActions-" + file.id).style.borderTop = "solid 1px #d6d6d6";
    getElementById("fileActions-" + file.id).style.padding = "10px";
    displayElementById("actionsDiv-" + file.id);
  };

  $scope.closeFileActions = function(file, event) {
    event.stopPropagation();
    hideElementById("fileActionsClose-" + file.id);
    displayElementById("fileActionsOpen-" + file.id);
    getElementById("fileActions-" + file.id).style.height = "0";
    getElementById("fileActions-" + file.id).style.border = "none";
    getElementById("fileActions-" + file.id).style.padding = "0";
    hideElementById("actionsDiv-" + file.id);
  };

  $scope.openUploadModal = function() {
    setupUploadModal(function() {
      $("#UploadBands").val($scope.band.name);
      setupFoldersDropdown(function() {
        $("#UploadFolders").val($scope.folder.name);
        setupFilePond();
        displayElementById("filepondDiv");
      });
    });
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

  $scope.getSong = function(id, callback) {
    // Open Test Files
    if (id === "-1") {
      CURRENT_SONG = testSongs;
      callback(CURRENT_SONG);
    } else {
      $http.get("/php/getSongs.php?type=song&id=" + id)
          .then(function (response) {
            console.log(response.data);
            CURRENT_SONG = response.data;
            CURRENT_SONG.lyrics = CURRENT_SONG.lyrics.trim();
            $scope.song = response.data;

            $scope.getBand(CURRENT_SONG.bandId, function(band) {
              console.log(band);
              callback(response.data);
            })
          });
    }
  };

  $scope.getBand = function(id, callback) {
    // Open Test Files
    if (id === "-1") {
      CURRENT_BAND = testBand;
      callback(CURRENT_BAND);
    } else {
      $http.get("/php/getBand.php?id=" + id)
          .then(function (response) {
            console.log(response.data);
            CURRENT_BAND = response.data;
            callback(response.data);
          });
    }
  };

  $scope.getSongFiles = function(songId, callback) {
    if (songId === "-1") {
      CURRENT_FILES = testFiles;
      callback(CURRENT_FILES);
    } else {
      $http.get("/php/getFiles.php?type=songFiles&songId=" + songId)
          .then(function (response) {
            console.log(response.data);
            CURRENT_FILES = response.data;
            callback(response.data);
          });
    }
  };

  $scope.openSongFileModal = async function() {
    showIdeaResult($scope.song.name, 'idea-live-search', $scope.files);
    $("#addSongFileModal").modal('show');
  };

  $scope.addToSong2 = function(idea) {
    console.log("Add Song");
    var data = {
      songId: $scope.song.id,
      fileId: idea.id,
      bandId: CURRENT_BAND.id,
      userId: CURRENT_USER.id
    }
    $http.post("/php/addToSong.php", data)
        .then(function (response) {
              console.log(response.data);

            },
            function (response) {
              console.log(response.data);
            });
  };

  $scope.openIdea = function(idea) {
    console.log("Opening idea: " + idea.id);
    navigateToURL("/#/idea?id=" + idea.id);
  };

  $scope.editLyrics = function() {
    displayElementById("songLyricsInputContainer");
    hideElementById("songLyricsTextContainer");
  };

  $scope.closeEditLyrics = function() {
    displayElementById("songLyricsTextContainer");
    hideElementById("songLyricsInputContainer");
  };

  $scope.saveLyrics = function() {
    var newLyrics = $scope.song.lyrics;
    var song = $scope.song;
    song.lyrics = JSON.stringify(newLyrics);
    $http.post("/php/updateSong.php?type=lyrics", song)
    .then(
      function (response) {
        console.log(response.data);
        $scope.song.lyrics = song.lyrics;
        getElementById("songLyricsInput").value = newLyrics;
        getElementById("songLyricsText").innerHTML = newLyrics;
        $scope.closeEditLyrics();
      },
      function (response) {
        console.log(response.data);
        console.log("Sorry, that didn't work.");
      });
  }

  $scope.addArrangement = function() {
    displayElementById("editArrangement");
    hideElementById("addArrangementButton");
    displayElementInlineById("closeAddArrangementButton");
  };

  $scope.editArrangement = function() {
    displayElementById("editArrangement");
    hideElementById("arrangement");
    displayElementInlineById("closeEditArrangementButton");
  };

  $scope.closeEditArrangement = function() {
    displayElementById("arrangement");
    hideElementById("editArrangement");
    hideElementById("closeEditArrangementButton");
  };

  $scope.closeAddArrangement = function() {
    displayElementById("addArrangementButton");
    hideElementById("editArrangement");
    hideElementById("closeAddArrangementButton");
  };

  $scope.saveArrangement = function() {
    console.log(CURRENT_USER);
    CURRENT_SONG.arrangement = $scope.arrangement;
    $http.post("/php/updateSong.php?type=arrangement", CURRENT_SONG)
    .then(
      function (response) {
        console.log(response.data);
        $scope.arrangementIndex++;
      },
      function (response) {
        console.log(response.data);
        console.log("Sorry, that didn't work.");
      });
  };

  $scope.addArrangementBlock = function() {
    displayElementInlineById("addArrangementPartBlock");
    hideElementById("addArrangementBlock");
  };

  $scope.editArrangementBlock = function(part) {
    displayElementInlineById("editBlockInput" + part.id);
    hideElementById("editBlockContents" + part.id);

  };

  $scope.saveArrangementPart = function() {
    $scope.newArrangement.userId = CURRENT_USER.id;
    $scope.newArrangement.songId = CURRENT_SONG.id;
    $scope.newArrangement.id = $scope.arrangementIndex;
    $scope.currentArrangement = $scope.newArrangement;
    var newPart = $scope.newArrangement;
    $scope.arrangement.push(newPart);
    $scope.closeAddPart();
    getElementById("addPartNameInput").value = "";
    console.log("Arrangement part successfully added");
    console.log(newPart);
    $scope.newArrangement = {};
  };

  $scope.closeAddPart = function() {
    displayElementInlineById("addArrangementBlock");
    hideElementById("addArrangementPartBlock");
  };

  // Http request to get song ideas
  $scope.getSongFiles = function(songId, callback) {
    $http.get("/php/getFiles.php?type=songFiles&songId=" + songId)
        .then(function (response) {
          console.log(response.data);
          CURRENT_FILES = response.data;
          $scope.files = CURRENT_FILES;
          callback(response.data);
        });
  };

    $scope.loadUIObjects = function() {
      $scope.band = CURRENT_BAND;
      $scope.user = CURRENT_USER;
      $scope.files = CURRENT_FILES;
      $scope.folder = CURRENT_FOLDER;
      $scope.song = CURRENT_SONG;
      $scope.members = CURRENT_MEMBERS;
      $scope.numberOfFiles = CURRENT_FILES.length;
      loadFileList();
      if (CURRENT_FILE.id !== undefined) {
        if (CURRENT_FILE.id === id) {
          showPlayerButtonById(id);
        }
      }

      displayElementById("songView");
      var songUrl = "/#/song?id=" + CURRENT_SONG.id;
      removeNavLink("songLink");
      addNavLink("songLink", CURRENT_SONG.name, songUrl);
      finishControllerSetup();
    };

    $scope.loadController = function() {
      setupController();
      // Do this if logged in
      if (isLoggedIn()) {
        var id = getParameterByName("id");
        console.log(id);
        if (id) {
          $scope.getSong(id, function(song) {
            addedIdeas = 0;
            CURRENT_SONG = song;
            if (!$scope.arrangement.length) {
              displayElementById("addArrangementButton");
              hideElementById("arrangement");
              hideElementById("editArrangement")
            }
            var lyrics = getElementById("songLyricsText");
            getElementById("songLyricsText").innerText = lyrics.innerText.trim();
            $scope.getSongFiles(song.id, function(files) {
              CURRENT_FILES = files;
              updateTitle(CURRENT_SONG.name);
              //$scope.showLikes();
              $scope.loadUIObjects();
            });
          });
        } else {
          navigateToURL("/#/dashboard");
        }

      }
    };

    $scope.loadController();

}]);

app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                  console.log(item);
                    var value = {
                       // File Name
                        name: item.name,
                        //File Size
                        size: item.size,
                        // File Input Value
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
