app.controller('folderController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};

  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";

  $scope.currentPage = 0;
  $scope.numberOfFolders = 0;
  $scope.sortBy = "-likes";
  $scope.pageSize = "20";
  $scope.search = "";

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
          $scope.folderMessage = "";
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

  $scope.openFolder = function(folder) {
    console.log("open folder");
    console.log(folder);
    var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/";
    var folderName = folder.name;
    folder.name = "Loading...";
    // Open Test Files
    if (folder.metaName == "test_folder") {
      CURRENT_FILES = testFiles;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = folder;
      folderUrl += CURRENT_FOLDER.metaName;
      console.log("folder link: " + folderUrl);
      folder.name = folderName;
      navigateToURL(folderUrl);
    } else {
      var folderMetaName = folder.metaName;
      var bandId = CURRENT_BAND.id;
      $scope.getFiles(folderMetaName, bandId, folder, function(success) {
        folder.name = folderName;
        if (success) {
          folderUrl += CURRENT_FOLDER.metaName;
          navigateToURL(folderUrl);
        } else {
          console.log("Getting files failed.");
        }
      });

    }
  };

  $scope.getFiles = function(folderName, bandId, folder, callback) {
    $http.get("/php/getFiles.php?folderName=" + folder.metaName + "&bandId=" + CURRENT_BAND.id)
    .then(function (response) {
      console.log(response.data);
      CURRENT_FILES = response.data;
      CURRENT_FOLDERS = $scope.folders;
      CURRENT_FOLDER = folder;
      callback(response.data);
    });
  };

  $scope.archiveFolder = function(folder) {
    console.log("Archiving folder");
    var confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (confirmDelete) {
      $http.get("/php/archiveFolder.php?folderName=" + folder.metaName + "&bandName=" + $scope.band.metaName)
      .then(function (response) {
        console.log(response.data);
        $scope.folders = response.data;
        CURRENT_FOLDERS = response.data;
      });
    }
  };

  $scope.goToUserInfo = function() {
    navigateToURL("/#/");
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

  $scope.getData = function () {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.folders, $scope.search);
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

  // Open User Details
  $scope.showBandDetails = function() {
    var detailsDisplay = getElementById("bandDetails").style.display;
    if (detailsDisplay == "none" || detailsDisplay === "") {
      displayElementById("bandDetails");
    } else {
      hideElementById("bandDetails");
    }
  };

  $scope.ToggleAddFolderInput = function() {
    var button = getElementById("addFolder");
    if (button.innerText == "Add Folder") {
      button.innerText = "Cancel";
      displayElementById("addFolderInput");
    } else {
      button.innerText = "Add Folder";
      hideElementById("addFolderInput");
    }

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
    hideElementById("bandDetails");
    displayElementById("bandName");
  }

  // Do this if logged in
  if (isLoggedIn()) {
    $scope.band = CURRENT_BAND;
    $scope.files = CURRENT_FILES;
    $scope.folder = CURRENT_FOLDER;
    console.log(CURRENT_FOLDERS);

    if (CURRENT_FOLDERS === "") {
      $scope.folderMessage = "Click the green button to Add a Folder!";
    } else {
      $scope.folders = CURRENT_FOLDERS;
    }
    var urlPaths = window.location.hash.split('/');
    document.title = CURRENT_BAND.name;
    var bandUrl = "/#/band/" + CURRENT_BAND.metaName;
    lastUrl = bandUrl;
    removeNavLink("bandLink");
    console.log(CURRENT_BAND.name);
    addNavLink("bandLink", CURRENT_BAND.name, bandUrl)
  }
}]);
