function setupController() {
  console.log("Setting up controller");
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
  //hideAppLoader();
}


function showAppLoader() {
    displayElementById("appLoader");
    getElementById("appLoader").style.opacity = "1";
    hideBody();
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

/*
function showAppLoader() {
  hideElementById("appContainer");
  $('document').ready(function() {
    $(window).scrollTop(0);
  });
  displayElementById("loadContainer");
}

function hideAppLoader() {
  hideElementById("loadContainer");
  displayElementById("appContainer");
}
*/

function updateFileViews(http, file) {
  file.views++;
  http.post("/php/updateFile.php?type=views", file)
      .then(
          function (response) {
            console.log(response.data);
          },
          function (response) {
            console.log(response.data);
          });
};

