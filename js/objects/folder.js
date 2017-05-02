var PREVIOUS_FOLDER_BUTTON = "PREV_BUTTON";
var PREVIOUS_FOLDER = [];
var RECENT_FOLDER = {};

function getFolder(folder) {
  var folderObject = {
    name: folder.title,
    id: folder.id
  };
  return folderObject;
}

function getPreviousButton() {
  var button = {
    name: "GO BACK",
    id: PREVIOUS_FOLDER_BUTTON
  };
  return button;
}

function requestingPreviousFolder(folderId) {
  return folderId === PREVIOUS_FOLDER_BUTTON;
}

function cacheFolder(folderId, recentFiles, files) {
  console.log("Folder saved: " + folderId);
  recentFiles[folderId] = files;
}

function folderIsCached(folderId, recentFiles) {
  console.log("Checking if folder is cached: " + folderId);
  var isFolderCached = folderId in recentFiles;
  console.log("Folder cached: " + isFolderCached);
  return isFolderCached;
}

function loadFolder(folderId, loadFiles, getFiles, wait) {
  checkIfAudioIsPlaying();
  if (requestingPreviousFolder(folderId)) {
    hidePreviousFile();
    FILE_LIST = PREVIOUS_FOLDER.pop();
    getFiles();
  } else if (folderIsCached(folderId, RECENT_FOLDER)) {
    PREVIOUS_FOLDER.push(FILE_LIST);
    listCachedFiles(folderId, RECENT_FOLDER);
    wait(loadFiles);
  } else {
    displayElementById("loading");
    PREVIOUS_FOLDER.push(FILE_LIST);
    listFiles(folderId, RECENT_FOLDER);
    console.log("Files are loading. Please wait...");
    wait(loadFiles);
  }
}
