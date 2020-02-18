//TODO Change more than just the body background

$(document).ready(function () {
    // Set up Side Nav
    $('#sideNav').click(function(e){
        e.stopPropagation();
    });
    $('#sideNav a, #bandList a').click(function(){
        closeSideNav();
    });
    $('#bandListToggle').click(function(){
        openSideNav();
    });
    $('body,html').click(function(){
        closeSideNav();
    });
    $('#sideNavButton').click(function(e){
        e.stopPropagation();
        openSideNav();
    });
    var icon = localStorage['user-icon'] || "../img/default-profile.png";
    changeUserIcon(icon);
});

function toggleBandList() {
    if (getElementById("bandList").style.display === "none") {
        displayElementInlineById("bandListCloser");
        hideElementById("bandListOpener");
        showElementById("bandList");
    } else {
        displayElementInlineById("bandListOpener");
        hideElementById("bandListCloser");
        hideElementByIdWithAnimation("bandList");
    }
}

function openSideNav() {
    getElementById("sideNav").style.width = "200px";
    hideElementById("sideNavButton");
    displayElementInlineById("closeSideNavButton");
}

function closeSideNav() {
    getElementById("sideNav").style.width = "0";
    hideElementById("closeSideNavButton");
    displayElementInlineById("sideNavButton");
}

function showSearchForm() {
    if ($(document).width() < 505) {
        hideElementById("brand");
    }
    hideElementById("showSearch");
    displayElementInlineById("search");
    displayElementInlineById("closeSearch");
}

function closeSearchForm() {
    hideElementById("closeSearch");
    hideElementById("search");
    displayElementInlineById("showSearch");
    displayElementInlineById("brand");
}

function changeBackgroundColor(id) {
    var currentId = getBackgroundColorId();
    if (currentId !== undefined) {
        deselectBackgroundColorButton(currentId);
    }
    var color = getBackgroundColor(id);
    getElementByTag("html").style.backgroundColor = color;
    localStorage['background-color-id'] = id;
    selectBackgroundColorButton(id);
}

function getBackgroundColorId() {
    return localStorage['background-color-id'];
}

function selectBackgroundColorButton(id) {
    var button = getElementById(id);
    if (button !== null) {
        button.style.border = "2px solid white";
    }
}

function deselectBackgroundColorButton(id) {
    var button = getElementById(id);
    if (button !== null) {
        button.style.border = "none";
    }
}

function loadProfileImage() {
  console.log(CURRENT_USER.userIcon);
  var icon = CURRENT_USER.userIcon || "../img/default-profile.png";
  changeUserIcon(icon);
};

function changeUserIcon(img) {
  getElementById("userLinkImage").style.backgroundImage = "url(" + img + ")";
}

function showEditUser() {
    hideElementById("userInfo");
    displayElementById("editUserInfo");
}

function closeEditUser() {
  hideElementById("editUserInfo");
  displayElementById("userInfo");
}

function showPlaylistLoader() {
    hideElementById("playlists");
    displayElementById("playlistLoader")
}

function hidePlaylistLoader() {
  hideElementById("playlistLoader");
  displayElementById("playlists")
}

function hideBody() {
    //getElementByTag("body").style.opacity = 0;
    //getElementByTag("body").style.display = "none";
    getElementById("appContents").style.display = "none";
}

function showBody() {
  //getElementByTag("body").style.opacity = 1;
  //getElementByTag("body").style.display = "block";
    getElementById("appContents").style.display = "block";
}

function getBackgroundColor(id) {
    switch(id) {
        case "bgc-1":
            return 'rgb(89, 106, 125)';
            break;
        case "bgc-2":
            return '#265a88';
            break;
        case "bgc-3":
            return 'rgb(34, 93, 71)';
            break;
        case "bgc-4":
            return 'rgb(24, 27, 29)';
            break;
        case "bgc-5":
            return 'rgb(40, 42, 43)';
            break;
        case "bgc-6":
            return 'rgb(100, 27, 29)';
            break;
    }
}
