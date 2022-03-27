app.controller('activityController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {

  $scope.band = {};
  $scope.bands = [];
  $scope.recentComments = [];

  $scope.currentPage = 1;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "10";
  $scope.maxSize = 5;
  $scope.search = "";

  $scope.recentHighlights = [];
  $scope.recentNotifications = [];
  $scope.allNotifications = [];
  $scope.notifications = [];
  $scope.uploads = [];
  $scope.folders = [];
  $scope.recentUploads = [];
  $scope.recentFolders = [];
  $scope.numberOfNotifications = 0;

  $scope.goToLink = function() {
    var source = $scope.file.source;
    if (source != "") {
      openLinkInNewTab($scope.file.source);
    }
  };

  /*


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

  $scope.getFolder = function(id, callback) {
    // Open Test Files
    if (id === "-1") {
      CURRENT_FOLDER = testFolder;
      callback(CURRENT_FOLDER);
    } else {
      $http.get("/php/getFolders.php?id=" + id)
          .then(function (response) {
            console.log(response.data);
            CURRENT_FOLDER = response.data;
            $scope.getBand(CURRENT_FOLDER.bandId, function(band) {
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

  $scope.getFiles = function(folderName, folder, callback) {
    if (folder.id === "-1") {
      CURRENT_FILES = testFiles;
      callback(CURRENT_FILES);
    } else {
      $http.get("/php/getFiles.php?type=folder&folderName=" + folder.metaName + "&bandId=" + folder.bandId)
          .then(function (response) {
            console.log(response.data);
            CURRENT_FILES = response.data;
            callback(response.data);
          });
    }

  };
  */

  $scope.currentTimeToString = function(currentTime) {
    var date = new Date(currentTime);
    date.setHours( date.getHours() + 2 );
    return date.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  $scope.getNotificationType(notification) {
    var text = "";
    var type = notification.notificationType;
    if (type === "upload") {
      text = "UPLOAD";
    } else if (type === "folder") {
      text = "FOLDER";
    } else if (type === "comment") {
      text = "COMMENT";
    } else if (type === "likedFile") {
      text = "LIKE";
    } else {
      text = "NOTIFICATION";
    }
  };

  $scope.getNotificationContent(notification) {
    var text = "";
    var type = notification.notificationType;
    if (type === "upload") {
      text = notification.name + "was uploaded on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "folder") {
      text = notification.name + "was created on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "comment") {
      text = notification.userName + " left a comment on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "likedFile") {
      text = notification.userName + " liked " + notification.file.name + " on " + $scope.currentTimeToString(notification.dateTime);
    } else {
      text = "NOTIFICATION";
    }
  };

  $scope.openFolder = function(folder) {
    navigateToURL("/#/folder?id=" + folder.id);
  };

  $scope.openFile = function(file) {
    navigateToURL("/#/idea?id=" + file.id);
  };

  $scope.openComment = function(comment) {
    navigateToURL("/#/idea?id=" + comment.fileId);
  };

  $scope.openLike = function(like) {
    navigateToURL("/#/idea?id=" + like.fileId);
  };

  $scope.getRecentActivity = function(bandIds) {
      $http.get("/php/getRecentActivity.php?type=bandList&bandIds=" + JSON.stringify(bandIds))
          .then(function (response) {
              hideElementById("loadCommentsContainer");
              displayElementById("commentContainer");
              //$scope.recentComments = response.data.comments;
              $scope.recentHighlights = response.data.highlights;
              console.log($scope.recentHighlights);
          });
  };

  $scope.getNotifications = function(bandIds) {
      $http.get("/php/getRecentActivity.php?type=notifications&userId=" + CURRENT_USER.id + "&bandIds=" + JSON.stringify(bandIds))
          .then(function (response) {
              hideElementById("loadNotificationsContainer");
              displayElementById("notificationsContainer");
              $scope.notifications = response.data.notifications;

              $scope.uploads = response.data.notifications.uploadActivity;
              $scope.folders = response.data.notifications.folderActivity;
              var comments = response.data.notifications.commentActivity;
              var likes = response.data.notifications.likeActivity;
              $scope.recentUploads = response.data.notifications.recentUploadActivity;
              $scope.recentFolders = response.data.notifications.recentFolderActivity;
              var recentComments = response.data.notifications.recentCommentActivity;
              var recentLikes = response.data.notifications.recentLikeActivity;

              $scope.allNotifications = $scope.uploads.concat($scope.folders);
              $scope.allNotifications = $scope.allNotifications.concat(comments);
              $scope.allNotifications = $scope.allNotifications.concat(likes);
              $scope.allNotifications.sort(function(a,b) {
                return new Date(b.dateTime) - new Date(a.dateTime);
              });
              $scope.recentNotifications = $scope.recentUploads.concat($scope.recentFolders);
              $scope.recentNotifications = $scope.recentNotifications.concat(recentComments);
              $scope.recentNotifications = $scope.recentNotifications.concat(recentLikes);
              $scope.recentNotifications.sort(function(a,b) {
                return new Date(b.dateTime) - new Date(a.dateTime);
              });
              $scope.numberOfNotifications = $scope.allNotifications.length + $scope.recentNotifications.length;

              console.log($scope.notifications);
              console.log($scope.recentNotifications);
              console.log($scope.allNotifications);
          });
  };

  $scope.loadUIObjects = function() {


    finishControllerSetup();
  };

  $scope.loadController = function() {
    setupController();
    // Do this if logged in
    if (isLoggedIn()) {
      var bandIds = convertCurrentBandsToBandIds();
      $scope.bands = CURRENT_BANDS;
      $scope.getRecentActivity(bandIds);
      $scope.getNotifications(bandIds);
      $scope.loadUIObjects();

    }
  };

  $scope.loadController();

}]);
