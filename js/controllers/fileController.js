app.controller('fileController', ['$scope', '$sce', '$http', '$filter', 'fileUpload',
function($scope, $sce, $http, $filter, fileUpload) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};
  // Files
  $scope.files = [];
  $scope.visibleFiles = [];
  $scope.file = {};
  $scope.fileLinks = [];
  $scope.currentFileIndex = 0;
  $scope.uploadFiles = [];
  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";

  $scope.currentPage = 1;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "10";
  $scope.maxSize = 5;
  $scope.search = "";

  $scope.wavesurfers = [];
  $scope.wavesurferName = "";
  $scope.wavesurferId = "";

  $scope.maxComments = "5";
  $scope.fileIcon = "/img/music.png";

  $scope.user = {};
  $scope.userLikes = [];
  $scope.members = [];

  //TODO Create functionality for a recent file selection

  // globals
var miniAudioPlayer = getElementById("audioPlayer");

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

  $scope.uploadFiles = function() {
    console.log(getElementById("upload").style.display);
    var uploadDisplay = getElementById("upload").style.display;
    if (uploadDisplay == "none" || uploadDisplay == "") {
      displayElementById("upload");
    } else {
      hideElementById("upload");
    }
  };

  $scope.goToLink = function() {
    var source = $scope.file.source;
    if (source != "") {
      openLinkInNewTab($scope.file.source);
    }
  };

  $scope.openFile = function(file) {
    getElementById("audioPlayerAudio").pause();

    console.log("Opening file:");
    console.log(file);
    CURRENT_FILE = file;
    navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName
                + "/" + CURRENT_FILE.metaName);
/*
    $scope.safeApply(function() {
      file.views++;
      if (file.liked) {
        hideElementById("likeButton");
        displayElementInlineById("likedButton");
      }
      $scope.file = file;
    });
    hidePreviousFile();
    document.title = file.name;
    loadFile(file);
    //scrollToElementById("fileSection");
    $http.post("/php/updateFile.php?type=views", file)
    .then(
      function (response) {
        console.log(response.data);
      },
      function (response) {
        console.log(response.data);
      });
      */
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
    openMiniPlayer(file.id, file.name, file.link, 0);
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

  $scope.markMoment = function(event) {
    stopPropogation(event);
    var commentInput = getElementById("commentInput");
    var momentButton = getElementById("momentButton");
    var momentIndicator = getElementById("momentIndicator");
    if (commentInput.style.display === "block") {

      hideElementById("commentInput");
      hideElementById("momentIndicator");
      momentButton.innerHTML = "Mark a Moment";
    } else  {
      momentButton.innerHTML = "Cancel"
      displayElementById("commentInput");
      displayElementById("momentIndicator");
    }
  };

  $scope.comment = function(event) {
    stopPropogation(event);
    var commentInput = getElementById("commentInput");
    var commentButton = getElementById("commentButton");
    if (commentInput.style.display === "block") {

      hideElementById("commentInput");
      commentButton.innerHTML = "Comment";
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

    $http.post("/php/addComment.php?userId=" + user.id + "&bandId=" + band.id + "&fileId=" + file.id, comment)
    .then(
      function (response) {
        console.log(response.data);
        $scope.addComment(comment, user.name);
        hideElementById("commentInput");
        commentButton.innerHTML = "Comment";
        momentButton.innerHTML = "Mark a Moment";
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

  $scope.$watch('currentPage + pageSize', function() {
    var begin = (($scope.currentPage - 1) * $scope.pageSize);
    var end = begin + $scope.pageSize;

    $scope.visibleFiles = $scope.files.slice(begin, end);
    console.log($scope.visibleFolders);
    var elements = document.getElementById("pagination").getElementsByTagName("ul");
    elements[0].classList.add("pagination");
  });

  $scope.showFilters = function() {
    var filters = getElementById("fileFilters");
    console.log(filters.style.display);
    if (filters.style.display === "none") {
        showElementById("fileFilters");
    } else {
        hideElementByIdWithAnimation("fileFilters");
    }

  };


  /*
  $scope.upload = function() {
    alert($scope.uploadFiles.length+" files selected ... Write your Upload Code");
    var files = $scope.uploadFiles;
    var uploadUrl = "../php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName;
    for (var i = 0; i < files.length; i++) {
      fileUpload.uploadFileToUrl(file[0], uploadUrl);
    }

  };
  */
  //Start of Upload Functionality

  form.onsubmit = function(event) {
    performUpload();

  }

    xhr.onload = function () {
        var success;
        if (xhr.status === 200) {
            // File(s) uploaded.
            uploadButton.innerHTML = 'Upload';
        } else {
            alert('An error occurred!');
        }
        if (xhr.status == "200") {
            uploadStatus.innerHTML = "Success!";
            success = true;
        } else {
            uploadStatus.innerHTML = "Failure.";
            success = false;
        }

        uploadResult.innerHTML = xhr.responseText;

        fileStatus.innerHTML = "Loading files";
        if (success) {
            $http.get("/php/files.php?type=getFiles&folderName=" + CURRENT_FOLDER.metaName + "&bandId=" + CURRENT_BAND.id)
                .then(function (response) {
                    console.log(response.data);
                    CURRENT_FILES = response.data;
                    $scope.files = CURRENT_FILES;
                    $scope.visibleFiles = CURRENT_FILES;
                    fileStatus.innerHTML = "Upload Complete";
                    fileSelect.value = "";
                    uploadPercentageBar.style.marginRight = "100%";

                });
        } else {
            fileStatus.innerHTML = "Upload Failed";
            console.log("Failed Upload");
        }
        $scope.$apply()
    };

  function loadFileLinkList() {

    for (var i = 0; i < $scope.files.length; i++) {
      $scope.files[i].fileIndex = i;
      console.log($scope.files[i]);
      $scope.fileLinks[i] = $scope.files[i].link;
    }
  }

  var wavesurfer;

    $scope.playFile = function(song) {
        if (typeof wavesurfer != "undefined") {
            wavesurfer.stop();
            wavesurfer.destroy();
            hideElementById("stop-" + $scope.wavesurferId);
            displayElementById("play-" + $scope.wavesurferId);
        }
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            responsive: true
        });
        $scope.wavesurferName = song.name;
        $scope.wavesurferId = song.id;
        showElementById("filePlayer");
        displayElementById("stop-" + song.id);
        hideElementById("play-" + song.id);
        wavesurfer.load(song.link);
        wavesurfer.on('ready', function () {
            wavesurfer.play();
        });

    };

    $scope.stopFile = function(song) {
        if (typeof wavesurfer != "undefined") {
            wavesurfer.stop();
            wavesurfer.destroy();
            hideElementByIdWithAnimation("filePlayer");
            hideElementById("stop-" + song.id);
            displayElementById("play-" + song.id);
        }

    };

  // Do this if logged in
  if (isLoggedIn()) {

    $scope.band = CURRENT_BAND;
    $scope.user = CURRENT_USER;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    $scope.members = CURRENT_MEMBERS;
    $scope.numberOfFiles = CURRENT_FILES.length;
    document.title = CURRENT_FOLDER.name;

    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName;
    loadFileLinkList();
    $scope.showLikes();
    removeNavLink("folderLink");
    addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);

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

app.service('fileUpload', ['$http', function ($http) {
  console.log("Running fileUpload service");
           this.uploadFileToUrl = function(file, uploadUrl){
              var fd = new FormData();
              fd.append('file', file);

              $http.post(uploadUrl, fd, {
                 transformRequest: angular.identity,
                 headers: {'Content-Type': undefined}
              })

              .success(function(){
                console.log("Success!");
              })

              .error(function(){
                console.log("FAil");
              });
           }
        }]);



app.filter('reverse', function() {
  return function(items) {
    if (!items || !items.length) { return; }
    return items.slice().reverse();
  };
});
