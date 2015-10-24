// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.addEventListener('DOMContentLoaded', function () {
    // Send message to the background script.
    chrome.runtime.sendMessage({text: "popup_update_request"}, handleData);
});

function handleData(response) {
    debugger;
    console.log("Received reply.");
    console.log(response);
    for (var key in response) {
        if (response.hasOwnProperty(key)) {
            addRow(response[key]);
        }
    }
}

function addRow(fieldArr) {
    var newRow = $("<tr></tr>");
    for (var i = 0; i < fieldArr.length; i++) {
        newRow.append("<td>" + fieldArr[i] + "</td>");
    }

    $("#content").append(newRow);
}

