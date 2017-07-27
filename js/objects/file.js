var CURRENT_FILE = {};

function getFile(newFile, $sce) {
    var fileId = newFile.id;
    var fileObject = {
        name: getFriendlyTitle(newFile),
        id: fileId,
        path: $sce.trustAsResourceUrl(newFile.webContentLink),
        previewPath: $sce.trustAsResourceUrl("https://drive.google.com/file/d/" + fileId + "/preview"),
        type: newFile.fileExtension,
        size: calculateFileSize(newFile.fileSize),
        bytes: newFile.fileSize,
        likes: getLikes(fileId),
        views: getViews(fileId),
        timestamps: []
    };
    return fileObject;
}

function loadFilePage($sce) {
  var file = CURRENT_FILE;
  if (file.type === null) {
    //TODO Make sense of this shit

  } else {
    //TODO finish filling out the file properties
    console.log("Getting file from Google Drive");
    var fileId = getParameterByName("id");
      file = {
          name: fileId,
          id: fileId,
          path: $sce.trustAsResourceUrl("https://drive.google.com/file/d/" + fileId + "/preview"),
          previewPath: $sce.trustAsResourceUrl("https://drive.google.com/file/d/" + fileId + "/preview"),
          type: "m4a",
          size: "",
          bytes: "",
          likes: getLikes(fileId),
          views: getViews(fileId),
          timestamps: []
      };
  }
  console.log(file);
  displayElementById("file");
  hideElementById("authorize-div")
  loadDisqus(file);
  return file;
}

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
  scrollToElementById("folderButtons");
  displayElementById("file");
  displayElementById("audio");
  var audio = getElementById("audio");
  audio.load();
  audio.play();
}

function openMiniPlayer(id, name, source, time) {
  getElementById("audio").pause();
  getElementById("trackName").innerHTML = name;
  getElementById("audioPlayerSource").src = source;
  getElementById("audioPlayerAudio").currentTime = time;
  displayElementById("audioPlayer");
  displayElementById("footer");
  getElementById("audioPlayerAudio").load();
  hidePreviousFile();
  //scrollToElementById(id);
}

function closeFile(id) {
  hidePreviousFile();
}

function hidePreviousFile() {
  console.log("Hiding previous file.");
  hideElementById("file");
  hideElementById("audio");
  hideElementById("video");
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

function saveLike(file) {
    var likesId = "likes-" + file.id;
    var likes = parseInt(getItemFromLocalStorage(likesId));
    likes += 1;
    saveItemToLocalStorage(likesId, likes);
    file.likes = likes;
}

function getLikes(fileId) {
    var likesId = "likes-" + fileId;
    var fileLikes = getItemFromLocalStorage(likesId);
    console.log(fileLikes + " likes");
    if (fileLikes === null) {
        saveItemToLocalStorage(likesId, 0);
        return 0;
    } else {
        return fileLikes;
    }
}

function addViewToFile(file) {
    var viewsId = "views-" + file.id;
    var views = parseInt(getItemFromLocalStorage(viewsId));
    views += 1;
    saveItemToLocalStorage(viewsId, views);
    file.views = views;
}

function getViews(fileId) {
    var viewsId = "views-" + fileId;
    var views = getItemFromLocalStorage(viewsId);
    console.log(views + " views");
    console.log(fileId + " id")
    if (views === null) {
        saveItemToLocalStorage(viewsId, 0);
        return 0;
    } else {
        return views;
    }
}

function isTrashed(file) {
  return file.explicitlyTrashed === false;
}

function isFolder(file) {
  return file.mimeType == "application/vnd.google-apps.folder";
}

function getFriendlyTitle(file) {
    var title = file.title;
    console.log(title);
    if (file.fileExtension === "m4a") {
        title = title.replace('.m4a', '');
    } else if (file.fileExtension === "MP4") {
        title = title.replace('.MP4', '');
    }
    console.log(title);
    return title;
}
