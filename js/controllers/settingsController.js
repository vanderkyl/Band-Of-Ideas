app.controller('settingsController', ['$scope', '$sce', '$http',
function($scope, $sce, $http) {
    if (isLoggedIn()) {
        setupController();
        var bgcId = getBackgroundColorId();
        selectBackgroundColorButton(bgcId);
        displayElementById("settingsView");
        finishControllerSetup();
    }

}]);
