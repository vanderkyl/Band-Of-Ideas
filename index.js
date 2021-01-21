//import { analyze } from 'web-audio-beat-detector';

// Getting Audio Buffer from audio
var context = new (window.AudioContext || window.webkitAudioContext)();

//fetchAudioBuffer(audioSrc)

function fetchAudioBuffer (url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () { onSuccess(request) }
    request.send()
}

function onSuccess (request) {
    var audioData = request.response;
    analyze(audioData)
        .then((tempo) => {
            // the tempo could be analyzed
            console.log("Tempo: " + tempo);
        })
        .catch((err) => {
            // something went wrong
        });
    //context.decodeAudioData(audioData, onBuffer, onDecodeBufferError)
}

function onBuffer (buffer) {
    var source = context.createBufferSource();
    console.info('Got the buffer', buffer);
    source.buffer = buffer;
    source.connect(context.destination);
    source.loop = true;
    source.start()
}

function onDecodeBufferError (e) {
    console.log('Error decoding buffer: ' + e.message);
    console.log(e);
}
