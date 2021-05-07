/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

Office.actions.associate("SHOWTASKPANE", function() {
  return Office.addin
    .showAsTaskpane()
    .then(function() {
      return;
    })
    .catch(function(error) {
      return error.code;
    });
});

Office.actions.associate("HIDETASKPANE", function() {
  return Office.addin
    .hide()
    .then(function() {
      return;
    })
    .catch(function(error) {
      return error.code;
    });
});

Office.actions.associate("SETCOLOR", function() {
  var context = new Excel.RequestContext();
  var range = context.workbook.getSelectedRange();
  var rangeFormat = range.format;
  rangeFormat.fill.load();
  var colors = ["#FFFFFF", "#C7CC7A", "#7560BA", "#9DD9D2", "#FFE1A8", "#E26D5C"];
  return context.sync().then(function() {
    var rangeTarget = context.workbook.getSelectedRange();
    var currentColor = -1;
    for (var i = 0; i < colors.length; i++) {
      if (colors[i] == rangeFormat.fill.color) {
        currentColor = i;
        break;
      }
    }
    if (currentColor == -1) {
      currentColor = 0;
    } else if (currentColor == colors.length - 1) {
      currentColor = 0;
    } else {
      currentColor++;
    }
    rangeTarget.format.fill.color = colors[currentColor];
    return context.sync();
  });
});

Office.actions.associate("TESTCONFLICT", function() {
  console.log("test conflict");
});

Office.onReady(info => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
});
