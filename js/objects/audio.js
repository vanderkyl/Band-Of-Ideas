
// Page Elements

var audioPlayerTrack = getElementById("audioPlayerPercentageBar");
var audioPlayerTimeline = getElementById("audioPlayerTimeline");
var audioTimeline = getElementById("audioTimeline");
var audioTrack = getElementById("audioFilePercentageBar");
var audioPlayer = getElementById("audioPlayerAudio");
var audio = getElementById("audio");
var miniAudioPlayer = getElementById("audioPlayer");
var currentFileId = 0;

function setupAudioEventListeners() {
  // -- EVENT LISTENERS -- // ----------------------------------------
  audioPlayerTimeline.addEventListener("click", function (event) {
    hideElementById("playButton");
    displayElementInlineById("pauseButton");
    moveplayhead(event, audioPlayerTimeline, audioPlayerTrack);
    audioPlayer.currentTime = audioPlayer.duration * clickPercent(event, audioPlayerTimeline);
  }, false);


  // -- END OF EVENT LISTENERS -- // ----------------------------------------
}

function playAudio() {
    getElementById("audio").play();
    hideElementById("play-btn");
    displayElementInlineById("pause-btn");
    hideElementById("filePaused-" + CURRENT_USER.id);
    displayElementInlineById("filePlaying-" + CURRENT_USER.id);
}

function pauseAudio() {
    getElementById("audio").pause();
    hideElementById("pause-btn");
    displayElementInlineById("play-btn");
    hideElementById("filePlaying-" + CURRENT_USER.id);
    displayElementInlineById("filePaused-" + CURRENT_USER.id);
}

function playAudioFromPlayer() {
    getElementById("audioPlayerAudio").play();
    hideElementById("playButton");
    displayElementInlineById("pauseButton");
}

function pauseAudioFromPlayer() {
    getElementById("audioPlayerAudio").pause();
    hideElementById("pauseButton");
    displayElementInlineById("playButton");

}

function highlightCurrentIdea() {
  $("#file-" + CURRENT_FILE.id).addClass("playListFileSelected");
  hideElementById("fileIndex-" + CURRENT_FILE.id);
  displayElementInlineById("filePlaying-" + CURRENT_FILE.id);
}

function checkTime() {
    var audio = getElementById("audio");
    alert(audio.currentTime);
}

function openMiniAudioPlayer(id, name) {
    collapsePlayer();
    currentFileId = id;
    var trackName = getElementById("trackName");
    trackName.innerHTML = name;
    trackName.href = "/#/idea?id=" + id;
    var footer = getElementById("footer");
    footer.style.height = "115px";
    var audioPlayer = getElementById("audioPlayerAudio");

    audioPlayer.load();

    audioPlayer.addEventListener("durationchange", function (event) {
        displayElementById("audioPlayerTime");
        audioPlayer.addEventListener("ended", function (event) {
          playNext(true);
        });
    }, false);
    setAudioInfo();
    displayElementById("audioPlayer");

    hideElementById("playButton");
    displayElementInlineById("pauseButton");


}

function openMiniPlayer(id, name, source, time) {
    var audio = getElementById("audio");
    if (audio != null) {
        audio.pause();
    }
    getElementById("audioPlayerSource").src = source;
    getElementById("audioPlayerAudio").currentTime = time;
    openMiniAudioPlayer(id, name);
}

function quitPlayer() {
    pauseAudioFromPlayer();
    collapsePlayer();
    hideElementById("audioPlayer");
    hideElementById("audioPlayerTime");
    var footer = getElementById("footer");
    footer.style.height = 0;
}

function expandPlayer() {
    var footer = getElementById("footer");
    footer.style.height = "100%";
    displayElementById("audioInfo");
    hideElementById("expandPlayerButton");
    displayElementById("collapsePlayerButton");
}

function collapsePlayer() {
    var footer = getElementById("footer");
    footer.style.height = "115px";
    hideElementById("audioInfo");
    hideElementById("collapsePlayerButton");
    displayElementById("expandPlayerButton");
}

function setAudioInfo() {
    var nextSong = getNextSong(true);
    if (nextSong !== undefined) {
        getElementById("nextSong").innerText = nextSong.name;
    }
    var prevSong = getPreviousSong(true);
    if (prevSong !== undefined) {
        getElementById("previousSong").innerText = prevSong.name;
    }

  var songList = $("#songList");
  for (var i = 0; i < CURRENT_FILES.length; i++) {
      songList.append('<p>' + CURRENT_FILES[i].name + '</p>');
  }
}

function timeToString(currentTime) {
  if (currentTime === "0" || currentTime === undefined) {
    return " - ";
  } else {
    currentTime = Number(currentTime);
    var minutes = Math.floor(currentTime % 3600 / 60);
    var seconds = Math.floor(currentTime % 3600 % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

}

function initProgressBar() {
  var audio = getElementById("audio");
  var percentComplete = (audio.currentTime / audio.duration) * 100.0;
  //Do something with upload progress
  var filePercentageBar = getElementById("audioFilePercentageBar");
  filePercentageBar.style.width = percentComplete + "%";
  getElementById("audioTime").innerText = timeToString(audio.currentTime) + " / " + timeToString(audio.duration);
}

function initPlayerProgressBar() {
    var audio = getElementById("audioPlayerAudio");
    var percentComplete = (audio.currentTime / audio.duration) * 100;
    //Do something with upload progress
    var filePercentageBar = getElementById("audioPlayerPercentageBar");
    filePercentageBar.style.width = percentComplete + "%";
    var time = timeToString(audio.currentTime) + " / " + timeToString(audio.duration);
    getElementById("audioPlayerTime").innerText = time;
    getElementById("trackName").href = "/#/idea?id=" + currentFileId + "&time=" + audio.currentTime;
}

// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}
// Start of Audio Track Code //


function clickPercent(event, audioTimeline) {
    var timelineWidth = window.getComputedStyle(audioTimeline, null).width;
    timelineWidth = timelineWidth.substring(0, timelineWidth.length - 2);
    timelineWidth = parseInt(timelineWidth) ;
    var value = (event.clientX - getPosition(audioTimeline)) / timelineWidth;
    return value;
}

function moveplayhead(event, audioTimeline, audioTrack) {
    var newMargLeft = event.clientX - getPosition(audioTrack);
    var timelineWidth = audioTimeline.style.width;
    if (newMargLeft >= 0 && newMargLeft < timelineWidth) {
        audioTrack.style.width = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        audioTrack.style.width = "0px";
    }
    if (newMargLeft == timelineWidth) {
        audioTrack.style.width = timelineWidth + "px";
    }

}


// End of Audio Track Code //

function rewind(audio) {
    if (audio.currentTime <= 5) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = audio.currentTime - 5;
    }
}

function fastForward(audio) {
    if (audio.currentTime >= audio.duration - 5) {
        audio.currentTime = audio.duration;
    } else {
        audio.currentTime = audio.currentTime + 5;
    }
}

function playPrevious(loop) {
    var file = getPreviousSong(loop);;
    openMiniPlayer(file.id, file.name, file.link, 0);
}

function playNext(loop) {
    var file = getNextSong(loop);;
    openMiniPlayer(file.id, file.name, file.link, 0);
}

function getNextSong(loop) {
  var song;
  var index = 0;
  for (var i = 0; i < CURRENT_FILES.length; i++) {
    if (CURRENT_FILES[i].id === currentFileId) {
        index = i + 1;
    }
  }

  if (index >= CURRENT_FILES.length) {
    if (loop) {
      song = CURRENT_FILES[0];
    }
  } else {
    song = CURRENT_FILES[index];
  }
  return song;
}

function getPreviousSong(loop) {
  var song;
  var index = 0;
  for (var i = 0; i < CURRENT_FILES.length; i++) {
    if (CURRENT_FILES[i].id === currentFileId) {
      index = i - 1;
    }
  }

  if (index < 0) {
    if (loop) {
      song = CURRENT_FILES[CURRENT_FILES.length - 1];
    }
  } else {
    song = CURRENT_FILES[index];
  }
  return song;
}
