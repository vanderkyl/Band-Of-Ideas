app.controller('fileController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};
  // Files
  $scope.files = [];
  $scope.file = {};
  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";
  $scope.currentPage = 0;
  $scope.numberOfFiles = 0;
  $scope.sortBy = "name";
  $scope.pageSize = "10";
  $scope.search = "";

  //TODO Create functionality for a recent file selection


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

  $scope.openFile = function(file) {
    console.log(file);
    file.views++;
    $scope.safeApply(function() {
      $scope.file = file;
    });
    hidePreviousFile();
    console.log(file);
    document.title = file.name;
    loadFile(file);
    scrollToElementById("fileSection");
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
    saveLike($scope.file);
  };

  // Add like on file button
  $scope.plusOne = function(file) {
    // Keeps this from adding twice
    var index = file.id;
    stopPropogation();
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

  $scope.download = function(file) {
    // Keeps this from downloading twice.
    stopPropogation();
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
    var userId = CURRENT_USER.id;
    var index = file.id;
    var userLikes = file.userLikes;
    for (var i = 0; i < userLikes.length; i++) {
      if (userId === userLikes[i]) {
        console.log("likeButton-" + index);
        hideElementById("likeButton-" + index);
        displayElementInlineById("likedButton-" + index);
      }
    }
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

  //Start of Upload Functionality
  var fileSelect = document.getElementById('fileSelector');
  var uploadButton = document.getElementById('uploadButton');
  var uploadState = document.getElementById('uploadState');
  var uploadStatus = document.getElementById('uploadStatus');
  var uploadResult = document.getElementById('uploadResult');
  var uploadPercentage = document.getElementById('uploadPercentage');
  var form = document.getElementById('fileForm');

  form.onsubmit = function(event) {
    uploadStatus.innerHTML = "Upload Started..."
    event.preventDefault();
    uploadButton.innerHTML = 'Uploading...';
    var uploadedFiles = fileSelect.files;

    var formData = new FormData();
    for (var i = 0; i < uploadedFiles.length; i++) {
      var file = uploadedFiles[i];
      // Add the file to the request.
      formData.append('files[]', file, file.name);
    }

    // Set up the request.
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName, true);
    xhr.withCredentials = true;
    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = (evt.loaded / evt.total) * 100;
        fileStatus.innerHTML = roundToTwoDecimals(percentComplete) + "%";
        percentComplete = 100 - percentComplete;
        //Do something with upload progress
        uploadPercentageBar.style.marginRight = percentComplete + "%";
      }
    }, false);
    xhr.onload = function () {

      if (xhr.status === 200) {
        // File(s) uploaded.
        uploadButton.innerHTML = 'Upload';
      } else {
        alert('An error occurred!');
      }
      if (xhr.status == "200") {
        uploadStatus.innerHTML = "Success!";
      } else {
        uploadStatus.innerHTML = "Failure.";
      }

      uploadResult.innerHTML = xhr.responseText;

      fileStatus.innerHTML = "Loading file: " + file.name;
      $http.get("/php/getFiles.php?folderName=" + $scope.folder.metaName)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FILES = response.data;
        $scope.files = CURRENT_FILES;
        resetUploadModal();
        hideElementById("upload");
      });
    };
    // Send the Data.
    xhr.send(formData);
    console.log(formData);
  }

  function resetUploadModal() {
    form.reset();
    uploadStatus.innerHTML = "";
    uploadResult.innerHTML = "";
    fileStatus.innerHTML = "";
  }



  // Do this if logged in
  if (isLoggedIn()) {
    $scope.band = CURRENT_BAND;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    $scope.numberOfFiles = CURRENT_FILES.length;
    document.title = CURRENT_FOLDER.name;
    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName;
    removeNavLink("folderLink");
    addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);

  }
}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
