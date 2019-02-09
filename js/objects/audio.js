

function playAudio() {
    getElementById("audio").play();
}

function pauseAudio() {
    getElementById("audio").pause();
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

function checkTime() {
    var audio = getElementById("audio");
    alert(audio.currentTime);
}

function openMiniAudioPlayer(id, name) {
    var trackName = getElementById("trackName");
    trackName.innerHTML = name;
    trackName.href = "/#/idea?id=" + id;

    displayElementById("audioPlayer");
    var footer = getElementById("footer");
    footer.style.height = "160px";
    hideElementById("playButton");
    displayElementInlineById("pauseButton");
    getElementById("audioPlayerAudio").load();
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
    document.title = "BoI";
    pauseAudioFromPlayer();
    hideElementById("audioPlayer");
    var footer = getElementById("footer");
    footer.style.height = 0;
}

function timeToString(currentTime) {
  currentTime = Number(currentTime);
  var minutes = Math.floor(currentTime % 3600 / 60);
  var seconds = Math.floor(currentTime % 3600 % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function initProgressBar() {
  var audio = getElementById("audio");
  var percentComplete = (audio.currentTime / audio.duration) * 100;
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
    getElementById("audioPlayerTime").innerText = timeToString(audio.currentTime) + " / " + timeToString(audio.duration);
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



