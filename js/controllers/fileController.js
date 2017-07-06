app.controller('fileController', ['$scope', '$http',
function($scope, $http) {

  $scope.folder = {};
  $scope.files = [];
  $scope.file = {};
  $scope.status = "status";
  $scope.data = "data";
  $scope.result = "result";
  var form = document.getElementById('fileForm');

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

  $scope.openFile = function(index) {
    var file = $scope.files[index];
    $scope.safeApply(function(index) {
      $scope.file = file;
    });
    hidePreviousFile();
    console.log(file);
    loadFile(file);
  };

  $scope.closeFile = function() {
    closeFile($scope.file.id);
  };

  // Add like on file when opened
  $scope.plusOneOnFile = function() {
    saveLike($scope.file);
  };

  // Add like on file button
  $scope.plusOne = function(index) {
    // Keeps this from adding twice
    stopPropogation();
    saveLike($scope.files[index]);
  };

  $scope.download = function(index) {
    // Keeps this from downloading twice.
    stopPropogation();
    $scope.downloadFile($scope.files[index]);
  };

  $scope.downloadFromFile = function() {
    $scope.downloadFile($scope.file);
  };

  $scope.downloadFile = function(file) {
    // Check if file is greater than 25 MB
    if (file.bytes > 26214400) {
        openLinkInNewTab(file.link);
    } else {
        navigateToURL(file.link);
    }
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

  form.onsubmit = function(event) {
    event.preventDefault();
    var fileSelect = document.getElementById('fileSelector');
    var uploadButton = document.getElementById('uploadButton');
    var uploadState = document.getElementById('uploadState');
    var uploadStatus = document.getElementById('uploadStatus');
    var uploadResult = document.getElementById('uploadResult');
    var uploadPercentage = document.getElementById('uploadPercentage');
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
    xhr.open('POST', "http://www.bandofideas.com/php/upload.php?folderId=" + $scope.folder.id + "&bandId=" + $scope.folder.bandId, true);
    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = (evt.loaded / evt.total) * 100;
        //Do something with upload progress
        uploadPercentage.innerHTML = percentComplete + "%";
        console.log(percentComplete);
      }
    }, false);
    xhr.onload = function () {
      if (xhr.status === 200) {
        // File(s) uploaded.
        uploadButton.innerHTML = 'Upload';
      } else {
        alert('An error occurred!');
      }
      uploadStatus.innerHTML = xhr.status;
      uploadResult.innerHTML = xhr.responseText;

      displayElementById("loading");
      $http.get("getFiles.php?folderId=" + $scope.folder.id)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FILES = response.data;
        $scope.files = CURRENT_FILES;
        hideElementById("loading");
        hideElementById("upload");
      });
    };
    // Send the Data.
    xhr.send(formData);
    console.log(formData);
  }

  if (isLoggedIn()) {
    // Do uploady stuff
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    console.log($scope.files);
  }

}]);


    /*
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    $http.post('http://www.bandofideas.com/upload.php', formData).
    success(function(data, status) {
      $scope.status = status;
      $scope.data = data;
      $scope.result = data; // Show result from server in our <pre></pre> element
      uploadButton.innerHTML = 'Upload';
    })
    .
    error(function(data, status) {
      $scope.data = data || "Request failed";
      $scope.status = status;
    });

*/
