app.controller('musicController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {
  // Folders
  $scope.folders = [];
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
    $http.post("addFolder.php", folderName)
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
    displayElementById("addFolderInput");
  }

  $scope.getFolders = function() {
    $http.get("getFolders.php?bandName=" + $scope.band.name)
    .then(function (response) {
      console.log(response.data);
      $scope.folders = response.data;
    });
  }

  $scope.addFile = function(file) {
    $scope.safeApply(function() {
      $scope.files.push(getFile(file, $sce));
    });
  };

  $scope.openFolder = function(index) {

  };

  $scope.openFile = function(index) {
    var file = $scope.files[index];
    $scope.safeApply(function(index) {
      $scope.file = file;
    });
    hidePreviousFile();
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
        openLinkInNewTab(file.path);
    } else {
        navigateToURL(file.path);
    }
  }

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

  if (isLoggedIn()) {
    $scope.band = currentBand;
    console.log(currentBand.id);
    if (currentFolders === "") {
      $scope.getFolders();
    } else {
      $scope.folders = currentFolders;
    }

  }
}]);
