/**
 * Created by rn30 on 22/10/2015.
 */

// Used to extract information from relevant tab.

// Static variables
var callback = null;
var finishedLoading = false;


$(document).ready(function () {
    console.log("Finished.");
    finishedLoading = true;

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