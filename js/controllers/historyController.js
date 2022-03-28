app.controller('historyController', ['$scope', '$sce', '$http', '$filter',
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


  $scope.goToLink = function() {
    var source = $scope.file.source;
    if (source != "") {
      openLinkInNewTab($scope.file.source);
    }
  };


  $scope.updateUser = function(userId) {
    $http.post("/php/updateUser.php?userId=" + userId + "&type=tokenUpdate", "token")
    .then(function (response) {
      console.log("Updated user successfully.");
    },
    function (response) {
      console.log("The update failed: " + response.data);
    });
  }

  $scope.timeToString = function(currentTime) {
    return timeToString(parseInt(currentTime));
  };

  $scope.currentTimeToString = function(currentTime) {
    var date = new Date(currentTime);
    date.setHours( date.getHours() + 2 );
    return date.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  $scope.getNotificationType = function(notification) {
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
    return text;
  };

  $scope.getNotificationContent = function(notification) {
    var text = "";
    var type = notification.notificationType;
    if (type === "upload") {
      text = notification.name + " was uploaded on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "folder") {
      text = notification.name + " was created on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "comment") {
      text = notification.userName + " left a comment on " + $scope.currentTimeToString(notification.dateTime);
    } else if (type === "likedFile") {
      text = notification.userName + " liked " + notification.file.name + " on " + $scope.currentTimeToString(notification.dateTime);
    } else {
      text = "NOTIFICATION";
    }
    return text;
  };

  $scope.openNotification = function(notification) {
    var type = notification.notificationType;
    if (type === "upload") {
      navigateToURL("/#/idea?id=" + notification.id);
    } else if (type === "folder") {
      navigateToURL("/#/folder?id=" + notification.id);
    } else if (type === "comment") {
      navigateToURL("/#/idea?id=" + notification.fileId);
    } else if (type === "likedFile") {
      navigateToURL("/#/idea?id=" + notification.fileId);
    }
  };

  $scope.openFolder = function(folder) {
    navigateToURL("/#/folder?id=" + folder.id);
  };

  $scope.openFile = function(file) {
    navigateToURL("/#/idea?id=" + file.id);
  };

  $scope.openFile = function(id, time) {
      var numTime = parseInt(time);
      if (numTime > 0) {
          openFile(id, time);
      } else {
          openFile(id, 0);
      }
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

      $scope.loadUIObjects();

    }
  };

  $scope.loadController();

}]);
