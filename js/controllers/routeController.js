app.controller('routeController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {

    $scope.openFile = function(id) {
        $http.get("/php/getFiles.php?type=singleFile&fileId=" + id)
            .then(function (response) {

                hideResult("livesearch");
                hideResult("largeLivesearch");
                CURRENT_FILES = response.data.folderFiles;
                CURRENT_FILE = response.data.file;
                CURRENT_FOLDER = response.data.folder;
                CURRENT_BAND = response.data.band;
                navigateToURL("/#/idea/" + CURRENT_FILE.name);
            });
    };

    $scope.openFolder = function(id) {
        navigateToURL("/#/folder?id=" + id);
    };

    var id = getParameterByName("id");
    var type = getParameterByName("type");
    console.log(id);
    if (type === "file") {
      $scope.openFile(id);
    } else if (type === "folder") {
      $scope.openFolder(id);
    }

}]);
