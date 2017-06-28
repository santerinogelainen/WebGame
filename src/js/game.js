"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var general_1 = require("./general");
var general_2 = require("./general");
var world_2 = require("./world");
var world_3 = require("./world");
var character_1 = require("./character");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var Game = (function () {
    function Game() {
    }
    Game.updateResolution = function () {
        canvas_1.Canvas.updateResolution();
        world_2.Chunk.calculatePerScreenRatio();
        Game.updateScreen(true);
    };
    Game.updateScreen = function (updateResolution) {
        if (updateResolution === void 0) { updateResolution = false; }
        //update background
        canvas_1.Canvas.updateBackground();
        //update each chunk
        for (var _i = 0, _a = Game.world.onscreen; _i < _a.length; _i++) {
            var chunk = _a[_i];
            Game.world.drawChunk(Game.world.chunks[chunk]);
        }
        //update character
        if (updateResolution) {
            Game.player.draw(canvas_1.Canvas.center.x, canvas_1.Canvas.center.y);
        }
        else {
            Game.player.draw(Game.player.position.screen.x, Game.player.position.screen.y);
        }
        //debug
        if (debug_1.Debug.on) {
            debug_1.Debug.draw(Game.getDebugLines());
        }
    };
    Game.start = function () {
        Game.world = new world_1.World();
        Game.player = new character_1.Player(1, "asd");
    };
    Game.checkPlayerPosition = function () {
        var pos = Game.player.position;
        var loadsens = world_2.Chunk.loadsensitivity;
        if (pos.tile.x == 0 + loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.LEFT);
        }
        if (pos.tile.x == (world_2.Chunk.tilesperside - 1 - loadsens)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.RIGHT);
        }
        if (pos.tile.y == 0 + loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.DOWN);
        }
        if (pos.tile.y == (world_2.Chunk.tilesperside - 1 - loadsens)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.UP);
        }
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y);
    };
    Game.getDebugLines = function () {
        var debugLines = [
            "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
            "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
            "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
            "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
            "Tiles per chunk (side): " + world_2.Chunk.tilesperside,
            "Chunk size: " + world_2.Chunk.chunksize,
            "Tile size: " + world_3.Tile.tilesize
        ];
        return debugLines;
    };
    Game.keypress = function (e) {
        e = e || event;
        Game.key[e.keyCode] = e.type == 'keydown';
        if (Game.key[87] || Game.key[65] || Game.key[83] || Game.key[68]) {
            Game.player.moving = true;
        }
        else {
            Game.player.moving = false;
        }
    };
    Game.comparePositions = function (oldPosition, newPosition) {
        if (oldPosition.x != newPosition.x) {
            if (oldPosition.x > newPosition.x) {
                Game.world.loadChunksOnWalk(general_2.Position.X, general_1.Direction.LEFT, newPosition.x, newPosition.y);
            }
            if (oldPosition.x < newPosition.x) {
                Game.world.loadChunksOnWalk(general_2.Position.X, general_1.Direction.RIGHT, newPosition.x, newPosition.y);
            }
        }
        if (oldPosition.y != newPosition.y) {
            if (oldPosition.y > newPosition.y) {
                Game.world.loadChunksOnWalk(general_2.Position.Y, general_1.Direction.DOWN, newPosition.x, newPosition.y);
            }
            if (oldPosition.y < newPosition.y) {
                Game.world.loadChunksOnWalk(general_2.Position.Y, general_1.Direction.UP, newPosition.x, newPosition.y);
            }
        }
    };
    Game.loop = function () {
        requestAnimationFrame(Game.loop);
        var oldPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
        Game.player.walk(Game.key);
        var newPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
        Game.comparePositions(oldPosition, newPosition);
        Game.checkPlayerPosition();
        Game.updateScreen();
    };
    return Game;
}());
Game.key = {};
exports.Game = Game;
