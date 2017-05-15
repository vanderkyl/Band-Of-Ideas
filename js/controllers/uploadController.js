app.controller('uploadController', ['$scope', '$http',
function($scope, $http) {
  var form = document.getElementById('fileForm');
  var fileSelect = document.getElementById('fileSelector');
  var uploadButton = document.getElementById('uploadButton');
  var uploadState = document.getElementById('uploadState');
  var uploadStatus = document.getElementById('uploadStatus');
  var uploadResult = document.getElementById('uploadResult');
  form.onsubmit = function(event) {
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
    xhr.open('POST', 'http://www.bandofideas.com/upload.php', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        // File(s) uploaded.
        uploadButton.innerHTML = 'Upload';
      } else {
        alert('An error occurred!');
      }
      uploadState.innerHTML = xhr.readyState;
      uploadStatus.innerHTML = xhr.status;
      uploadResult.innerHTML = xhr.responseText;
    };
    // Send the Data.
    xhr.send(formData);
    console.log(formData);
    /*
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    $http.post('http://www.bandofideas.com/upload.php', formData).
    success(function(data, status) {
      $scope.status = status;
      $scope.data = data;
      $scope.result = data; // Show result from server in our <pre></pre> element
      uploadButton.innerHTML = 'Upload';
    })
    .
    error(function(data, status) {
      $scope.data = data || "Request failed";
      $scope.status = status;
    });
*/
  }

  if (isLoggedIn()) {
    // Do uploady stuff
  }

}]);
