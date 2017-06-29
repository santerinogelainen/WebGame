"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var Debug = (function () {
    function Debug() {
    }
    Debug.draw = function (lines) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.font = Debug.lineHeight + "px sans-serif";
        canvas_1.Canvas.context.fillStyle = "#ffffff";
        var nthLine = 1;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            canvas_1.Canvas.context.fillText(line, 0, nthLine * Debug.lineHeight);
            nthLine++;
        }
    };
    Debug.toggle = function (e) {
        e = e || event;
        if (e.keyCode === 114) {
            e.preventDefault();
            if (Debug.on == true) {
                Debug.on = false;
            }
            else {
                Debug.on = true;
            }
        }
        if (e.keyCode === 115) {
            e.preventDefault();
            if (Debug.lines == true) {
                Debug.lines = false;
            }
            else {
                Debug.lines = true;
            }
        }
    };
    return Debug;
}());
Debug.on = false;
Debug.lines = false;
Debug.lineHeight = 15;
exports.Debug = Debug;
