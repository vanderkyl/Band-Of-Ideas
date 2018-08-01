app.controller('ideaController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};
  // Files
  $scope.files = [];
  $scope.file = {};
  $scope.fileLinks = [];
  $scope.currentFileIndex = 0;
  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";

  $scope.currentPage = 0;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "10";
  $scope.search = "";

  $scope.maxComments = "5";
  $scope.maxHighlights = "5";
  $scope.fileIcon = "/img/music.png";
  $scope.currentTime = "";
  $scope.duration = "";

  $scope.user = {};
  $scope.sourceVideoLink = "";

  //TODO Create functionality for a recent file selection

  // globals
var audioPlayer = getElementById("audio");
var miniAudioPlayer = getElementById("audioPlayer");

function playNext() {
  var nextFile = $scope.files[$scope.file.fileIndex+1];
  console.log(nextFile);
    if (nextFile) {
        $scope.openFile(nextFile);
    }
}

function playPrev() {
  var audio = getElementById("audio");
  if (audio.currentTime < 2) {
      var prevFile = $scope.files[$scope.file.fileIndex-1];
      console.log(prevFile);
      if (prevFile) {
          $scope.openFile(prevFile);
      }
  } else {
    audio.currentTime = 0;
  }

}

  audioPlayer.addEventListener("ended", playNext);
  miniAudioPlayer.addEventListener("ended", playNext);

  // Audio buttons
  $scope.play = function() {
    getElementById("audio").play();
    hideElementById("play-btn");
    displayElementInlineById("pause-btn");
  }

  $scope.pause = function() {
    getElementById("audio").pause();
    hideElementById("pause-btn");
    displayElementInlineById("play-btn");
  }

  $scope.rewind = function() {
    var audio = getElementById("audio");
    if (audio.currentTime <= 5) {
      audio.currentTime = 0;
    } else {
        audio.currentTime = audio.currentTime - 5;
    }
  }

  $scope.fastForward = function() {
    var audio = getElementById("audio");
    if (audio.currentTime >= audio.duration - 5) {
        audio.currentTime = audio.duration;
    } else {
        audio.currentTime = audio.currentTime + 5;
    }
  }

  $scope.playNext = function() {
    playNext();
  };

  $scope.playPrev = function() {
    playPrev();
  };

  //Files Section
  $scope.openPrevious = function() {
    var previousUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName;
    navigateToURL(previousUrl);
  };

  $scope.showOptions = function() {
    var optionsDisplay = getElementById("fileOptions").style.display;
    if (optionsDisplay == "none" || optionsDisplay == "") {
      displayElementById("fileOptions");
    } else {
      hideElementById("fileOptions");
    }
  };

  $scope.goToLink = function() {
    var source = $scope.file.source;
    if (source != "") {
      openLinkInNewTab($scope.file.source);
    }
  };



  $scope.openFile = function(file) {
    CURRENT_FILE = file;
    $(".playListFile").removeClass("playListFileSelected");
    $("#file-" + file.id).addClass("playListFileSelected");
    hideElementById("play-btn");
    displayElementInlineById("pause-btn");
    getElementById("audio").pause();
    displayElementById("commentContainer");
    console.log("Opening file:");
    console.log(file);
    file.views++;
    if (file.liked) {
      hideElementById("likeButton");
      displayElementInlineById("likedButton");
    }
    $scope.safeApply(function() {
      $scope.file = file;
    });
    hidePreviousFile();
    document.title = file.name;
    loadFile(file);
    scrollToElementById("ideaSection");
    $http.post("/php/updateFile.php?type=views", file)
    .then(
      function (response) {
        console.log(response.data);
      },
      function (response) {
        console.log(response.data);
      });

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
    $scope.pause();
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

    displayElementInlineById("likedButton");
    hideElementById("likeButton");
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

  $scope.showLikes = async function(file) {
    // Fill out like data if it hasn't been done yet
    if (getElementById("fileDetails-" + file.id).childElementCount === 0) {
      for (var i = 0; i < file.userLikes.length; i++) {
        var result = $scope.band.memberIds.filter(function( user ) {
          return user.id == file.userLikes[i];
        });
        if (result) {
          var user = result[0].email;
          if (result[0].id === CURRENT_USER.id) {
            user = "Me";
          }
          $("#fileDetails-" + file.id).append('<p class="fileData">' + user + ' <img src="/img/black-metal.png"/></p>');
        }
      }
    }

    displayElementById("fileDetails-" + file.id);
    await sleep(3000);
    hideElementById("fileDetails-" + file.id);
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

  $scope.switchToComments = function() {
    showElementById("commentContainer");
    hideElementById("highlights");
    showElementById("comments");
  };

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

  $scope.submitComment = function(file) {
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

  $scope.highlight = function(event) {
      stopPropogation(event);
      var highlightContainer = getElementById("highlightInputContainer");
      var highlightButton = getElementById("highlightButton");
      if (highlightContainer.style.display === "block") {
          hideElementById("highlightInputContainer");
          highlightButton.innerHTML = "+ Highlight";
      } else  {
          highlightButton.innerHTML = "Cancel"
          displayElementById("highlightInputContainer");
      }

  };

  $scope.addHighlight = function(commentText, highlightTime, user) {
    var highlightObject = {comment: commentText,
                         userName: user,
                         commentTime: "Just Now",
                         highlightTime: highlightTime};
    highlightObject.position = ((highlightObject.highlightTime / audio.duration)) * 100;
    $scope.file.highlights.push(highlightObject);
  }

  $scope.submitHighlight = function(file) {
    var highlightSubmitButton = getElementById("highlightSubmitButton");
    highlightSubmitButton.disabled = true;
    var highlight = $scope.currentTime;
    var comment = getElementById("highlightText").value;
    var user = CURRENT_USER;
    var band = CURRENT_BAND;
    var postData = {
      userId: user.id,
      bandId: band.id,
      fileId: file.id,
      highlight: highlight,
      comment: comment
    };

    $http.post("/php/addHighlight.php", postData)
    .then(
      function (response) {
        console.log(response.data);
        $scope.addHighlight(comment, highlight, user.name);
        getElementById("highlightText").value = "";
        highlightSubmitButton.disabled = false;
      },
      function (response) {
        console.log(response.data);
        highlightSubmitButton.disabled = false;
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
    var audio = getElementById("audio");
    audio.currentTime = time;
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

  $scope.download = function(file) {
    // Keeps this from downloading twice.
    $scope.downloadFile(file);
  };

  $scope.downloadFromFile = function() {
    $scope.downloadFile($scope.file);
  };

  $scope.downloadFile = function(file) {
    openLinkInNewTab(file.link);
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
        hideElementById("likeButton");
        displayElementInlineById("likedButton");
      }
    }
  };

  $scope.getHighlightPositions = function() {
      var audio = getElementById("audio");
      var duration = Math.floor(audio.duration);
      for (var i = 0; i < $scope.file.highlights.length; i++) {
          $scope.safeApply(function() {
              $scope.file.highlights[i].position = (($scope.file.highlights[i].highlightTime / audio.duration)) * 100;
              console.log($scope.file.highlights[i].position);
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

  $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
  }

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

  function loadFileLinkList() {
    console.log("Load file Index");
    for (var i = 0; i < $scope.files.length; i++) {
      $scope.files[i].fileIndex = i;
      console.log($scope.files[i]);
      $scope.fileLinks[i] = $scope.files[i].link;
    }
  }




    $scope.goBackToBandPage = function() {
        CURRENT_BAND = $scope.band;
        navigateToURL("/#/band/" + CURRENT_BAND.metaName);
    };

    $scope.goBackToFolderPage = function() {
        CURRENT_FOLDER = $scope.folder;
        navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName);
    };

    // Start of Audio Track Code //



// returns click as decimal (.77) of the total timelineWidth
    function clickPercent(event) {
        var audioTimeline = getElementById("audioTimeline");
        var timelineWidth = window.getComputedStyle(audioTimeline, null).width;
        timelineWidth = timelineWidth.substring(0, timelineWidth.length - 2);
        timelineWidth = parseInt(timelineWidth) ;
        var value = (event.clientX - getPosition(audioTimeline)) / timelineWidth;
        return value;
    }

    function moveplayhead(event) {
        var audioTimeline = getElementById("audioTimeline");
        var newMargLeft = event.clientX - getPosition(audioTrack);
        var timelineWidth = getElementById("audioTimeline").style.width;
        if (newMargLeft >= 0 && newMargLeft < timelineWidth) {
            audioTrack.style.width = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            audioTrack.style.width = "0px";
        }
        if (newMargLeft == timelineWidth) {
            audioTrack.style.width = timelineWidth + "px";
        }

    }
// Returns elements left position relative to top-left of viewport
    function getPosition(el) {
        return el.getBoundingClientRect().left;
    }

// End of Audio Track Code //
    var audioTrack = getElementById("audioFilePercentageBar");
    var audio = getElementById("audio");
    audioTimeline.addEventListener("click", function (event) {
        hideElementById("play-btn");
        displayElementInlineById("pause-btn");
        moveplayhead(event);
        audio.currentTime = audio.duration * clickPercent(event);
    }, false);

    audio.addEventListener("loadstart", function(event) {
        hideElementById("idea");
        displayElementById("ideaLoading");
    }, false);
    audio.addEventListener("durationchange", function (event) {
        $scope.getHighlightPositions();
        displayElementById("idea");
        hideElementById("ideaLoading");
    }, false);
    audio.addEventListener("play", function(event) {
        hideElementById("play-btn");
        displayElementInlineById("pause-btn");
    }, false);
    audio.addEventListener("pause", function (event) {
        hideElementById("pause-btn");
        displayElementInlineById("play-btn");
    }, false);

    var likeButton = getElementById("likeButton");
    var likedButton = getElementById("likedButton");
    likeButton.addEventListener("mouseover", function() {
        var details = $(".likeDetails");
        details.fadeIn(300);
        details.addClass("likeDetailsOpen");

    });
    likeButton.addEventListener("mouseleave", function() {
        var details = $(".likeDetails");
        details.fadeOut(300);
        details.removeClass("likeDetailsOpen")

    });
    likedButton.addEventListener("mouseover", function() {
        var details = $(".likeDetails");
        details.fadeIn(300);
        details.addClass("likeDetailsOpen");

    });
    likedButton.addEventListener("mouseleave", function() {
        var details = $(".likeDetails");
        details.fadeOut(300);
        details.removeClass("likeDetailsOpen")

    });

  // Do this if logged in
  if (isLoggedIn()) {
    $scope.band = CURRENT_BAND;
    $scope.user = CURRENT_USER;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    $scope.file = CURRENT_FILE;
    $scope.numberOfFiles = CURRENT_FILES.length;
    document.title = CURRENT_FOLDER.name + " | " + CURRENT_FILE.name;

    $scope.checkIfFileIsLiked($scope.file);
    var fileUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName + "/" + CURRENT_FILE.metaName;
      $('document').ready(function() {
          $(window).scrollTop(0);
      });
    loadFileLinkList();
    loadFile(CURRENT_FILE);
    if (CURRENT_FILE.source === "") {
      getElementById("sourceVideoButtonText").innerText = "Add Video";
    }
    removeNavLink("fileLink");
    addNavLink("fileLink", CURRENT_FILE.name, fileUrl);

    $scope.sourceVideoLink = $sce.trustAsResourceUrl($scope.file.source);
    console.log($scope.file);

  }
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




app.filter('reverse', function() {
  return function(items) {
    if (!items || !items.length) { return; }
    return items.slice().reverse();
  };
});
