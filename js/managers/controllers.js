function setupController() {
  console.log("Setting up controller");
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
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
  showElementById("appLoader");
}

function hideAppLoader() {
  hideElementById("appLoader");
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

