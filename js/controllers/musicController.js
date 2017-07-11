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
  $scope.addFolderMessage = "New Folder";

  //TODO Create functionality for a recent file selection
  $scope.addFolder = function() {
    var folder = {
      name: $scope.newFolder,
      metaName: generateMetaName($scope.newFolder),
      band: $scope.band.name
    };
    // TODO verify that the right data is there
    $http.post("/php/addFolder.php", folder)
    .then(
      function (response) {
        if (response.data === "New record created successfully!") {
          $scope.addFolderMessage = "Success!";
          $scope.folders.push(folder);
          hideElementById('addFolderInput');
          hideElementById('cancelNewFolder');
          displayElementById('addFolder');
        } else {
          $scope.addFolderMessage = "Failed to add folder.";
        }
      },
      function (response) {
        console.log(response.data);
      });
  };

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

  $scope.openFolder = function(index) {
    console.log("open folder");
    console.log($scope.folders[index]);
    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/";
    var folderName = $scope.folders[index].name;
    $scope.folders[index].name = "Loading...";
    if ($scope.folders[index].name == "Test Folder") {
      CURRENT_FILES = testFiles;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = $scope.folders[index];
      folderUrl += CURRENT_FOLDER.metaName;
      console.log("folder link: " + folderUrl);
      $scope.folders[index].name = folderName;
      navigateToURL(folderUrl);
    } else {
      $http.get("/php/getFiles.php?folderName=" + $scope.folders[index].metaName)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FILES = response.data;
        CURRENT_FOLDERS = $scope.folders;
        CURRENT_FOLDER = $scope.folders[index];
        folderUrl += CURRENT_FOLDER.metaName;
        console.log("folder link: " + folderUrl);
        $scope.folders[index].name = folderName;
        navigateToURL(folderUrl);
      });
    }
  };

  $scope.deleteFolder = function(index) {
    console.log("Deleting folder");
    var confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (confirmDelete) {
      $http.get("/php/deleteFolder.php?folderName=" + $scope.folders[index].metaName)
      .then(function (response) {
        console.log(response.data);
        CURRENT_FILES = response.data;
        CURRENT_FOLDERS = $scope.folders;
        CURRENT_FOLDER = $scope.folders[index];
        folderUrl += CURRENT_FOLDER.metaName;
        console.log("folder link: " + folderUrl);
        $scope.folders[index].name = folderName;
        navigateToURL(folderUrl);
      });
    }
    //deleteFile($scope.file.id);
  };

  //Files Section
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
    scrollToElementById("fileSection");
  };

  $scope.closeFile = function() {
    closeFile($scope.file.id);
  };

  $scope.openMiniPlayer = function() {
    openMiniPlayer($scope.file.id);
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

  $scope.showFolderButtons = function() {
    hideElementById("showButtonsButton");
    displayElementById("hideButtonsButton");
    displayElementById("hiddenFolderButtons");
    hideElementById("bandName");
  }

  $scope.hideFolderButtons = function() {
    hideElementById("hideButtonsButton");
    displayElementById("showButtonsButton");
    hideElementById("hiddenFolderButtons");
    displayElementById("bandName");
  }

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
    xhr.open('POST', "http://www.bandofideas.com/php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName, true);
    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = (evt.loaded / evt.total) * 100;
        fileStatus.innerHTML = percentComplete + "%";
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
      $http.get("/php/getFiles.php?folderId=" + $scope.folder.id)
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
      var bandUrl = "/#/band/" + CURRENT_BAND.metaName;
      removeNavLink("bandLink");
      addNavLink("bandLink", CURRENT_BAND.name, bandUrl)
      hideElementById("fileSection");
      displayElementById("folderSection");
    } else {
      hideElementById("folderSection");
      displayElementById("fileSection");
      var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName;
      removeNavLink("folderLink");
      addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);
    }
  }
}]);
