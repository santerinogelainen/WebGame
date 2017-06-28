"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var game_1 = require("./game");
var debug_1 = require("./debug");
window.onload = function () {
    //init everything
    canvas_1.Canvas.init();
    canvas_1.Canvas.setBackground(new general_1.Color(0, 0, 0, 1));
    game_1.Game.start();
    window.requestAnimationFrame(game_1.Game.loop);
    //generate additional chunks
    /*Game.world.generateChunk(0, 0, Direction.UP);
    Game.world.generateChunk(0, 1, Direction.LEFT);
    Game.world.generateChunk(-1, 1, Direction.DOWN);
    Game.world.generateChunk(0, 1, Direction.RIGHT);*/
    //Game.world.generateChunk(0, 0, Direction.RIGHT);
    window.addEventListener("keydown", debug_1.Debug.toggle, false);
    window.addEventListener("keydown", game_1.Game.keypress, false);
    window.addEventListener("keyup", game_1.Game.keypress, false);
};
window.onresize = function () {
    game_1.Game.updateResolution();
};
