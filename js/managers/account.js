var CURRENT_USER = {}; // This is the current user that is logged in
var CURRENT_BAND = {};
var CURRENT_BANDS = [];
var CURRENT_FOLDERS = [];
var CURRENT_FOLDER = {};
var CURRENT_FILES = [];
var CURRENT_FILE = {};
var CURRENT_SELECTED_FILE = {};
var CURRENT_FILE_INDEX = 0;
var CURRENT_MEMBERS = [];
var CURRENT_PLAYLISTS = [];
var CURRENT_PLAYLIST = {};
var ACTIVITY_COUNTS =  [];
var REQUESTED_URL = "";
var LAST_URL = "";
var LAST_PATHNAME = "";

var testUserName = "testerboi";
var testLogin = false;
var loggedIn = false;
var signedOut = false;
var bandListFilled = false;

function loginUser() {
  bandListFilled = false;
  loggedIn = true;

  loadApp(function() {
    hideAppLoader();
  });
}

function loadApp(callback) {
  showAppLoader();
  navigateToURL("/#/dashboard");
  hideAppLoader();
}

function goToLastURL() {
  loggedIn = true;
  hideBody();
  navigateToURL(LAST_URL);
  showNavs();
  showBody();
}

function showNavs() {
  displayElementById("sideNav");
  displayElementById("navLinks");
  displayElementById("showSearch");
  displayElementById("sideNavButton");
  displayElementById("navBar");
  displayElementById("signOutButton");
}

function signOut() {
  loggedIn = false;
  signedOut = true;
  bandListFilled = false;
  removeNavLink("folderLink");
  removeNavLink("bandLink");
  hideElementById("footer");
  hideElementById("sideNav");
  hideElementById("navBar");
  hideElementById("searchNavContainer");
  displayElementById("navContainer");
  hideElementById("search");
  hideElementById("showSearch");
  hideElementById("closeSearch");
  getElementById("sideNav").style.width = 0;
  hideElementById("sideNavButton");
  hideElementById("navLinks");
  hideElementById("signOutButton");
  navigateToURL("/#/logout");
};

function clearAccountData() {
  CURRENT_USER = {}; // This is the current user that is logged in
  CURRENT_BAND = {};
  CURRENT_BANDS = [];
  CURRENT_FOLDERS = [];
  CURRENT_FOLDER = {};
  CURRENT_FILES = [];
  CURRENT_FILE = {};
  CURRENT_SELECTED_FILE = {};
  CURRENT_MEMBERS = [];
  CURRENT_PLAYLISTS = [];
  CURRENT_PLAYLIST = {};
  REQUESTED_URL = "";
  LAST_URL = "";
  LAST_PATHNAME = "";
}

function passwordsMatch(password, passwordAgain) {
  console.log(password);
  var valid = true;
  if (password == "") {
    console.log("Please give a password.");
    showInvalidInput("signUpPassword");
    valid = false;
  }
  if (passwordAgain == "") {
    console.log("Please match your given password.");
    showInvalidInput("passwordAgain");
    valid = false;
  }
  if (password === passwordAgain && valid) {
    return true;
  } else {
    showInvalidInput("passwordAgain");
    console.log("Sorry, your passwords do not match.");
    return false;
  }
}

function checkName(name) {
  var valid = true;
  if (name == "") {
    console.log("Please give your name.");
    showInvalidInput("name");
    valid = false;
  }
  return valid;
}

function openJoinBandForm() {
  displayElementById("signUpForm");
  displayElementById("startBandForm");
  hideElementById("startBand");
  hideElementById("signInForm");
  displayElementById("startSignIn");
}

function checkUsername(username, userUsername) {
  if (username === userUsername) {
    return true;
  } else {
    console.log("User does not exist");
    showInvalidInput("signUpUsername");
    return false;
  }
}

function checkPassword(password, userPassword) {
  if (password === userPassword) {
    console.log("Passwords match");
    return true;
  } else {
    console.log("Incorrect password");
    showInvalidInput("signInPassword");
    return false;
  }
}

function showInvalidInput(id) {
  var input = getElementById(id);
  input.value = "";
  input.style = "box-shadow: 0 0 10px red; border-color: red;";
  if (id === "signInUsername") {
    showInvalidUsernameMessage();
  } else if (id === "signInPassword") {
    showInvalidPasswordMessage();
  }
}

function showInvalidUsernameMessage() {
  var message = getElementById('userMessageText');
  message.innerText = "Invalid Username"
  openUserMessage();
}

function showInvalidPasswordMessage() {
  var message = getElementById('userMessageText');
  message.innerText = "Invalid Password"
  openUserMessage();
}

function showInvalidUserMessage(user) {
  var message = getElementById('userMessageText');
  message.innerText = "The user, " + user + ", doesn't exist..."
  openUserMessage();
}

function closeUserMessage() {
  var message = getElementById('userMessage');
  message.style.height = "0px";
  message.style.fontSize = "0px";
}

function openUserMessage() {
  var message = getElementById('userMessage');
  message.style.height = "70px";
  message.style.fontSize = "12px";
}

function inputEmpty(input, inputId) {
  if (input === "") {
    console.log("Please try again.");
    showInvalidInput(inputId);
    return true;
  } else {
    return false;
  }
}

function isLoggedIn() {
  if (!loggedIn) {
    LAST_URL = window.location.href;
    LAST_PATHNAME = window.location.pathname;
    navigateToURL("/#/login");
  } else {
    addBandLinks(CURRENT_BANDS);
  }
  return loggedIn;
}

function objectIsEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function generateMetaName(name) {
  name = name.toLowerCase().split(' ').join('_');
  return name;
}

function generateBandCode() {
  var code = Math.random().toString(36).substring(2, 6).toUpperCase();
  console.log("Generating code: " + code);
  return code;
}

function addBandLinks(bands) {
  if (!bandListFilled) {
    for (var i = 0; i < bands.length; i++) {
      $("#bandList").append('<div id="band' + bands[i].id + '" class="navButtons"><a href="/#/band?id=' + bands[i].id + '"><i class="fas fa-sitemap"></i></i><span>' + bands[i].name + '</span></a></div>');
    }
    bandListFilled = true;
  }
}
