function setupController() {
  console.log("Setting up controller");
  getElementById("userLink").innerText = CURRENT_USER.name;
  getElementById("userLinkImage").style += " backgroundImage: url('" + CURRENT_USER.userIcon + "')";
  destroyWave();
  showAppLoader();
}

function finishControllerSetup() {
  hideAppLoader();
}