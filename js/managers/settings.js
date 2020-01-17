//TODO Change more than just the body background

$(document).ready(function () {
    // Set up Side Nav
    $('#sideNav').click(function(e){
        e.stopPropagation();
    });
    $('#sideNav a').click(function(){
        closeSideNav();
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

function changeBackgroundColor(color) {
    getElementByTag("html").style.backgroundColor = color;
    //getElementById("appContainer").style.backgroundColor = color;
    localStorage['background-color'] = color;
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
    getElementByTag("body").style.display = "none";
}

function showBody() {
  //getElementByTag("body").style.opacity = 1;
  getElementByTag("body").style.display = "block";
}
