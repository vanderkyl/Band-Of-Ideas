app.controller('playlistController', ['$scope', '$sce', '$http', '$filter',
    function($scope, $sce, $http, $filter) {
        // Folders
        $scope.folders = [];
        $scope.folder = {};
        $scope.newFolder = "";
        $scope.band = {};
        // Files
        $scope.files = [];
        $scope.visibleFiles = [];
        $scope.file = {};
        $scope.fileLinks = [];
        $scope.currentFileIndex = 0;
        $scope.uploadFiles = [];
        $scope.addFolderMessage = "New Folder";
        $scope.folderMessage = "";

        $scope.currentPage = 1;
        $scope.numberOfFiles = 0;
        $scope.sortBy = "-likes";
        $scope.pageSize = "10";
        $scope.maxSize = 5;
        $scope.search = "";

        $scope.maxComments = "5";
        $scope.fileIcon = "/img/music.png";

        $scope.user = {};
        $scope.userLikes = [];
        $scope.members = [];

        //TODO Create functionality for a recent file selection

        // globals
        var miniAudioPlayer = getElementById("audioPlayer");

        function playNext() {
            console.log("Play next");
            console.log($scope.file);
            console.log($scope.file.fileIndex);
            var nextFile = $scope.files[$scope.file.fileIndex+1];
            console.log(nextFile);
            if (nextFile) {
                $scope.openFile(nextFile);
            }
        }

        miniAudioPlayer.addEventListener("ended", playNext);

        //Files Section
        $scope.openPreviousFolder = function() {
            var previousUrl = "/#/band/" + CURRENT_BAND.metaName;
            navigateToURL(previousUrl);
        };


        $scope.goToLink = function() {
            var source = $scope.file.source;
            if (source != "") {
                openLinkInNewTab($scope.file.source);
            }
        };

        $scope.openFolder = function(song, event) {
            stopPropogation(event);
            var folderUrl = "/#/band/" + song.folder.metaName + "/";
            var folderName = song.folder.name;
            var folderMetaName = song.folder.metaName;
            $scope.getFiles(folderMetaName, song.bandId, song.folder, function(success) {
                song.folder.name = folderName;
                if (success) {
                    folderUrl += CURRENT_FOLDER.metaName;
                    navigateToURL(folderUrl);
                } else {
                    console.log("Getting files failed.");
                }
            });

        };

        $scope.openFile = function(file) {
            getElementById("audioPlayerAudio").pause();

            console.log("Opening file:");
            console.log(file);
            CURRENT_FILE = file;
            navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName
                + "/" + CURRENT_FILE.metaName);

        };

        $scope.closeFile = function() {
            getElementById("audio").pause();
            document.title = CURRENT_FOLDER.name;
            closeFile($scope.file.id);
        };

        $scope.openMiniPlayer = function() {
            var source = getElementById("m4aSource").src;
            var currentTime = getElementById("audio").currentTime;
            openMiniPlayer($scope.file.id, $scope.file.name, source, currentTime);
        };

        $scope.openMiniAudioPlayer = function(file) {
            openMiniPlayer(file.id, file.name, file.link, 0);
        };

        $scope.showFolderDetails = function() {
            var detailsDisplay = getElementById("folderDetails").style.display;
            if (detailsDisplay === "none" || detailsDisplay === "") {
                displayElementById("folderDetails");
            } else {
                hideElementById("folderDetails");
            }
        };

        $scope.deleteFile = function() {
            var prompt = confirm("Are you sure you want to delete this file?");
            //deleteFile($scope.file.id);
        };

        // Add like on file when opened
        $scope.plusOneOnFile = function() {
            $scope.plusOne($scope.file);
        };

        // Add like on file button
        $scope.plusOne = function(file) {
            // Keeps this from adding twice
            var index = file.id;

            displayElementInlineById("likedButton-" + index);
            hideElementById("likeButton-" + index);
            console.log(CURRENT_USER);
            $http.post("/php/updateFile.php?type=likes&user=" + CURRENT_USER.email, file)
                .then(
                    function (response) {
                        console.log(response.data);
                        file.likes++;
                        console.log(file.likes);
                    },
                    function (response) {
                        console.log(response.data);
                        console.log("Sorry, that didn't work.");
                    });
        };

        $scope.showLikes = function() {
            // Fill out like data if it hasn't been done yet
            for (var j = 0; i < $scope.files.length; i++) {
                for (var i = 0; i < $scope.files[j].userLikes.length; i++) {
                    var result = $scope.members.filter(function( user ) {
                        return user.id == file.userLikes[i];
                    });
                    if (result) {
                        var user = result[0].name;
                        if (result[0].id === CURRENT_USER.id) {
                            user = "Me";
                        }
                        document.getElementById("playListFileDetails-" + $scope.files[j].id).innerText += user;
                    }
                }
            }




        };

        $scope.showLikesOnFile = async function(file) {
            // Fill out like data if it hasn't been done yet
            if (getElementById("openFileDetails").childElementCount === 0) {
                for (var i = 0; i < file.userLikes.length; i++) {
                    var result = $scope.band.memberIds.filter(function( user ) {
                        return user.id == file.userLikes[i];
                    });
                    if (result) {
                        var user = result[0].email;
                        if (result[0].id === CURRENT_USER.id) {
                            user = "Me";
                        }
                        $("#openFileDetails").append('<p class="fileData">' + user + ' <img src="/img/black-metal.png"/></p>');
                    }
                }
            }

            displayElementById("openFileDetails");
            await sleep(3000);
            hideElementById("openFileDetails");
        };

        $scope.showFilter = function() {
            var filterDisplay = getElementById("filesFilter").style.display;
            if (filterDisplay == "none" || filterDisplay == "") {
                displayElementById("filesFilter");
            } else {
                hideElementById("filesFilter");
            }
        };

        $scope.downloadFromFile = function() {
            $scope.downloadFile($scope.file);
        };

        $scope.downloadFile = function(file) {
            openLinkInNewTab(file.link);
        };

        $scope.getData = function () {
            // needed for the pagination calc
            // https://docs.angularjs.org/api/ng/filter/filter
            return $filter('filter')($scope.files, $scope.search);
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

        $scope.formatFileData = function() {
            for (var i = 0; i < CURRENT_FILES.length; i++) {
                CURRENT_FILES[i].name = getFriendlyTitle(CURRENT_FILES[i]);
                CURRENT_FILES[i].size = calculateFileSize(CURRENT_FILES.size);
            }
        };

        $scope.checkIfFilesAreLiked = async function(file) {
            //TODO figure out better way to do this.
            await sleep(10);
            console.log("Checking files");
            file.liked = false;
            var userId = CURRENT_USER.id;
            var index = file.id;
            var userLikes = file.userLikes;
            for (var i = 0; i < userLikes.length; i++) {
                console.log(userLikes[i]);
                if (userId === userLikes[i]) {
                    file.liked = true;
                    hideElementById("likeButton-" + index);
                    displayElementInlineById("likedButton-" + index);
                }
            }
        };



        $scope.goBackToBandPage = function() {
            CURRENT_BAND = $scope.band;
            navigateToURL("/#/band/" + CURRENT_BAND.metaName);
        };

        $scope.goBackToFolderPage = function() {
            CURRENT_FOLDER = $scope.folder;
            navigateToURL("/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName);
        };

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

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

        $scope.$watch('currentPage + pageSize', function() {
            var begin = (($scope.currentPage - 1) * $scope.pageSize);
            var end = begin + $scope.pageSize;

            $scope.visibleFiles = $scope.files.slice(begin, end);
            console.log($scope.visibleFolders);
            var elements = document.getElementById("pagination").getElementsByTagName("ul");
            elements[0].classList.add("pagination");
        });

        $scope.showFilters = function() {
            var filters = getElementById("fileFilters");
            console.log(filters.style.display);
            if (filters.style.display === "none") {
                showElementById("fileFilters");
            } else {
                hideElementByIdWithAnimation("fileFilters");
            }

        };

        function loadFileLinkList() {

            for (var i = 0; i < $scope.files.length; i++) {
                $scope.files[i].fileIndex = i;
                console.log($scope.files[i]);
                $scope.fileLinks[i] = $scope.files[i].link;
            }
        }


        showAppLoader();
        // Do this if logged in
        if (isLoggedIn()) {

            $scope.band = CURRENT_BAND;
            $scope.user = CURRENT_USER;
            $scope.files = CURRENT_FILES;
            $scope.folder = CURRENT_FOLDER;
            $scope.members = CURRENT_MEMBERS;
            $scope.numberOfFiles = CURRENT_FILES.length;
            document.title = CURRENT_FOLDER.name;

            var folderUrl = "/#/band/" + CURRENT_BAND.metaName + "/" + CURRENT_FOLDER.metaName;
            loadFileLinkList();
            $scope.showLikes();
            removeNavLink("folderLink");
            addNavLink("folderLink", CURRENT_FOLDER.name, folderUrl);

        }
        hideAppLoader();
    }]);

app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    console.log(item);
                    var value = {
                        // File Name
                        name: item.name,
                        //File Size
                        size: item.size,
                        // File Input Value
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);



app.filter('reverse', function() {
    return function(items) {
        if (!items || !items.length) { return; }
        return items.slice().reverse();
    };
});
