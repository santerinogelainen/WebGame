"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var game_1 = require("./game");
var debug_1 = require("./debug");
var mouse_1 = require("./mouse");
window.onload = function () {
    //init everything
    canvas_1.Canvas.init();
    canvas_1.Canvas.setBackground(new general_1.Color(0, 0, 0, 1));
    game_1.Game.init();
    canvas_1.Canvas.element.onmousemove = mouse_1.Mouse.updatePagePosition;
    game_1.Game.run();
    window.addEventListener("keydown", debug_1.Debug.toggle, false);
    window.addEventListener("keydown", game_1.Game.keypress, false);
    window.addEventListener("keyup", game_1.Game.keypress, false);
};
window.onresize = function () {
    game_1.Game.updateResolution();
};
