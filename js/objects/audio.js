function checkIfAudioIsPlaying() {
    var audio = getElementById("audio");
    if (!audio.paused || (audio.currentTime != 0)) {
        displayElementById("audioPlayer");
    }
}

function playAudio() {
    getElementById("audio").play();
}

function pauseAudio() {
    getElementById("audio").pause();
}

function checkTime() {
    var audio = getElementById("audio");
    alert(audio.currentTime);
}

function quitPlayer() {
    pauseAudio();
    hideElementById("audioPlayer");
}