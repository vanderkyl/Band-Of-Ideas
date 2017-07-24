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
}
