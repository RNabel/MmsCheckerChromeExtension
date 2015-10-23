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

function receiveDataContent(content) {
    if (!alreadyProcessedLoginPage) {
        alreadyProcessedLoginPage = true;
        console.log("Got stuff back from page.");

        // All links that lead to coursework stored in global array.
        $(content).find("a.resource.coursework")
            .each(function () {
                moduleLinks.push($(this).attr('href'))
            });

        // Start requesting the individual modules.
        requestNextModule();
    }

}

function tabCreationCallback(tab) {
    // Set tabId.
    tabId = tab.id;

    chrome.tabs.sendMessage(tab.id, {text: "report_back"},
        receiveDataContent);

}

// Function that opens each module's page, and extracts information.
function requestNextModule() {
    // Are there modules left to load?
    if (currentModuleInd != moduleLinks.length) {
        isModuleLoading = true;
        var modURL = host + moduleLinks[currentModuleInd++];

        console.log("Requesting next module: " + modURL);
        chrome.tabs.update(tabId, {url: modURL, active: false}, handleModulePageLoad);
    } else {
        // Finished requesting all modules.

        // Close the tab used for the requests.
        chrome.tabs.remove(tabId, function () {
        });

        // TODO compare old and new module grades.
        console.log(newModGrades);
    }
}

function handleModulePageLoad() {
    chrome.tabs.sendMessage(tabId, {text: "report_back"},
        handleModulePageData);
}

function handleModulePageData(content) {
    // Extract all coursework entries.
    var tableArray = [];
    var allInfo = $(content).find("tbody").find("tr")
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
    requestNextModule();
}

chrome.browserAction.onClicked.addListener(function (activeTab) {
    // Reset state relevant for each iteration.
    alreadyProcessedLoginPage = false;
    currentModuleInd = 0;
    moduleLinks = [];
    isModuleLoading = false;
    oldModGrades = newModGrades;

    // Access mms main page.
    var newURL = host + loginPage;
    chrome.tabs.create({url: newURL, active: false}, tabCreationCallback);
});
