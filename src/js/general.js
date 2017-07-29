"use strict";
exports.__esModule = true;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
})(Direction = exports.Direction || (exports.Direction = {}));
var Position;
(function (Position) {
    Position[Position["X"] = 0] = "X";
    Position[Position["Y"] = 1] = "Y";
    Position[Position["Z"] = 2] = "Z";
})(Position = exports.Position || (exports.Position = {}));
var HorizontalAlign;
(function (HorizontalAlign) {
    HorizontalAlign[HorizontalAlign["LEFT"] = 0] = "LEFT";
    HorizontalAlign[HorizontalAlign["CENTER"] = 1] = "CENTER";
    HorizontalAlign[HorizontalAlign["RIGHT"] = 2] = "RIGHT";
})(HorizontalAlign = exports.HorizontalAlign || (exports.HorizontalAlign = {}));
var VerticalAlign;
(function (VerticalAlign) {
    VerticalAlign[VerticalAlign["TOP"] = 0] = "TOP";
    VerticalAlign[VerticalAlign["MIDDLE"] = 1] = "MIDDLE";
    VerticalAlign[VerticalAlign["BOTTOM"] = 2] = "BOTTOM";
})(VerticalAlign = exports.VerticalAlign || (exports.VerticalAlign = {}));
var Shape;
(function (Shape) {
    Shape[Shape["RECTANGLE"] = 0] = "RECTANGLE";
    Shape[Shape["CIRCLE"] = 1] = "CIRCLE";
    Shape[Shape["TRIANGLE"] = 2] = "TRIANGLE";
})(Shape = exports.Shape || (exports.Shape = {}));
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.rng = rng;
var Texture = (function () {
    function Texture(possibilities) {
        this.element = new Image();
        this.setTexture(possibilities);
    }
    //randomly pick a texture (or if only 1 then that one)
    Texture.prototype.setTexture = function (srcs) {
        var rng = Math.floor(Math.random() * srcs.length);
        this.element.src = srcs[rng];
    };
    return Texture;
}());
exports.Texture = Texture;
var Color = (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        if (a != null) {
            this.a = a;
        }
        else {
            this.a = 1;
        }
    }
    Color.prototype.toRGBA = function () {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };
    return Color;
}());
exports.Color = Color;
/*
* Returns a string version of the coordinates given.
* Example:
* -1, 4   ===   "m14"
* 0, -12  ===   "0m12"
*/
function coordinatesToString(x, y) {
    var coords = x.toString() + y.toString();
    coords = coords.replace(/-/g, "m");
    return coords;
}
exports.coordinatesToString = coordinatesToString;
