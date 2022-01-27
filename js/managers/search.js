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
