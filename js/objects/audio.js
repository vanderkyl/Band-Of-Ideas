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

function quitPlayer() {
    document.title = "BoI";
    pauseAudioFromPlayer();
    hideElementById("audioPlayer");
    hideElementById("footer");
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
