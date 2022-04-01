function setupController() {
  console.log("Setting up controller");
  showAppLoader();
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  if (getElementById("topButtons") !== null) {
      getElementById("topButtons").style.backgroundColor = getBackgroundColor(getBackgroundColorId());
  }

  getElementById("userLink").innerText = CURRENT_USER.name;
  //showAppLoader();
  loadProfileImage();
  scrollToTop();
  //hideAppLoader();
}

function finishControllerSetup() {
  shortHideAppLoader();
}


function showAppLoader() {
    displayElementById("appLoader");
    getElementById("appLoader").style.opacity = "1";
    //hideNavs();
    hideBody();
}

function shortHideAppLoader() {
    showBody();
    getElementById("appLoader").style.opacity = "0";
    setTimeout(function() {
        hideElementById("appLoader");

    }, 750);
}

function hideAppLoader() {
    showNavs();
    showBody();
    setTimeout(function() {

        getElementById("appLoader").style.opacity = "0";
        setTimeout(function() {
            hideElementById("appLoader");

        }, 1000);
    }, 2000);
}

function updateFileViews(http, file) {
  file.views++;
  http.post("/php/updateFile.php?type=views&userId=" + CURRENT_USER.id, file)
      .then(
          function (response) {
            console.log(response.data);
          },
          function (response) {
            console.log(response.data);
          });
}

function addToSong(id) {
  var data = new FormData();
  data.append('songId', CURRENT_SONG.id);
  data.append('fileId', id);
  data.append('bandId', CURRENT_BAND.id);
  data.append('userId', CURRENT_USER.id);

    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    } else {  // code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
      if (this.readyState==4 && this.status==200) {
        console.log("Success");
        console.log(this.ResponseText);
        hideElementById("ideaAddButton-" + id);
        displayElementById("ideaAdded-" + id);
      }
    }
    xmlhttp.open("POST","/php/addToSong.php", true);
    xmlhttp.send(data);
  }
}
