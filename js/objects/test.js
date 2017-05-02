//TODO Remove this when finished creating folder and file structure
var TEST_FILE = [
    {
        title: "Test Folder",
        mimeType: "application/vnd.google-apps.folder",
        explicitlyTrashed: false,
        id: "TEST"
    },
    {
        title: "Test Audio.m4a",
        mimeType: "m4a",
        id: "0BysYdC4iJkFUU1NrajVZR0YzVWs",
        createdDate: "2016-12-02T22:31:21.487Z",
        webContentLink: "https://drive.google.com/uc?id=0BysYdC4iJkFUU1NrajVZR0YzVWs&export=download",
        explicitlyTrashed: false,
        fileExtension: "m4a",
        fileSize: 1024
    },
    {
        title: "Test Video.MP4",
        mimeType: "MP4",
        id: "0BysYdC4iJkFUQUdkSHdJUk5kRGs",
        createdDate: "2016-12-02T22:31:21.487Z",
        webContentLink: "https://drive.google.com/uc?id=0BysYdC4iJkFUQUdkSHdJUk5kRGs&export=download",
        explicitlyTrashed: false,
        fileExtension: "MP4",
        fileSize: 1024
    }
];

function loadTestFiles() {
    document.getElementById('authorize-div').style.display = "none";
    listFiles("TEST");
}