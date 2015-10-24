// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var currentModuleInd = 0;
var moduleLinks = [];
var host = "https://mms.st-andrews.ac.uk";
var loginPage = "/mms/user/me/Modules?login_submit=Login";

// If login page open several times, ensures that content is only processed once.
var alreadyProcessedLoginPage = true;
var tabId = -1;
var isModuleLoading = false;

var newModGrades = {};
var oldModGrades = {};

var popupCallback;

function processMainPageData(content) {
    if (!alreadyProcessedLoginPage) {
        alreadyProcessedLoginPage = true;
        console.log("Got stuff back from page.");

        // All links that lead to coursework stored in global array.
        $(content).find("a.resource.coursework")
            .each(function () {
                moduleLinks.push($(this).attr('href'))
            });

        // Start requesting the individual modules.
        openNextModulePage();
    }

}

// Function that opens each module's page, and extracts information.
function openNextModulePage() {
    // Are there modules left to load?
    if (currentModuleInd != moduleLinks.length) {
        isModuleLoading = true;
        var modURL = host + moduleLinks[currentModuleInd++];

        console.log("Requesting next module: " + modURL);
        chrome.tabs.update(tabId, {url: modURL, active: false});
    } else {
        // Finished requesting all modules.

        // Close the tab used for the requests.
        chrome.tabs.remove(tabId, function () {
        });

        // TODO compare old and new module grades.
        console.log(newModGrades);

        // Respond to the popup with the modules.
        popupCallback(newModGrades);
    }
}

function processModulePageData(content) {
    // Extract all coursework entries.
    var tableArray = [];
    $(content).find("tbody").find("tr")
        .each(function () {
            var arrayOfThisRow = [];
            var tableData = $(this).find('td');
            if (tableData.length > 0) {
                tableData.each(function () {
                    arrayOfThisRow.push($(this).text());
                });
                tableArray.push(arrayOfThisRow);
            }

        });

    // Find all modules with feedback.
    var outputTable = [];
    $(tableArray).each(function (ind, val) {
        // If feedback date exists.
        if (val[5] != "\n[Add Comment]") {
            outputTable.push(tableArray[ind]);
        }
    });

    // Get module name.
    var moduleName = $(content).find(".resourcename a")[0].innerHTML;

    // Enter module information to global info table.
    if (outputTable.length > 0) {
        newModGrades[moduleName] = outputTable;
    }

    // Request next module.
    openNextModulePage();
}

// Entry point to initiate an update of the grade information.
function extractGradeInformation(callback) {
    // Reset state relevant for each iteration.
    alreadyProcessedLoginPage = false;
    currentModuleInd = 0;
    moduleLinks = [];
    isModuleLoading = false;
    oldModGrades = newModGrades;
    newModGrades = {};
    popupCallback = callback;

    // Access mms main page.
    var newURL = host + loginPage;
    chrome.tabs.create({url: newURL, active: false});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab) {
            contentScriptRequestHandler(request, sender, sendResponse);
            console.log("Request from tab");

        } else if (request.text) {
            // Request from other script.
            console.log("Request from popup script.");
            return popupScriptRequestHandler(request, sender, sendResponse);
        }
    });

function contentScriptRequestHandler(request, sender) {
    // Check what request it is.
    switch (request.type) {
        case "main_page_data":
            tabId = sender.tab.id;
            processMainPageData(request.data);
            break;
        case "module_page_data":
            processModulePageData(request.data);
            break;
    }
}

function popupScriptRequestHandler(request, sender, sendResponse) {
    if (request.text == "popup_update_request") {
        extractGradeInformation(sendResponse);
        return true;
    }
}