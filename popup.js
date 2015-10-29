/*
 * Created by Robin Nabel.
 * This JS script file is bound to the popup.html file. It sends a message to the background script, which in
 * turn calls the content scripts of various MMS scripts to extract data.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Set up "Please wait" spinner.
    setWaitSpinner(true);

    // Send message to the background script.
    setWaitSpinner(true);
    //chrome.runtime.sendMessage({text: "popup_update_request"}, handleData);
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
        var moduleString = '<td class="moduleTitle"></td>';
        if (i == 0) {
            // If first row, then insert the module title.
            moduleString = '<td class="moduleTitle">' + key + '</td>';
        }
        newRow.append(moduleString);

        // Print all fields of the assignment.
        for (var j = 0; j < currentEl.length; j++) {
            newRow.append('<td>' + fieldArr[i][j] + '</td>');
        }

        setWaitSpinner(false);
        $("#content").append(newRow);
    }

}

function setWaitSpinner(addSpinner) {
    // Shows or hides the spinner div.
    var spinner = $('#spinner');
    if (addSpinner) {
        spinner.css('visibility', 'visible');
    } else {
        spinner.css('visibility', 'hidden');
    }
}