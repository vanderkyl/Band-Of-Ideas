var results = [];
var resultClicked = false;

function showResult(str) {
  if (str.length==0) {
    hideResult();
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
        var folderHtml = "<span class='searchResultSubText'>" + files[i].folderName + "</span>";
        var bandHtml = "<span class='searchResultSubText'>" + files[i].bandName + " - </span>";
        fileHtml += "<div class='fileSearchButton' onclick='openFile(" + files[i].id + ")'>" + files[i].name + "  " + bandHtml + folderHtml + "</div>";
      }
      document.getElementById("livesearch").innerHTML= fileHtml;
      document.getElementById("livesearch").style.border="1px solid #A5ACB2";
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

function openFile(id) {
    console.log("Opening File");

    navigateToURL("/#/idea?id=" + id);
}

function hideResult() {
    //results = document.getElementById("livesearch").innerHTML;
    document.getElementById("livesearch").innerHTML = "";
    document.getElementById("livesearch").style.border = "0px";
}

function showResults() {
    //document.getElementById("livesearch").innerHTML = results;
    document.getElementById("livesearch").style.border="1px solid #A5ACB2";

}
