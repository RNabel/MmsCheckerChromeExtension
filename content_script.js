/**
 * Created by rn30 on 22/10/2015.
 */

// Used to extract information from relevant tab.

var callback = null;
var finishedLoading = true;

/* Listen for messages requesting content of page. */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "report_back")) {
        /* Call the specified callback, passing
         the web-pages DOM content as argument */
        if (finishedLoading) {
            sendResponse(document.documentElement.innerHTML);
        } else {
            callback = sendResponse;
        }
    }
});