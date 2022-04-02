var results = [];
var resultClicked = false;

function showResult(str, searchId) {
  if (str.length==0) {
    hideResult(searchId);
    results = "";
    return;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      var files = JSON.parse(this.responseText);
      results = files;
      var fileHtml = "";
      for (var i = 0; i < files.length; i++) {
        var nameHtml = "<span class='col-xs-4' style='text-align: left; padding: 0;'> " + files[i].name + "</span>";
        var folderHtml = "<span class='searchResultSubText col-xs-4' style='text-align: right; padding: 0;'>" + files[i].folderName + "</span>";
        var bandHtml = "<span class='searchResultSubText col-xs-4' style='text-align: right; padding: 0;'>" + files[i].bandName + "</span>";
        fileHtml += "<div class='fileSearchButton col-xs-12' onclick='openFile(" + files[i].id + ")'>" + nameHtml + bandHtml + folderHtml + "</div>";
      }
      document.getElementById(searchId).innerHTML= fileHtml;
      document.getElementById(searchId).style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","/php/livesearch.php?q=" + str + "&bandId=" + CURRENT_BAND.id, true);
  xmlhttp.send();
}

function showIdeaResult(str, searchId, currentSongIdeas) {
  if (str.length==0) {
    hideResult(searchId);
    results = "";
    return;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      var files = JSON.parse(this.responseText);
      results = files;

      var fileHtml = "";
      for (var i = 0; i < files.length; i++) {
        var link = "/#/idea?id=" + files[i].id;
        var ideaHtml = "<div id='ideaAddButton-" + files[i].id + "'class='playlistDetailsButton btn btn-default col-xs-3' onclick='addToSong(" + files[i].id + ")'>Add Idea</div><div id='ideaAdded-" + files[i].id + "' class='playlistDetailsButton col-xs-3' style='display: none; padding top: 8px'>Added</div>";
        for (var j = 0; j < currentSongIdeas.length; j++)
        if (files[i].id === currentSongIdeas[j].id) {
          ideaHtml = "<div id='ideaAddButton-" + files[i].id + "'class='playlistDetailsButton btn btn-default col-xs-3' style='display: none' onclick='addToSong(" + files[i].id + ")'>Add Idea</div><div id='ideaAdded-" + files[i].id + "' class='playlistDetailsButton col-xs-3' style='padding top: 8px'>Added</div>";
        }
        fileHtml += "<div class='playlistButton col-xs-12'><div class='playlistDetails col-xs-6'><div>" + files[i].name + "</div></div><div class='playlistDetailsButton btn btn-default col-xs-3' onclick='navigateToURL('" + link + "')'>Open</div>" + ideaHtml + "</div>";
      }
      document.getElementById(searchId).innerHTML= fileHtml;

      //document.getElementById(searchId).style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","/php/livesearch.php?q=" + str + "&bandId=" + CURRENT_BAND.id, true);
  xmlhttp.send();
}

function getRecommendedFiles(str, searchId) {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      var files = JSON.parse(this.responseText);
      return files
    }
  }
  xmlhttp.open("GET","/php/livesearch.php?q=" + str + "&bandId=" + CURRENT_BAND.id, true);
  xmlhttp.send();
}

function openSearchFolder() {
    var str = getElementById("searchInput").value;
        hideResult();
        results = "";

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            CURRENT_FILES = JSON.parse(this.responseText);
            CURRENT_FOLDER = {
                name: "Search Results",
                metaName: "search-results",
            };
            CURRENT_BAND = {
                name: "My Bands",
                metaName: "my-bands"
            };
            navigateToURL("/#/files");
        }
    }
    xmlhttp.open("GET","/php/getFiles.php?type=search&str=" + str, true);
    xmlhttp.send();
}

function showSearchForm() {
    if ($(document).width() < 505) {
        hideElementById("brand");
    }
    hideElementById("showSearch");
    displayElementInlineById("search");
    displayElementInlineById("closeSearch");
}

function closeSearchForm() {
    hideElementById("closeSearch");
    hideElementById("search");
    displayElementInlineById("showSearch");
    displayElementInlineById("brand");
}

function showLargeSearchForm() {
    hideElementById("showLargeSearch");
    displayElementInlineById("largeSearchForm");
    displayElementInlineById("closeLargeSearch");
}

function closeLargeSearchForm() {
    hideElementById("closeLargeSearch");
    hideElementById("largeSearchForm");
    displayElementInlineById("showLargeSearch");
}

function openFile(id, time) {
    console.log("Opening File");
    if (time) {
      navigateToURL("/#/idea?id=" + id + "&time=" + time);
    } else {
      navigateToURL("/#/idea?id=" + id);
    }

}

function hideResult(searchId) {
    //results = document.getElementById("livesearch").innerHTML;
    document.getElementById(searchId).innerHTML = "";
    document.getElementById(searchId).style.border = "0px";
}

function showResults() {
    //document.getElementById("livesearch").innerHTML = results;
    document.getElementById("livesearch").style.border="1px solid #A5ACB2";

}
