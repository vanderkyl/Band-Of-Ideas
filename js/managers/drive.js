// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '528197877151-u6dq0rnndrkjcsflhfc7550dnleu9vju.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDK4xg7QanG2KfFp_T4HiuLxl7LGiBvrxI';
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var FILE_LIST = [];
var FOLDER_ID = "0BysYdC4iJkFUb1Rpbm1ySFNFNEE";
var filesReady = false;

/**
 * Check if current user has authorized this application.
 */
function googleLogin() {
  console.log("Checking authorization...");
  gapi.client.setApiKey(API_KEY);
  gapi.auth.authorize(
      {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
      }, onSignIn);
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  console.log("Checking authorization...");
  gapi.client.setApiKey(API_KEY);
  gapi.auth.authorize(
      {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
      }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  var loadingAnimation = document.getElementById('loading');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadingAnimation.style.display = "block";
    loadDriveApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
    console.log("Loading files from Google Drive...");
    gapi.client.load('drive', 'v2', loadFiles);
    //saveItemToLocalStorage("client", gapi.client);
}

/**
 * Load the list of files retrieved from Google Drive.
 * The false parameter is stating that there is no cache ready.
 */
function loadFiles() {
    listFiles(FOLDER_ID, false);
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    try {
        gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            handleAuthResult);
        return false;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Store and display files and folders
 */
function displayFiles(response) {
  console.log(response);
  if (FILE_LIST.length == 0) {
    FILE_LIST = response;
    hideElementById('loading');
    displayElementById('loadSongs');
  } else {
    FILE_LIST = response;
    filesReady = true;
  }
  console.log("Done!!!");
}

/**
 * Print a file's metadata.
 *
 * @param {String} fileId ID of the file to print metadata for.

function printFile(fileId) {
  try {
      var request = gapi.client.drive.files.get({
          'fileId': fileId
      });
      request.execute(function(resp) {
          console.log('Title: ' + resp.title);
          console.log('Description: ' + resp.description);
          console.log('MIME type: ' + resp.mimeType);
      });
  } catch (err) {
      gapi.client = getItemFromLocalStorage("client");
      //setTimeout(printFile(fileId), 1500);
      var request = gapi.client.drive.files.get({
          'fileId': fileId
      });
      request.execute(function(resp) {
          console.log('Title: ' + resp.title);
          console.log('Description: ' + resp.description);
          console.log('MIME type: ' + resp.mimeType);
      });

  }
}*/

/**
 * Retrieve a list of File resources.
 *
 * @param {String} folderId The Google Drive id for a folder
 * @param {Object} recentFiles A map that holds the file list for recently visited folders
 */
function listFiles(folderId, recentFiles) {
    if (folderId == "TEST") {
        displayFiles(TEST_FILE);
    } else {
        var retrievePageOfFiles = function(request, result) {
            request.execute(function(resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                        'pageToken': nextPageToken
                    })
                    retrievePageOfFiles(request, result);
                } else {
                    if (recentFiles) {
                        cacheFolder(folderId, recentFiles, result);
                    }
                    displayFiles(result);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list({
            q: "'" + folderId + "' in parents"
        });
        return retrievePageOfFiles(initialRequest, []);
    }
}

/**
 * Reloads a recently viewed folder of files.
 *
 * @param {String} folderId The Google Drive id for a folder
 * @param {Object} recentFiles A map that holds the file list for recently visited folders
 */
function listCachedFiles(folderId, recentFiles) {
    console.log("Loading cached files from folder: " + folderId);
    displayFiles(recentFiles[folderId]);
}
