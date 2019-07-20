function setupController() {
  console.log("Setting up controller");
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  getElementById("userLink").innerText = CURRENT_USER.name;
  loadProfileImage();
  destroyWave();
  showAppLoader();
}

function finishControllerSetup() {
  hideAppLoader();
}