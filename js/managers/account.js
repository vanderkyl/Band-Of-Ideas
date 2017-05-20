var bands = [];
var user = {}; // This is the current user that is logged in
var sqlUser = {}; // This is the user that will be checked against when signing up/in
var currentBand = {};
var currentFolders = "";
var loggedIn = false;

function saveUser(newUser) {
  user = newUser;
  bands = user.bands;
  console.log(user);
  saveItemToLocalStorage(newUser.email, JSON.stringify(newUser));
  var userList = getUserList();
  var userId = userList.length + 1;
  newUser.id = userId;
  userList.push(newUser);
  saveItemToLocalStorage("*userList*", JSON.stringify(userList));
  var bandList = getBandList();
  bandList.push(newUser.bandName);
  saveItemToLocalStorage("*bandList*", JSON.stringify(bandList));
}

function loginUser() {
  //saveItemToLocalStorage("*loggedIn*", JSON.stringify(user));
  hideAuthenticationUI();
  loggedIn = true;
}

function hideAuthenticationUI() {
  hideElementById("authentication");
  displayElementById("accountInformation");
  displayElementById("navLinks");
  hideElementById("signInButton");
  displayElementById("signOutButton");
}

function signOut() {
  loggedIn = false;
  navigateToURL("/#/");
  hideElementById("signOutButton");
  displayElementById("signInButton");
  hideElementById("accountInformation");
  hideElementById("startBandForm");
  hideElementById("navLinks");
  displayElementById("authentication");
};

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

function getBandList() {
  var bandList = JSON.parse(getItemFromLocalStorage("*bandList*"));
  if (bandList) {
    return bandList;
  } else {
    bandList = [];
    return bandList;
  }
}

function getUserList() {
  var userList = JSON.parse(getItemFromLocalStorage("*userList*"));
  if (userList) {
    return userList;
  } else {
    userList = [];
    return userList;
  }
}

function isLoggedIn() {
  if (!loggedIn) {
    navigateToURL("/#/");
  }
  return loggedIn;
}

function objectIsEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
