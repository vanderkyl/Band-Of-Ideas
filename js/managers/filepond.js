var filepond = "";

$(document).ready(function () {
  $("#UploadBands").change(function() {
    setupFoldersDropdown();
  });
  $("#UploadFolders").change(function() {

    setupFilePond();
    displayElementById("filepondDiv");
  });

});

function setupFoldersDropdown(callback) {
  hideElementById("filepondDiv");
  var selectedBand = $("#UploadBands").val();
  getElementById("UploadFolders").innerHTML = "";
  httpGet("/php/getFolders.php?bandName=" + selectedBand, function(folders) {
    folders = JSON.parse(folders);
    getElementById("UploadFolders").innerHTML += "<option value='Select a Folder' disabled selected>Select a Folder</option>";
    for (var i = 0; i < folders.length; i++) {
      var folder = folders[i].name;
      getElementById("UploadFolders").innerHTML += "<option value='" + folder + "'>" + folder+ "</option>";
    }
    if (callback) {
      callback();
    }
  });
}

function setupFilePond() {
  console.log("Set up filepond");
  var selectedFolder = $("#UploadFolders").val();
  selectedFolder = generateMetaName(selectedFolder);
  var selectedBand = $("#UploadBands").val();
  selectedBand = generateMetaName(selectedBand);
  console.log(selectedFolder);
  console.log(selectedBand);
  var input = document.getElementById("filepond");
  filepond = FilePond.create(input);
  filepond.setOptions({
    server: {
      process:(fieldName, file, metadata, load, error, progress, abort) => {
        console.log("Uploading file:");
        //register canplaythrough event to #audio element to can get duration
        var obUrl = URL.createObjectURL(file);
        var uploadAudio = getElementById('uploadAudio');
        uploadAudio.setAttribute('src', obUrl);
        uploadAudio.addEventListener('canplaythrough', function(e){
          //add duration
          file.duration = Math.round(e.currentTarget.duration);;
          URL.revokeObjectURL(obUrl);
          console.log(file);
          // fieldName is the name of the input field
          // file is the actual file object to send
          const formData = new FormData();
          formData.append(fieldName, file, file.name);

          const request = new XMLHttpRequest();
          request.open('POST', '/php/filepond-upload.php?folderName=' + selectedFolder + '&bandName=' + selectedBand);

          // Should call the progress method to update the progress to 100% before calling load
          // Setting computable to false switches the loading indicator to infinite mode
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };

          // Should call the load method when done and pass the returned server file id
          // this server file id is then used later on when reverting or restoring a file
          // so your server knows which file to return without exposing that info to the client
          request.onload = function() {
            if (request.status >= 200 && request.status < 300) {
              // the load method accepts either a string (id) or an object
              load(request.responseText);
            }
            else {
              // Can call the error method if something is wrong, should exit after
              error('oh no');
            }
          };
          console.log(formData);
          request.send(formData);
        });



        // Should expose an abort method so the request can be cancelled
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            request.abort();

            // Let FilePond know the request has been cancelled
            abort();
          }
        };
      }
    }

  });
}

function setupUploadModal(callback) {
  var selectedBand = "";
  var selectedFolder = "";
  $('#uploadModal').modal();
  if (getElementById("UploadBands").innerHTML === "") {
    httpGet("/php/getUser.php?username=" + CURRENT_USER.username + "&login=true", function(user) {
      user = JSON.parse(user);
      getElementById("UploadBands").innerHTML += "<option value='Select a Band' disabled selected>Select a Band</option>";
      for (var i = 0; i < user.bands.length; i++) {
        var band = user.bands[i].name;
        getElementById("UploadBands").innerHTML += "<option value='" + band + "'>" + band + "</option>";
      }
      if (callback) {
        callback();
      }
    });

  }

}
