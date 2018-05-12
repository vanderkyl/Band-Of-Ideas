var CURRENT_USER = {}; // This is the current user that is logged in
var CURRENT_BAND = {};
var CURRENT_BANDS = [];
var CURRENT_FOLDERS = "";
var CURRENT_FOLDER = "";
var CURRENT_FILES = "";
var CURRENT_FILE = {};
var REQUESTED_URL = "";
var loggedIn = false;
var signedOut = false;
var lastUrl = window.location.href;

function loginUser() {
  //saveItemToLocalStorage("*loggedIn*", JSON.stringify(user));
  //hideAuthenticationUI();
  loggedIn = true;
  displayElementById("navLinks");
  hideElementById("signInButton");
  displayElementById("signOutButton");
  navigateToURL("/#/user");
}

function hideAuthenticationUI() {
  hideElementById("authentication");
  displayElementById("accountInformation");

}

function signOut() {
  loggedIn = false;
  signedOut = true;
  clearAccountData();
  removeNavLink("folderLink");
  removeNavLink("bandLink");
  hideElementById("navLinks");
  hideElementById("signOutButton");
  displayElementById("signInButton");
  navigateToURL("/#/logout");
};

function clearAccountData() {
  CURRENT_FILE = "";
  CURRENT_FILES = "";
  CURRENT_FOLDER = "";
  CURRENT_FOLDERS = "";
  CURRENT_BANDS = "";
  CURRENT_BAND = "";
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

function bandIsValid(bandName) {
  if (bandName == "") {
    console.log("Please give a band name.");
    showInvalidInput("bandName");
    return false;
  }
  var bandList = getBandList();
  for (band in bandList) {
    if (band === bandName) {
      console.log("Sorry, " + bandName + " has already been taken.");
      showInvalidInput("bandName");
      return false;
    }
  }
  return true;
}

function openJoinBandForm() {
  displayElementById("signUpForm");
  displayElementById("startBandForm");
  hideElementById("startBand");
  hideElementById("signInForm");
  //displayElementById("startSignIn");
}

function openSignInForm() {
  displayElementById("signInForm");
  //displayElementById("startBandForm");
  //hideElementById("startBand");
  hideElementById("signUpForm");
  hideElementById("startBandForm");
}

function checkEmail(email, userEmail) {
  if (email === userEmail) {
    return true;
  } else {
    console.log("User does not exist");
    showInvalidInput("signUpEmail");
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
    REQUESTED_URL = window.location.href;
    navigateToURL("/#/");
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
