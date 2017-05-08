var bands = [];
var user = {};
var currentBand = "";

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
  saveItemToLocalStorage("*loggedIn*", JSON.stringify(user));
  hideAuthenticationUI();
}

function loadUserInfo() {
  var userInfo = getItemFromLocalStorage("*loggedIn*");
  if (userInfo !== 'null') {
    user = (JSON.parse(userInfo));
  } else {
    console.log("Invalid user");
  }
  hideAuthenticationUI();
}

function hideAuthenticationUI() {
  hideElementById("authentication");
  displayElementById("accountInformation");
  displayElementById("navLinks");
  hideElementById("signInButton");
  displayElementById("signOutButton");
}

function showAccounts() {
  console.log(JSON.parse(getItemFromLocalStorage("*userList*")));
}

function isLoggedIn() {
  console.log(getItemFromLocalStorage("*loggedIn*"));
  var loggedIn = getItemFromLocalStorage("*loggedIn*") !== 'null';
  console.log(loggedIn);
  return loggedIn;
}

function signOut() {
  saveItemToLocalStorage("*loggedIn*", 'null');
  navigateToURL("/#/");
  hideElementById("signOutButton");
  displayElementById("signInButton");
  hideElementById("accountInformation");
  hideElementById("startBandForm");
  hideElementById("navLinks");
  displayElementById("authentication");
};

function passwordsMatch(password, passwordAgain) {
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
    console.log("Sorry, your passwords do not match.");
    return false;
  }
}

function checkName(firstName, lastName) {
  var valid = true;
  if (firstName == "") {
    console.log("Please give your first name.");
    showInvalidInput("firstName");
    valid = false;
  }
  if (lastName == "") {
    console.log("Please give your last name.");
    showInvalidInput("lastName");
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

function validSignUpEmail(email) {
  if (email == "") {
    console.log("Please give your email.");
    showInvalidInput("signUpEmail");
    return false;
  }
  var userList = getUserList();
  for (user in userList) {
    console.log(userList[user].email)
    if (userList[user].email === email) {
      console.log("Sorry, " + email + " already exists.");
      showInvalidInput("signUpEmail");
      return false;
    }
  }
  return true;
}

function checkEmail(email) {
  if (email == "") {
    console.log("Please give your email.");
    showInvalidInput("signUpEmail");
    return false;
  } else if (getItemFromLocalStorage(email) === null) {
    console.log("User does not exist");
    showInvalidInput("signUpEmail");
    return false;
  } else {
    return true;
  }
  return ;
}

function checkPassword(email, password) {
  // TODO do smart storage getting
  var user = getItemFromLocalStorage(email);
  if (user !== null) {
    user = JSON.parse(user);
    if (password === user.password) {
      console.log("Passwords match");
      return true;
    } else {
      console.log("Incorrect password");
      showInvalidInput("signInPassword");
      return false;
    }
  } else {
    console.log("User does not exist.");
    showInvalidInput("signInEmail");
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
