//Start of Upload Functionality
var fileSelect = document.getElementById('fileSelector');
var uploadButton = document.getElementById('uploadButton');
var uploadState = document.getElementById('uploadState');
var uploadStatus = document.getElementById('uploadStatus');
var uploadResult = document.getElementById('uploadResult');
var uploadPercentage = document.getElementById('uploadPercentage');
var uploadPercentageBar = document.getElementById('uploadPercentageBar');
var form = document.getElementById('fileForm');
var xhr = new XMLHttpRequest();

async function performUpload() {
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

    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = (evt.loaded / evt.total) * 100;
        fileStatus.innerHTML = roundToTwoDecimals(percentComplete) + "%";
        percentComplete = 100 - percentComplete;
        //Do something with upload progress
        uploadPercentageBar.style.marginRight = percentComplete + "%";
        uploadPercentageButton.style.marginRight = percentComplete + "%";
      }
    }, false);
    // Set up the request.
    xhr.addEventListener("progress", function(evt) {
      console.log("Progress");
       if (evt.lengthComputable) {
           var percentComplete = (evt.loaded / evt.total) * 100;
           console.log(percentComplete);
       }
    }, false);
    xhr.open('POST', "/php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName, true);
    xhr.withCredentials = true;


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
