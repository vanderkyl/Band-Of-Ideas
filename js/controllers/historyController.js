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

  $scope.openView = function(view) {
    navigateToURL("/#/idea?id=" + view.fileId);
  };

  $scope.openLike = function(like) {
    navigateToURL("/#/idea?id=" + like.fileId);
  };

  $scope.getRecentViewsActivity = function() {
    var bandIds = convertCurrentBandsToBandIds();
    $http.get("/php/getRecentActivity.php?type=views&userId=" + CURRENT_USER.id + "&bandIds=" + JSON.stringify(bandIds))
        .then(function (response) {
            hideElementById("loadViewsContainer");
            displayElementById("viewsContainer");
            //$scope.recentComments = response.data.comments;
            $scope.recentViews = response.data.views.recentViewActivity;
            console.log($scope.recentViews);
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
      $scope.getRecentViewsActivity();
      $scope.loadUIObjects();

    }
  };

  $scope.loadController();

}]);
