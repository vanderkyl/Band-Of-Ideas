// Load m4a or MP4
function loadFile(file) {
    //addViewToFile(file);
    switch(file.type) {
        case "audio/x-m4a":
            loadAudio(file);
            break;
        case "video/MP4":
            loadVideo(file);
            break;
        default:
    }
    //loadDisqus(file);
}

function loadVideo(file) {
  scrollToElementById("folderButtons");
  displayElementById("video");
  displayElementById("file");
}

function loadAudio(file) {
  hideElementById("audioPlayer");
  //scrollToElementById("folderButtons");
  displayElementById("file");
  //displayElementById("audio");
  var audio = getElementById("audio");
  audio.load();
  //audio.play();
}

function closeFile(id) {
  hidePreviousFile();
}

function hidePreviousFile() {
  console.log("Hiding previous file.");
  hideElementById("file");
  hideElementById("audio");
}

// Check if the "file" is a true file or a folder
function checkFile(file, addFolder, addFile) {
  if (isTrashed(file)) {
    if (isFolder(file)) {
      addFolder(file);
    } else {
      addFile(file);
    }
  }
  if (PREVIOUS_FOLDER.length === 0) {
    hideElementById("loadSongs");
  }
};

function sortFiles(addFolder, addFile) {
  for (var i = 0; i < FILE_LIST.length; i++) {
    checkFile(FILE_LIST[i], addFolder, addFile);
  }
  hideElementById("loading");
}

function roundToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}

function calculateFileSize(bytes) {
  var kiloByte = 1024;
  var megaByte = 1048576;
  var gigaByte = 1073741824;
  var fileSize = bytes;
  if (bytes < kiloByte) {
    fileSize += " bytes";
  } else if (bytes < megaByte) {
    fileSize = roundToTwoDecimals(bytes/kiloByte) + " KB";
  } else if (bytes < gigaByte) {
    fileSize = roundToTwoDecimals(bytes/megaByte) + " MB";
  } else {
    fileSize = roundToTwoDecimals(bytes/gigaByte) + " GB";
  }
  return fileSize;
}

function isTrashed(file) {
  return file.explicitlyTrashed === false;
}

function isFolder(file) {
  return file.mimeType == "application/vnd.google-apps.folder";
}

function showAddCommentButton() {
  displayElementById("addCommentButton");
}

function hideAddCommentButton() {
  var input = document.getElementById('commentInput');
  if (input.value.length == 0) {
    hideElementById("addCommentButton");
  }

}

