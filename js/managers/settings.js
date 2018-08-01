//TODO Change more than just the body background

function openSideNav() {
    getElementById("sideNav").style.width = "250px";

}

function closeSideNav() {
    getElementById("sideNav").style.width = "0";

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
    displayElementById("brand");
}

function changeBackgroundColor(color) {
    getElementByTag("body").style.backgroundColor = color;
    getElementByTag("html").style.backgroundColor = color;
    localStorage['background-color'] = color;
}

