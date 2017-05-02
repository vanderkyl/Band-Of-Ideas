//TODO Change more than just the body background

function useDarkTheme() {
    console.log("Using Dark Theme");
    var html = document.getElementsByTagName("HTML")[0];
    var body = document.getElementsByTagName("BODY")[0];
    html.style.background="#28363d";
    body.style.background="#28363d";
    hideElementById("navTool1");
    displayElementById("navTool2");
}

function useLightTheme() {
    console.log("Using Light Theme");
    var html = document.getElementsByTagName("HTML")[0];
    var body = document.getElementsByTagName("BODY")[0];
    body.style.background="#F5F5F5";
    html.style.background="#F5F5F5";
    hideElementById("navTool2");
    displayElementById("navTool1");
}

function useImageNavTheme() {
    hideElementById("navRoutes");
    hideElementById("navTool1");
    displayElementById("imageNavRoutes");
    displayElementById("navTool2");
}

function useTextNavTheme() {
    hideElementById("imageNavRoutes");
    hideElementById("navTool2");
    displayElementById("navRoutes");
    displayElementById("navTool1");
}