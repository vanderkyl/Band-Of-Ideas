var wavesurfer;

var selectedRegion;

var regionCommentDisplayed = false;

function loadFileWaveSurfer(time, callback) {
  displayElementById("idea");
  hideElementById("ideaLoading");
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'darkslategrey',
    progressColor: 'darkcyan',
    autoCenter: true,
    cursorColor: '#444',
    barWidth: 2,
    plugins: [ WaveSurfer.regions.create({})],
    responsive: true
  });
  wavesurfer.load(CURRENT_FILE.link);

  wavesurfer.on('ready', function() {
    hideElementById("waveformLoader");
    wavesurfer.enableDragSelection({
      color: '#1f9e216b',
      data: {isNew: true}
    });
    for (var i = 0; i < CURRENT_FILE.highlights.length; i++) {
      if (CURRENT_FILE.highlights[i].highlightTime !== "0") {
        var highlightTime = parseFloat(CURRENT_FILE.highlights[i].highlightTime);
        var endTime = parseFloat(CURRENT_FILE.highlights[i].endTime);
        wavesurfer.addRegion({
          start: highlightTime,
          end: endTime,
          data: {comment: CURRENT_FILE.highlights[i].comment,
            user: CURRENT_FILE.highlights[i].userName,
            commentTime: CURRENT_FILE.highlights[i].commentTime,
            isNew: false}
        });
      }

    }
    time = parseFloat(time);
    playWave(time);
    callback();
  });

}

function loadWaveSurferEvents() {
  wavesurfer.on('region-created', function(region) {
    updateSelectedRegion(region);
  });

  wavesurfer.on('region-updated', function(region) {
    updateSelectedRegion(region);
  });

  wavesurfer.on('region-click', function(region) {
    //closeHighlighter();
    //selectedRegion = region;
    updateSelectedRegion(region);
    showUserComment(region);
    //playRegion();
  });

  wavesurfer.on('region-dblclick', function(region) {
    updateSelectedRegion(region);
    playRegion();
  });

  wavesurfer.on('region-in', function(region) {

    showUserComment(region);
  });

  wavesurfer.on('region-out', function(region) {
    hideUserComment();
  });

  wavesurfer.on('region-mouseenter', function(region) {
    //getElementById("highlightCommentUser").innerText = region.data.user;
    //getElementById("highlightCommentText").innerText = region.data.comment;
    //showUserComment();
  });

  wavesurfer.on('region-mouseleave', function(region) {
    //hideUserComment();
  });

  wavesurfer.on('audioprocess', function() {
    getElementById("audioTime").innerText = timeToString(getCurrentWaveTime()) + " / " + timeToString(getWaveDuration());
  });

  $("#regionStartInput").change(function() {
    var start = getRegionStartValue();
    resizeRegionStart(start, selectedRegion.start);
  });

  $("#regionEndInput").change(function() {
    var end = getRegionEndValue();
    resizeRegionEnd(end, selectedRegion.end);
  });

  /*
  $(window).resize(_.debounce(function(){
    wavesurfer.drawer.containerWidth = wavesurfer.drawer.container.clientWidth;
    wavesurfer.drawBuffer();
  }, 500));
  */
}

function updateSelectedRegion(region) {
  selectedRegion = region;
  setRegionStart(region.start);
  setRegionEnd(region.end);
  setRegionComment(region.data.comment);
  setRegionId(region.id);
  displayElementById("highlighter");
}

function getCurrentWaveTime() {
  return wavesurfer.getCurrentTime();
}

function getWaveDuration() {
  return parseFloat(wavesurfer.getDuration());
}

function createNewRegion() {
  selectedRegion = wavesurfer.addRegion({
    start: getCurrentWaveTime(),
    end: getCurrentWaveTime() + 30,
    data: {comment: "", isNew: true},
    color: '#1f9e216b',
  });
}

function setRegionStart(start) {
  start = roundToTwoDecimals(parseFloat(start));
  getElementById("regionStartInput").value = start;
}

function getRegionStartValue() {
  return parseFloat(getElementById("regionStartInput").value);
}

function setRegionEnd(end) {
  end = roundToTwoDecimals(parseFloat(end));
  getElementById("regionEndInput").value = end;
}

function getRegionEndValue() {
  return parseFloat(getElementById("regionEndInput").value);
}

function setRegionComment(comment) {
  getElementById("commentInput").value = comment;
}

function getRegionCommentValue() {
  return getElementById("commentInput").value;
}

function setRegionId(id) {
  getElementById("regionId").value = id;
}

function getRegionIdValue() {
  return getElementById("regionId").value;
}

function resizeRegionStart(newStart, oldStart) {
  selectedRegion.onResize(newStart - oldStart, 'start');
}

function resizeRegionEnd(newEnd, oldEnd) {
  selectedRegion.onResize(newEnd - oldEnd);
}

function removeRegion() {
  selectedRegion.remove();
  hideElementById("highlighter");
  getElementById("highlightButton").innerHTML = "<i class='far fa-bookmark'></i>";
}

function playRegion() {
  hideElementById("play-btn");
  displayElementInlineById("pause-btn");
  selectedRegion.play();
}

function playWave() {
  hideElementById("play-btn");
  displayElementInlineById("pause-btn");
  wavesurfer.play();
}

function playWave(time) {
  hideElementById("play-btn");
  displayElementInlineById("pause-btn");
  wavesurfer.play(time);
}

function pauseWave() {
  hideElementById("pause-btn");
  displayElementInlineById("play-btn");
  wavesurfer.pause();
}

function rewindWave() {
  wavesurfer.skip(-5);
}

function skipWave() {
  wavesurfer.skip(5);
}

function addToStartTime() {
  var start = getRegionStartValue();
  var end = getRegionEndValue();
  var newStart = start + 1;
  if (newStart < end) {
    resizeRegionStart(newStart, start);
    setRegionStart(newStart);
  }
}

function subtractStartTime() {
  var start = getRegionStartValue();
  var newStart = start - 1;
  if (newStart <= 0) {
    newStart = 0;
  }
  resizeRegionStart(newStart, start);
  setRegionStart(newStart);
}

function addToEndTime() {
  var duration = getWaveDuration();
  var end = getRegionEndValue();
  var newEnd = end + 1;
  if (newEnd > duration) {
    newEnd = duration;
  }
  resizeRegionEnd(newEnd, end);
  setRegionEnd(newEnd);
}

function subtractEndTime() {
  var start = getRegionStartValue();
  var end = getRegionEndValue();
  var newEnd = end - 1;
  if (newEnd > start) {
    resizeRegionEnd(newEnd, end);
    setRegionEnd(newEnd);
  }
}

function highlighterIsDisplayed() {
  return getElementById("highlighter").style.display === "block";
}

function showUserComment(region) {
  getElementById("highlightCommentUser").innerText = region.data.user;
  getElementById("highlightCommentText").innerText = region.data.comment;
  if (!regionCommentDisplayed) {
    regionCommentDisplayed = true;
    $("#highlightComment").fadeIn('fast');
  }

}

function hideUserComment() {
  regionCommentDisplayed = false;
  $("#highlightComment").fadeOut('fast');
}

function closeHighlighter() {
  if (selectedRegion !== undefined) {
    if (selectedRegion.data.isNew) {
      removeRegion();
    }
    setRegionStart(0);
    setRegionEnd(0);
    setRegionComment("");
    setRegionId("");
    hideElementById('highlighter');
  }

}

function destroyWave() {
  if (wavesurfer !== undefined) {
    if (wavesurfer.isPlaying()) {
      wavesurfer.destroy();
    }
  }
}