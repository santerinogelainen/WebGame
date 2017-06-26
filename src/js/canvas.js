"use strict";
exports.__esModule = true;
var Canvas = (function () {
    function Canvas() {
    }
    Canvas.init = function () {
        Canvas.element.width = Canvas.width;
        Canvas.element.height = Canvas.height;
    };
    Canvas.clear = function () {
        Canvas.context.clearRect(0, 0, this.width, this.height);
    };
    Canvas.setBackground = function (color) {
        Canvas.bg = color;
        Canvas.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
    };
    Canvas.updateResolution = function () {
        //update canvas values
        var centerx = (Canvas.width / 2);
        var centery = (Canvas.height / 2);
        Canvas.center = { x: centerx, y: centery };
        Canvas.width = Canvas.element.clientWidth;
        Canvas.height = Canvas.element.clientHeight;
        Canvas.element.width = Canvas.width;
        Canvas.element.height = Canvas.height;
    };
    Canvas.updateBackground = function () {
        if (Canvas.bg != null) {
            //clear canvas
            Canvas.clear();
            //set background color of canvas
            Canvas.setBackground(Canvas.bg);
        }
    };
    return Canvas;
}());
Canvas.element = document.getElementById("canvas");
Canvas.context = Canvas.element.getContext("2d");
Canvas.width = Canvas.element.clientWidth;
Canvas.height = Canvas.element.clientHeight;
Canvas.center = { x: (Canvas.width / 2), y: (Canvas.height / 2) };
exports.Canvas = Canvas;
