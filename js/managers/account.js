var bands = [];
var CURRENT_USER = {}; // This is the current user that is logged in
var sqlUser = {}; // This is the user that will be checked against when signing up/in
var CURRENT_BAND = {};
var CURRENT_FOLDERS = "";
var CURRENT_FOLDER = "";
var CURRENT_FILES = "";
var loggedIn = false;

// TEST DATA
var testUser = {
  id: "0",
  bands: [
    {id: "0",
     name: "Test Band",
     metaName: "test_band",
     memberIds: "0",
     code: "1234"}
  ],
  name: "Test User",
  email: "test@test.com",
  password: "1234",
  passwordAgain: "1234"
};
var testFolders = [{
  bandId: "0",
  id: "0",
  name: "Test Folder",
  metaName: "test_folder",
  parentId: "0"
}];
var testFiles = [{
    folderId: "0",
    id: "0",
    likes: "0",
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0"
  }, {
      folderId: "0",
      id: "0",
      likes: "0",
      link: "/uploads/bands/1/1/8-Bit.m4a",
      name: "Test File",
      metaName: "test_file",
      size: "34637",
      type: "audio/x-m4a",
      views: "0"
    }, {
        folderId: "0",
        id: "0",
        likes: "0",
        link: "/uploads/bands/1/1/8-Bit.m4a",
        name: "Test File",
        metaName: "test_file",
        size: "34637",
        type: "audio/x-m4a",
        views: "0"
      },
    {
    folderId: "0",
    id: "1",
    likes: "0",
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File2",
    metaName: "test_file2",
    size: "34637",
    type: "audio/x-m4a",
    views: "0"
  }
];
// END OF TEST DATA

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
  removeNavLink("folderLink");
  removeNavLink("bandLink");
  hideElementById("navLinks");
  hideElementById("signOutButton");
  displayElementById("signInButton");
  navigateToURL("/#/");
  hideElementById("accountInformation");
  hideElementById("startBandForm");
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

function generateMetaName(name) {
  name = name.toLowerCase().split(' ').join('_');
  return name;
}
