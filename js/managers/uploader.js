//Start of Upload Functionality
var fileSelect = document.getElementById('fileSelector');
var uploadButton = document.getElementById('uploadButton');
var uploadState = document.getElementById('uploadState');
var uploadStatus = document.getElementById('uploadStatus');
var uploadResult = document.getElementById('uploadResult');
var uploadPercentage = document.getElementById('uploadPercentage');
var form = document.getElementById('fileForm');

function performUpload(callback) {
  uploadStatus.innerHTML = "Upload Started..."
  event.preventDefault();
  uploadButton.innerHTML = 'Uploading...';
  var uploadedFiles = fileSelect.files;

  var formData = new FormData();
  for (var i = 0; i < uploadedFiles.length; i++) {
    var file = uploadedFiles[i];
    console.log("Uploaded file: ");
    console.log(file);
    // Add the file to the request.
    formData.append('files[]', file, file.name);
  }

  // Set up the request.
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName, true);
  xhr.withCredentials = true;
  xhr.upload.addEventListener("progress", function(evt){
    if (evt.lengthComputable) {
      var percentComplete = (evt.loaded / evt.total) * 100;
      fileStatus.innerHTML = roundToTwoDecimals(percentComplete) + "%";
      percentComplete = 100 - percentComplete;
      //Do something with upload progress
      uploadPercentageBar.style.marginRight = percentComplete + "%";
    }
  }, false);
  xhr.onload = function (callback) {
    var success;
    if (xhr.status === 200) {
      // File(s) uploaded.
      uploadButton.innerHTML = 'Upload';
    } else {
      alert('An error occurred!');
    }
    if (xhr.status == "200") {
      uploadStatus.innerHTML = "Success!";
      success = true;
    } else {
      uploadStatus.innerHTML = "Failure.";
      success = false;
    }

    uploadResult.innerHTML = xhr.responseText;

    fileStatus.innerHTML = "Loading file: " + file.name;
    callback(success);
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
