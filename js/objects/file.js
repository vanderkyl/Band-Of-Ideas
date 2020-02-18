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

function addToStartTime() {
  var start = getRegionStartValue();
  var end = getRegionEndValue();
  var newStart = start + 1;
  if (newStart < end) {
    setRegionStart(newStart);
  }
}

function subtractStartTime() {
  var start = getRegionStartValue();
  var newStart = start - 1;
  if (newStart <= 0) {
    newStart = 0;
  }
  setRegionStart(newStart);
}

function hideCommentBar() {
  hideElementById("commentInputDiv");
  displayElementById("commentButton");
}

function closeHighlighter() {
  setRegionStart(0);
  setRegionComment("");
  hideElementById('highlighter');
  hideCommentBar();
  getElementById("highlightButton").style.border = "none";
}

function setRegionComment(comment) {
  getElementById("commentInput").value = comment;
}

function getRegionCommentValue() {
  return getElementById("commentInput").value;
}

function setRegionStart(start) {
  start = roundToTwoDecimals(parseFloat(start));
  getElementById("regionStartInput").value = start;
}

function getRegionStartValue() {
  return parseFloat(getElementById("regionStartInput").value);
}

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

function showPlayerButton(file) {
  var id = $(file).data("index").toString();
  if (CURRENT_SELECTED_FILE.id !== undefined) {
    if (CURRENT_SELECTED_FILE.id !== id) {
      showPlayerButtonById(id);
    }
  } else {
    showPlayerButtonById(id);
  }
}

function showPlayerButtonById(id) {
  hideElementById("fileIndex-" + id);
  hideElementById("filePause-" + id);
  hideElementById("filePlay-" + id);
  displayElementById("fileStart-" + id);
}

function hidePlayerButton(file) {
  var id = $(file).data("index").toString();
  if (CURRENT_SELECTED_FILE.id !== undefined) {
    if (CURRENT_SELECTED_FILE.id !== id) {
      hidePlayerButtonByFileId(id);
    }
  } else {
    hidePlayerButtonByFileId(id);
  }
}

function hidePlayerButtonByFileId(id) {
    hideElementById("filePlay-" + id);
    hideElementById("filePause-" + id);
    hideElementById("fileStart-" + id);
    displayElementById("fileIndex-" + id);
}

function showPauseButton(file) {
  if (CURRENT_SELECTED_FILE.id !== undefined) {
    hidePlayerButtonByFileId(CURRENT_SELECTED_FILE.id)
  }
  hideElementById("fileIndex-" + file.id);
  hideElementById("fileStart-" + file.id);
  displayElementById("filePause-" + file.id);
}

function showPlayButton(file) {
  hideElementById("filePause-" + file.id);
  displayElementById("filePlay-" + file.id);
}