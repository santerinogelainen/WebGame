"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var general_1 = require("./general");
var general_2 = require("./general");
var general_3 = require("./general");
var settings_1 = require("./settings");
var canvas_1 = require("./canvas");
var Environment = (function () {
    function Environment() {
        this.offset = {
            x: 0,
            y: 0
        };
        this.size = {
            x: 0,
            y: 0
        };
    }
    Environment.prototype.draw = function (x, y) {
        canvas_1.Canvas.context.beginPath();
        x = x - this.offset.x;
        y = y - this.offset.y;
        if (settings_1.Settings.useenvironmentcolor) {
            canvas_1.Canvas.context.fillStyle = this.color.toRGBA();
            switch (this.shape) {
                case general_3.Shape.CIRCLE:
                    canvas_1.Canvas.context.arc(x, y, this.size.x / 2, 0, 2 * Math.PI);
                    canvas_1.Canvas.context.fill();
                    break;
                case general_3.Shape.RECTANGLE:
                    canvas_1.Canvas.context.fillRect(x, y, this.size.x, this.size.y);
                    break;
                case general_3.Shape.TRIANGLE:
                    canvas_1.Canvas.context.moveTo(x + this.size.x, y + this.size.y);
                    canvas_1.Canvas.context.lineTo(x, y + this.size.y);
                    canvas_1.Canvas.context.lineTo(x + (this.size.x / 2), y);
                    canvas_1.Canvas.context.fill();
                    break;
                default:
                    console.log("Unknown shape: " + this.shape);
            }
        }
        else {
            canvas_1.Canvas.context.drawImage(this.texture.element, x, y, this.size.x, this.size.y);
        }
    };
    return Environment;
}());
Environment.treernglimit = 9;
exports.Environment = Environment;
var Tree = (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new general_1.Color(0, 100, 0);
        _this.texture = new general_2.Texture(["src/img/big_oak.png"]);
        _this.name = "Tree";
        _this.shape = general_3.Shape.TRIANGLE;
        _this.size = {
            x: 50,
            y: 50
        };
        return _this;
    }
    return Tree;
}(Environment));
exports.Tree = Tree;
var Rock = (function (_super) {
    __extends(Rock, _super);
    function Rock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new general_1.Color(128, 132, 135);
        _this.texture = new general_2.Texture(["src/img/big_oak.png"]);
        _this.name = "Rock";
        _this.shape = general_3.Shape.CIRCLE;
        _this.size = {
            x: 50,
            y: 50
        };
        return _this;
    }
    return Rock;
}(Environment));
exports.Rock = Rock;
