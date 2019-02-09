//Start of Upload Functionality
var fileSelect;
var uploadButton;
var uploadState;
var uploadStatus;
var uploadResult;
var uploadPercentage;
var uploadPercentageBar;
var form;
var xhr;

getUploadElements();

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
            var roundedPercent = roundToTwoDecimals(percentComplete);
            if (roundedPercent < 100) {
                uploadStatus.innerHTML = "Uploading: " + roundedPercent + "%";
            } else {
                uploadStatus.innerHTML = "Finishing Upload...";
            }

            percentComplete = 100 - percentComplete;
            //Do something with upload progress
            uploadPercentageBar.style.marginRight = percentComplete + "%";
        }
    }, false);
    // Set up the request.

    xhr.open('POST', "/php/upload.php?folderName=" + CURRENT_FOLDER.metaName + "&bandName=" + CURRENT_BAND.metaName);
    xhr.withCredentials = true;


    // Send the Data.
    xhr.send(formData);
    console.log(formData);
}

function resetUploadModal() {
    form.reset();
    uploadStatus.innerHTML = "";
    uploadResult.innerHTML = "";
}

function getUploadElements() {
    fileSelect = document.getElementById('fileSelector');
    uploadButton = document.getElementById('uploadButton');
    uploadState = document.getElementById('uploadState');
    uploadStatus = document.getElementById('uploadStatus');
    uploadResult = document.getElementById('uploadResult');
    uploadPercentage = document.getElementById('uploadPercentage');
    uploadPercentageBar = document.getElementById('uploadPercentageBar');
    form = document.getElementById('fileForm');
    xhr = new XMLHttpRequest();
}
