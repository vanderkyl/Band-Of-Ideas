app.controller('musicController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};
  // Files
  $scope.files = [];
  $scope.file = {};

  //TODO Create functionality for a recent file selection

  $scope.addFolder = function() {
    var folderName = {
      name: $scope.newFolder,
      band: $scope.band.name
    };
    $http.post("/php/addFolder.php", folderName)
    .then(
      function (response) {
        console.log(response.data);
        $scope.folders.push(folderName);
        hideElementById('addFolderInput');
        displayElementById('addFolder');
      },
      function (response) {
        console.log(response.data);
      });


  };

  $scope.showAddFolderInput = function() {
    hideElementById("addFolder");
    displayElementById("cancelNewFolder");
    displayElementById("addFolderInput");
  }

  $scope.hideAddFolderInput = function() {
    hideElementById("cancelNewFolder");
    hideElementById("addFolderInput");
    displayElementById("addFolder");
  }

  $scope.getFolders = function() {
    displayElementById("loading");
    console.log($scope.band);
    $http.get("/php/getFolders.php?bandName=" + $scope.band.name)
    .then(function (response) {
      console.log(response.data);
      hideElementById("loading");
      $scope.folders = response.data;
      CURRENT_FOLDERS = response.data;
    });
  }

/*
  $scope.addFile = function(file) {
    $scope.safeApply(function() {
      $scope.files.push(getFile(file, $sce));
    });
  };
*/
  $scope.openFolder = function(index) {
    console.log("open folder");
    console.log($scope.folders[index]);
    displayElementById("loading");
    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/";

    if ($scope.folders[index].name == "Test Folder") {
      CURRENT_FILES = testFiles;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = $scope.folders[index];
      folderUrl += CURRENT_FOLDER.metaName;
      navigateToURL(folderUrl);
      addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);

      hideElementById("loading");
    } else {
      $http.get("/php/getFiles.php?folderId=" + $scope.folders[index].id)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FILES = response.data;
        CURRENT_FOLDERS = $scope.folders;
        CURRENT_FOLDER = $scope.folders[index];
        folderUrl += CURRENT_FOLDER.metaName;
        navigateToURL(folderUrl);
        addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);

        hideElementById("loading");
      });
    }

  };

  $scope.deleteFolder = function() {
    var prompt = confirm("Are you sure you want to delete this folder?");
    //deleteFile($scope.file.id);
  };

  /*
  // Go through the files that were saved from the Google Api Call
  $scope.getFiles = function() {
    console.log("Getting Files");
    if (PREVIOUS_FOLDER.length > 0) {
      $scope.addPreviousButton();
    }
    sortFiles($scope.addFolder, $scope.addFile);
  };

  $scope.goToFilePage = function() {
    navigateToURL("/#/file?id=" + $scope.file.id);
    CURRENT_FILE = $scope.file;
  }

  // Add button to go back to previous folder contents
  $scope.addPreviousButton = function() {
    $scope.safeApply(function() {
      $scope.folders.push(getPreviousButton());
    });
  };

  $scope.loadFiles = function() {
    console.log("Loading files...");
    $scope.getFiles();
    filesReady = false;
  };

  $scope.waitUntilFilesAreLoaded = function() {
    if (filesReady) {
      $scope.loadFiles();
    } else {
      // TODO use a promise instead of a wait loop. This is dangerous
      setTimeout($scope.waitUntilFilesAreLoaded, 500);
    }
  };

  // Clear the arrays that hold the current files and folders
  $scope.clearFilesAndFolders = function() {
    $scope.folders.length = 0;
    $scope.files.length = 0;
    $scope.folders = [];
    $scope.files = [];
    console.log("Cleared previous folders and files.");
    hideElementById("file");
  };
  */

  //Files Section
  var form = document.getElementById('fileForm');

  $scope.openPreviousFolder = function() {
    var previousUrl = "/#/band/" + CURRENT_BAND.metaName;
    hideElementById("fileSection");
    displayElementById("folderSection");
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

  $scope.deleteFile = function() {
    var prompt = confirm("Are you sure you want to delete this file?");
    //deleteFile($scope.file.id);
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
    $scope.band = CURRENT_BAND;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    console.log(CURRENT_FOLDERS);

    if ($scope.band.name == "Test Band") { // Test Folders
      $scope.folders = testFolders;
    } else if (CURRENT_FOLDERS === "") {
      $scope.getFolders();
    } else {
      $scope.folders = CURRENT_FOLDERS;
    }
    var urlPaths = window.location.hash.split('/');
    // If the url has 3 path identifiers ( # / band / bandName )
    if (urlPaths.length === 3) {
      hideElementById("fileSection");
      displayElementById("folderSection");
    } else {
      hideElementById("folderSection");
      displayElementById("fileSection");
    }

  }
}]);
