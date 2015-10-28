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

    // Insert headers.
    var headers = response.headers;

    var headerRow = $("<tr></tr>");
    for (var i = 0; i < headers.length; i++) {
        headerRow.append('<tr>' + headers[i] + '</tr>');
    }

    // Insert module grades.
    var grades = response.grades;
    for (var key in grades) {
        if (grades.hasOwnProperty(key)) {
            addRow(grades[key], key);
        }
    }
}

function addRow(fieldArr, key) {

    // Loop over every assignment.
    for (var i = 0; i < fieldArr.length; i++) {
        var newRow = $("<tr></tr>");
        var currentEl = fieldArr[i];

        // Insert module name in the first element in the row, if it is the first result for the module.
        var moduleString = '';
        if (i == 0) {
            // If first row, then insert the module title.
            moduleString = '<td class="moduleTitle">' + key + '</td>';
        }
        newRow.append(moduleString);

        // Print all fields of the assignment.
        for (var j = 0; j < currentEl.length; j++) {
            newRow.append('<td>' + fieldArr[i][j] + '</td>');
        }

        $("#content").append(newRow);
    }

}

