"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var general_3 = require("./general");
var Tiletip = (function () {
    function Tiletip() {
    }
    Tiletip.draw = function (tile) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.font = "15px sans-serif";
        canvas_1.Canvas.context.textBaseline = "top";
        var text = tile.name;
        var width = canvas_1.Canvas.context.measureText(text).width;
        var height = Tiletip.fontsize;
        var x = Tiletip.getX(width);
        var y = Tiletip.getY(Tiletip.fontsize);
        canvas_1.Canvas.context.fillStyle = Tiletip.backgroundcolor.toRGBA();
        canvas_1.Canvas.context.fillRect((x - Tiletip.padding), (y - Tiletip.padding), (width + (2 * Tiletip.padding)), (height + (2 * Tiletip.padding)));
        canvas_1.Canvas.context.fillStyle = Tiletip.color.toRGBA();
        canvas_1.Canvas.context.fillText(text, x, y);
    };
    Tiletip.getX = function (textwidth) {
        switch (Tiletip.horizontal) {
            case general_1.HorizontalAlign.LEFT:
                return Tiletip.offset;
            case general_1.HorizontalAlign.CENTER:
                return (canvas_1.Canvas.width / 2) - (textwidth / 2);
            case general_1.HorizontalAlign.RIGHT:
                return canvas_1.Canvas.width - textwidth - Tiletip.offset;
            default:
                console.log("Unknown align: " + Tiletip.horizontal);
                return null;
        }
    };
    Tiletip.getY = function (textheight) {
        switch (Tiletip.vertical) {
            case general_2.VerticalAlign.TOP:
                return Tiletip.offset;
            case general_2.VerticalAlign.MIDDLE:
                return (canvas_1.Canvas.height / 2) - (textheight / 2);
            case general_2.VerticalAlign.BOTTOM:
                return canvas_1.Canvas.height - textheight - Tiletip.offset;
            default:
                console.log("Unknown align: " + Tiletip.vertical);
                return null;
        }
    };
    return Tiletip;
}());
Tiletip.offset = 10;
Tiletip.padding = 5;
Tiletip.fontsize = 15;
Tiletip.color = new general_3.Color(255, 255, 255);
Tiletip.backgroundcolor = new general_3.Color(0, 0, 0);
Tiletip.vertical = general_2.VerticalAlign.TOP;
Tiletip.horizontal = general_1.HorizontalAlign.CENTER;
exports.Tiletip = Tiletip;
