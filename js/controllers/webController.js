function getElementById(id) {
    return document.getElementById(id);
}

function hideElementById(id) {
    document.getElementById(id).style.display = "none";
}

function displayElementById(id) {
    document.getElementById(id).style.display = "block";
}

function saveItemToLocalStorage(key, value) {
    return localStorage.setItem(key, value);
}

function getItemFromLocalStorage(key) {
    return localStorage.getItem(key);
}

// Get query paramater from url
// Credit to
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function navigateToURL(path) {
    window.location = path;
}

function openLinkInNewTab(path) {
    var win = window.open(path, '_blank');
    win.focus();
}

// Guarantee that the button pressed is the only one that activates
// Use if there is a button on top of a button.
function stopPropogation() {
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();
}

function scrollToElementById(id) {
    var elementId = "#" + id;
    $(elementId).scrollView();
}

$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
}

function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpPost(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };

    xmlHttp.send(null);
}
