/**
 * Created by Robin Nabel on 22/10/2015.
 * This script is attached to all MMS related websites, and serves as an end-point to requests by the app.
 */


// Global variables.
var gCallback = null;
var gFinishedLoading = false;


$(document).ready(function () {
    console.log("Finished.");
    gFinishedLoading = true;

    // Detect which kind of page it is.
    var url = window.location.href;
    var type = "main_page_data";
    var data = document.documentElement.innerHTML;
    if (url.indexOf("mms/module") > -1) {
        // It is a module page.
        type = "module_page_data";
    }

    sendMessage({type: type, data: data});
});


function sendMessage(msgObj) {
    chrome.runtime.sendMessage(msgObj);
}