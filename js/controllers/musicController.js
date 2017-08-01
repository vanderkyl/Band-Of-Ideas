app.controller('musicController', ['$scope', '$sce', '$http', '$filter',
function($scope, $sce, $http, $filter) {
  // Folders
  $scope.folders = [];
  $scope.folder = {};
  $scope.newFolder = "";
  $scope.band = {};

  $scope.addFolderMessage = "New Folder";
  $scope.folderMessage = "";

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

  $scope.getFolders = function() {
    var bandName = $scope.band.name;
    $scope.folderMessage = "Loading folders..."
    $http.get("/php/getFolders.php?bandName=" + bandName)
    .then(function (response) {
      console.log(response.data);
      if (response.data.length === 0) {
        $scope.folderMessage = "Click the green button to Add a Folder!";
      } else {
        $scope.folderMessage = "";
      }
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
    // Open Test Files
    if ($scope.folders[index].metaName == "test_folder") {
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

  $scope.archiveFolder = function(index) {
    console.log("Archiving folder");
    var confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (confirmDelete) {
      $http.get("/php/archiveFolder.php?folderName=" + $scope.folders[index].metaName + "&bandName=" + $scope.band.metaName)
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

  // Open User Details
  $scope.showBandDetails = function() {
    var detailsDisplay = getElementById("bandDetails").style.display;
    if (detailsDisplay == "none" || detailsDisplay === "") {
      displayElementById("bandDetails");
    } else {
      hideElementById("bandDetails");
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
    hideElementById("bandDetails");
    displayElementById("bandName");
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
    document.title = CURRENT_BAND.name;
    var bandUrl = "/#/band/" + CURRENT_BAND.metaName;
    removeNavLink("bandLink");
    console.log(CURRENT_BAND.name);
    addNavLink("bandLink", CURRENT_BAND.name, bandUrl)
  }
}]);
