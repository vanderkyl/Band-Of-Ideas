app.controller('ideaController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.playlists = [];
  // Files
  $scope.files = [];
  $scope.visibleFiles = {};
  $scope.file = {};
  $scope.fileLinks = [];
  // Users and Bands
  $scope.band = {};
  $scope.user = {};
  // Pagination
  $scope.currentPage = 1;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "10";
  $scope.maxSize = 5;
  $scope.search = "";

  $scope.maxComments = "5";
  $scope.maxHighlights = "5";
  $scope.fileIcon = "/img/music.png";
  $scope.currentTime = "";
  $scope.duration = "";
  $scope.sourceVideoLink = "";



  //TODO Create functionality for a recent file selection

  // -- BUTTON METHODS -- // ----------------------------------------

  $scope.goBackToBandPage = function() {
    if (wavesurfer.isPlaying()) {
      $scope.openMiniPlayer();
    }
    destroyWave();
    CURRENT_BAND = $scope.band;
    navigateToURL("/#/band?id" + CURRENT_BAND.id);
  };

  $scope.goBackToFolderPage = function() {
    if (wavesurfer.isPlaying()) {
      $scope.openMiniPlayer();
    }
    destroyWave();
    CURRENT_FOLDER = $scope.folder;
    navigateToURL("/#/folder?id=" + CURRENT_FOLDER.id);
  };

  $scope.showIdeaInfo = function() {
    hideElementById("idea");
    displayElementById("ideaInfo");
  };

  $scope.closeIdeaInfo = function() {
    hideElementById("ideaInfo");
    displayElementById("idea");
  };



  // -- END OF BUTTON METHODS -- // ----------------------------------------

  // -- AUDIO PLAYER METHODS -- // ----------------------------------------

  // Audio buttons
  $scope.play = function() {
    playWave();
  };

  $scope.pause = function() {
    pauseWave();
  };

  $scope.rewind = function() {
    rewindWave();
  };

  $scope.fastForward = function() {
    skipWave();
  };

  $scope.playNext = function() {
    playNext();
  };

  $scope.playPrev = function() {
    playPrev();
  };

  function playNext() {
    var nextFile = $scope.files[$scope.file.fileIndex+1];
    console.log(nextFile);
    if (nextFile) {
      $scope.openFileFromList(nextFile);
    }
  }

  function playPrev() {
    var audio = getElementById("audio");
    if (audio.currentTime < 2) {
      var prevFile = $scope.files[$scope.file.fileIndex-1];
      console.log(prevFile);
      if (prevFile) {
        $scope.openFileFromList(prevFile);
      }
    } else {
      audio.currentTime = 0;
    }
  }

  // Open Playlist File
  $scope.openFile = function(file) {
    CURRENT_FILE = file;
    console.log("Opening file:");
    console.log(file);

    navigateToURL("/#/idea?id=" + file.id);

  };

  $scope.openFileFromList = function(file) {
    getElementById("audioPlayerAudio").pause();

    console.log("Opening file:");
    console.log(file);
    CURRENT_FILE = file;
    quitPlayer();

    navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName
        + "/" + CURRENT_FILE.metaName);
    //navigateToURL("/#/idea?id=" + file.id);
  };

  $scope.openMiniPlayer = function() {
    var source = getElementById("m4aSource").src;
    var currentTime = getElementById("audio").currentTime;
    openMiniPlayer($scope.file.id, $scope.file.name, source, currentTime);
    $scope.pause();
  };

  $scope.highlightFileFromList = function() {
    $(".playListFile").removeClass("playListFileSelected");
    $("#file-" + file.id).addClass("playListFileSelected");
  };

  $scope.updateFileViews = function() {
    $scope.file.views++;
    CURRENT_FILE.views++;
    $http.post("/php/updateFile.php?type=views", $scope.file)
        .then(
            function (response) {
              console.log(response.data);
            },
            function (response) {
              console.log(response.data);
            });
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

  $scope.downloadFromFile = function() {
    openLinkInNewTab($scope.file.link);
  };

  // Add like/favorite on file button
  $scope.favoriteFile = function() {
    var index = $scope.file.id;

    displayElementInlineById("likedButton-" + index);
    hideElementById("likeButton-" + index);
    $http.post("/php/updateFile.php?type=likes&user=" + CURRENT_USER.email, $scope.file)
    .then(
      function (response) {
        console.log(response.data);
        $scope.file.likes++;
      },
      function (response) {
        console.log(response.data);
        console.log("Sorry, that didn't work.");
      });
  };

  $scope.addSourceVideo = function() {
    if ($scope.sourceVideoLink !== "") {
      $scope.file.source = $scope.sourceVideoLink;
      $http.post("/php/updateFile.php?type=video", $scope.file)
          .then(
              function (response) {
                console.log(response.data);
                $scope.sourceVideoLink = "";
                getElementById("sourceVideoButtonText").innerText = "Video";
                $("#addVideoModal").modal("hide");
              },
              function (response) {
                console.log(response.data);
              });
    }
  };

  $scope.openSourceVideo = function() {
    console.log($scope.file);
    if ($scope.file.source === "") {
      $("#addVideoModal").modal();
    } else {
      var video = getElementById("sourceVideoDiv");
      if (video.style.display === "none") {
        showElementById("sourceVideoDiv");
        getElementById("sourceVideoButtonText").innerText = "Close Video";
        getElementById("sourceVideo").src = $scope.trustSrc($scope.file.source);
      } else {
        hideElementById("sourceVideoDiv");
        getElementById("sourceVideoButtonText").innerText = "Video";
        getElementById("sourceVideo").src = "";
      }

    }
  };

  // -- END OF AUDIO PLAYER METHODS -- // ----------------------------------------

  // -- COMMENT METHODS -- // ----------------------------------------

  $scope.switchToComments = function() {
    showElementById("commentContainer");
    hideElementById("highlights");
    showElementById("comments");
  };

  $scope.comment = function(event) {
    stopPropogation(event);
    var commentInput = getElementById("commentInput");
    var commentButton = getElementById("commentButton");
    if (commentInput.style.display === "block") {
      hideElementById("commentInput");
      commentButton.innerHTML = "+ Comment";
    } else  {
      commentButton.innerHTML = "Cancel"
      displayElementById("commentInput");
    }

  };

  $scope.addComment = function(commentText, user) {
    var commentObject = {comment: commentText,
      userName: user,
      commentTime: "Just Now"};
    $scope.file.comments.push(commentObject);
  }

  $scope.submitComment2 = function(file) {
    var comment = getElementById("commentText").value;
    var user = CURRENT_USER;
    var band = CURRENT_BAND;
    var postData = {
      userId: user.id,
      bandId: band.id,
      fileId: file.id,
      comment: comment
    }

    $http.post("/php/addComment.php", postData)
        .then(
            function (response) {
              console.log(response.data);
              $scope.addComment(comment, user.name);
              hideElementById("commentInput");
              commentButton.innerHTML = "+ Comment";
              getElementById("commentText").value = "";
            },
            function (response) {
              console.log(response.data);
            });
  };

  $scope.showAllComments = function() {
    $scope.maxComments = $scope.file.comments.length;
    hideElementById("showCommentsButton");
    displayElementById("hideCommentsButton");
  };

  $scope.hideComments = function() {
    $scope.maxComments = 5;
    hideElementById("hideCommentsButton");
    displayElementById("showCommentsButton");
  };

  // -- END OF COMMENT METHODS -- // ----------------------------------------

  // -- HIGHLIGHT METHODS -- // ----------------------------------------

  $scope.switchToHighlights = function() {
    showElementById("commentContainer");
    hideElementById("comments");
    showElementById("highlights");
    var currentTime = getElementById("audio").currentTime;
    $scope.currentTime = currentTime;

  };

  $scope.highlightMoment = function(event) {
    stopPropogation(event);
    var currentTime = getElementById("audio").currentTime;
    $scope.currentTime = currentTime;
  };

  $scope.currentTimeToString = function(currentTime) {
    return timeToString(parseInt(currentTime));
  };



  $scope.highlight = function() {
      var highlightButton = getElementById("highlightButton");
      var highlightContainer = getElementById("highlighter");
      if (highlightContainer.style.display !== "block") {
          //var currentTime = getElementById("audio").currentTime;
          $scope.currentTime = getCurrentWaveTime();
          setRegionStart($scope.currentTime);
          setRegionEnd($scope.currentTime + 10);
          createNewRegion();
          highlightButton.innerHTML = "x";
          displayElementById("highlighter");
      } else {
          highlightButton.innerHTML = "<i class='far fa-bookmark'></i>";
          closeHighlighter();
      }

  };

  $scope.addHighlight = function(commentText, highlightTime, endTime, user) {
    if (highlightTime !== -1) {
      var highlightObject = {comment: commentText,
        userName: user,
        commentTime: "Just Now",
        highlightTime: highlightTime,
        endTime: endTime};
      //highlightObject.position = ((highlightObject.highlightTime / audio.duration)) * 100;
      $scope.file.highlights.push(highlightObject);
      selectedRegion.data.isNew = false;
    }

  }

  $scope.submitComment = function(file) {
    var highlight = 0;
    var endTime = 0;
    if (selectedRegion !== undefined || getElementById("highlighter").style.display != "none") {

      if (selectedRegion.data.isNew) {
        highlight = getRegionStartValue();
        endTime = getRegionEndValue();
      }
    }
    var comment = getRegionCommentValue();
    var user = CURRENT_USER;
    var band = CURRENT_BAND;
    var postData = {
      userId: user.id,
      bandId: band.id,
      fileId: file.id,
      highlight: highlight,
      endTime: endTime,
      comment: comment
    };

    $http.post("/php/addHighlight.php", postData)
        .then(
            function (response) {
              console.log(response.data);
              $scope.addHighlight(comment, highlight, endTime, user.name);
              closeHighlighter();
              //$scope.highlight();

            },
            function (response) {
              console.log(response.data);
              alert("Something went wrong");
            });


  };

  $scope.showAllHighlights = function() {
    $scope.maxHighlights = $scope.file.highlights.length;
    hideElementById("showHighlightsButton");
    displayElementById("hideHighlightsButton");
  };

  $scope.hideHighlights = function() {
    $scope.maxHighlights = 5;
    hideElementById("hideHighlightsButton");
    displayElementById("showHighlightsButton");
  };

  $scope.playHighlight = function(event, time) {
    stopPropogation(event);
    if (time !== "") {
      playWave(parseInt(time));
    }

  };

  $scope.playNewHighlight = function() {
    var audio = getElementById("audio");
    audio.currentTime = $scope.currentTime;
  };

  $scope.rewindHighlight = function() {
    console.log($scope.currentTime);
    $scope.currentTime = $scope.currentTime - 1;
    console.log($scope.currentTime);
  };

  $scope.fastForwardHighlight = function() {
    console.log($scope.currentTime);
    $scope.currentTime = $scope.currentTime + 1;
    console.log($scope.currentTime);
  };

  $scope.getHighlightPositions = function() {
    var audio = getElementById("audio");
    var duration = Math.floor(audio.duration);
    for (var i = 0; i < $scope.file.highlights.length; i++) {
      $scope.safeApply(function() {
        $scope.file.highlights[i].position = (($scope.file.highlights[i].highlightTime / audio.duration)) * 100;
      });
    }
  };

  // -- END OF HIGHLIGHTS METHODS -- // ----------------------------------------

  // -- PLAYLIST METHODS -- // ----------------------------------------

  $scope.openAddToPlaylistModal = async function() {
    $("#addToPlaylistModal").modal('show');
    $scope.getFilePlaylists();
    $scope.getPlaylists(async function () {
      await sleep(10);
      var playlists = $scope.playlists;
      var filePlaylists = $scope.file.playlists;
      for (var i = 0; i < playlists.length; i++) {
        for (var j = 0; j < filePlaylists.length; j++) {
          if (playlists[i].id === filePlaylists[j].id) {
            console.log("playlistAddButton-" + playlists[i].id);
            hideElementById("playlistAddButton-" + playlists[i].id);
            displayElementById("playlistAdded-" + playlists[i].id);
            j = filePlaylists.length;
          }
        }
      }
    });
  };

  $scope.getPlaylists = function(callback) {
    $http.get("/php/getPlaylists.php?userId=" + CURRENT_USER.id)
        .then(function (response) {
          CURRENT_PLAYLISTS = response.data;
          $scope.playlists = response.data;
          callback();
        });
  };

  $scope.addToPlaylist = function(playlist) {
    var data = {
      playlistId: playlist.id,
      fileId: $scope.file.id
    }
    $http.post("/php/addToPlaylist.php", data)
        .then(function (response) {
              console.log(response.data);
              hideElementById("playlistAddButton-" + playlist.id);
              displayElementById("playlistAdded-" + playlist.id);
            },
            function (response) {
              console.log(response.data);
            });
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

  $scope.getFilePlaylists = function() {
    $http.get("/php/getPlaylists.php?userId=" + $scope.user.id + "&fileId=" + $scope.file.id)
        .then(function (response) {
          $scope.file.playlists = response.data;

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
        closeModal("addToPlaylistModal");
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

  // -- END OF PLAYLIST METHODS -- // ----------------------------------------

  // -- PAGINATION METHODS -- // ----------------------------------------

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
      CURRENT_FILES[i].size = calculateFileSize(CURRENT_FILES[i].size);
    }
  };

  // -- END OF PAGINATION METHODS -- // ----------------------------------------

  // -- HELPER METHODS -- // ----------------------------------------

  $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
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

  function loadFileLinkList() {
    console.log("Load file Index");
    for (var i = 0; i < $scope.files.length; i++) {
      $scope.files[i].fileIndex = i;
      $scope.fileLinks[i] = $scope.files[i].link;
    }
  }

  $scope.checkIfFileIsLiked = async function(file) {
    //TODO figure out better way to do this.
    await sleep(10);
    file.liked = false;
    var userId = CURRENT_USER.id;
    var index = file.id;
    var userLikes = file.userLikes;
    for (var i = 0; i < userLikes.length; i++) {
      console.log(userLikes[i]);
      if (userId === userLikes[i].id) {
        file.liked = true;
        hideElementById("likeButton-" + index);
        displayElementInlineById("likedButton-" + index);
      }
    }
    if (file.liked === false) {
      hideElementById("likedButton-" + index);
      displayElementInlineById("likeButton-" + index);
    }
  };

  // -- END OF HELPER METHODS -- // ----------------------------------------

  $scope.loadFileById = function(id, callback) {
    $http.get("/php/getFiles.php?type=singleFile&fileId=" + id)
        .then(function (response) {

          hideResult("livesearch");
          hideResult("largeLivesearch");
          CURRENT_FILES = response.data.folderFiles;
          CURRENT_FILE = response.data.file;
          CURRENT_FOLDER = response.data.folder;
          CURRENT_BAND = response.data.band;
          callback();
        });
  };

  $scope.loadFile = function(time) {
    quitPlayer();
    $scope.band = CURRENT_BAND;
    $scope.user = CURRENT_USER;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    $scope.file = CURRENT_FILE;
    $scope.numberOfFiles = CURRENT_FILES.length;
    updateTitle(CURRENT_FOLDER.name + " | " + CURRENT_FILE.name);
    loadFileWaveSurfer(time, function () {
      loadWaveSurferEvents();
      $scope.updateFileViews();
    });

    $scope.checkIfFileIsLiked($scope.file);

    scrollToTop();
    loadFileLinkList();

    $scope.loadUIObjects();

    $scope.sourceVideoLink = $sce.trustAsResourceUrl($scope.file.source);
    console.log($scope.file);
  };

  $scope.loadUIObjects = function() {
    $("#file-" + CURRENT_FILE.id).addClass("playListFileSelected");
    var fileUrl = "/#/idea?id=" + CURRENT_FILE.id;
    removeNavLink("fileLink");
    addNavLink("fileLink", CURRENT_FILE.name, fileUrl);
    displayElementById("ideaView");
    finishControllerSetup();
  };

  $scope.loadController = function() {
    setupController();
    // Do this if logged in
    if (isLoggedIn()) {
      var id = getParameterByName("id");
      var time = getParameterByName("time");
      console.log(id);
      if (id) {
        $scope.loadFileById(id, function() {
          if (time) {
            $scope.loadFile(time);
          } else {
            $scope.loadFile(0);
          }
        });
      } else {
        if (time) {
          $scope.loadFile(time);
        } else {
          $scope.loadFile(0);
        }
      }
    }
  };

  // -- CONTROLLER STARTUP METHOD CALL -- // ----------------------------------------
  $scope.loadController();
}]);

