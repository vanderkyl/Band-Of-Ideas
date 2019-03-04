app.controller('settingsController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {
    if (isLoggedIn()) {
        setupController();
        displayElementById("settingsView");
        finishControllerSetup();
    }

}]);
