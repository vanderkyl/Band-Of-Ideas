app.controller('routeController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {

    $scope.openFile = function(id) {
        $http.get("/php/getFiles.php?type=singleFile&fileId=" + id)
            .then(function (response) {

                hideResult();
                CURRENT_FILES = response.data.folderFiles;
                CURRENT_FILE = response.data.file;
                CURRENT_FOLDER = response.data.folder;
                CURRENT_BAND = response.data.band;
                navigateToURL("/#/idea/" + CURRENT_FILE.name);
            });
    };

    var id = getParameterByName("id");
    console.log(id);
    $scope.openFile(id);
}]);
