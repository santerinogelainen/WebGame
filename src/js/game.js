"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var general_1 = require("./general");
var general_2 = require("./general");
var chunk_1 = require("./chunk");
var tile_1 = require("./tile");
var character_1 = require("./character");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var tiletip_1 = require("./tiletip");
var settings_1 = require("./settings");
var mouse_1 = require("./mouse");
var Game = (function () {
    function Game() {
    }
    Game.updateResolution = function () {
        canvas_1.Canvas.updateResolution();
        chunk_1.Chunk.calculatePerScreenRatio();
        Game.updateScreen(true);
    };
    Game.updateScreen = function (updateResolution) {
        if (updateResolution === void 0) { updateResolution = false; }
        //update background
        canvas_1.Canvas.updateBackground();
        //update each chunk
        Game.world.draw();
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
        //update menus etc
        if (Game.world.chunks[chunk_1.Chunk.hover] != null) {
            tiletip_1.Tiletip.draw(Game.world.chunks[chunk_1.Chunk.hover].tiles[tile_1.Tile.hover]);
        }
    };
    Game.init = function () {
        Game.world = new world_1.World();
        Game.player = new character_1.Player(1, "asd");
        Game.world.genChunksOnScreen(Game.player.position.chunk.x, Game.player.position.chunk.y);
    };
    Game.getDebugLines = function () {
        var debugLines = [
            "FPS: " + Game.curFps + " (limit: " + settings_1.Settings.fpslimit + ")",
            /*"Loaded chunks: " + Game.world.onscreen.join(", "),*/
            "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
            "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
            "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
            "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
            "Tiles per chunk (side): " + chunk_1.Chunk.tilesperside,
            "Chunk size: " + chunk_1.Chunk.size,
            "Tile size: " + tile_1.Tile.size
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
    Game.updateHover = function () {
        mouse_1.Mouse.updateWorldPosition();
        chunk_1.Chunk.updateHover();
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
        Game.curTime = Date.now();
        Game.elapsed = Game.curTime - Game.timeInterval;
        var sinceStart = Game.curTime - Game.startTime;
        if (Game.elapsed > Game.fpsInterval) {
            Game.updateHover();
            Game.timeInterval = Game.curTime - (Game.elapsed % Game.fpsInterval);
            var oldPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
            Game.player.walk(Game.key);
            var newPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
            Game.comparePositions(oldPosition, newPosition);
            Game.updateScreen();
            Game.frameCount++;
            Game.curFps = Math.round((Game.frameCount / sinceStart) * 1000);
        }
    };
    Game.run = function () {
        Game.fpsInterval = 1000 / settings_1.Settings.fpslimit;
        Game.timeInterval = Date.now();
        Game.startTime = Game.timeInterval;
        Game.loop();
    };
    return Game;
}());
Game.key = {};
Game.frameCount = 0;
Game.prevFrameCount = 0;
exports.Game = Game;
