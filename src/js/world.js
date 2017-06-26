"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var Tile = (function () {
    function Tile(x, y) {
        this.x = x;
        this.y = y;
    }
    return Tile;
}());
Tile.tilesize = 50;
exports.Tile = Tile;
var Chunk = (function () {
    function Chunk(seed, x, y, direction) {
        this.tiles = [];
        this.x = x;
        this.y = y;
        this.checkDirection(direction);
        this.generateTiles(seed);
    }
    Chunk.prototype.checkDirection = function (dir) {
        switch (dir) {
            case general_1.Direction.UP:
                this.y += 1;
                break;
            case general_1.Direction.RIGHT:
                this.x += 1;
                break;
            case general_1.Direction.DOWN:
                this.y -= 1;
                break;
            case general_1.Direction.LEFT:
                this.x -= 1;
                break;
            default:
        }
    };
    Chunk.prototype.generateTiles = function (seed) {
        var r = 0, c = 0;
        while (r < Chunk.tilesperside) {
            while (c < Chunk.tilesperside) {
                var tile = new Tile(r, c);
                this.tiles.push(tile);
                c++;
            }
            c = 0;
            r++;
        }
    };
    return Chunk;
}());
Chunk.tilesperside = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
Chunk.chunksize = Chunk.tilesperside * Tile.tilesize;
exports.Chunk = Chunk;
var World = (function () {
    function World() {
        this.chunks = [];
        this.seed = this.generateSeed(-2147483647, 2147483647);
        this.generateChunk(0, 0, null);
    }
    World.prototype.generateChunk = function (x, y, direction) {
        var chunk = new Chunk(this.seed, x, y, direction);
        console.log(chunk);
        this.drawChunk(chunk);
        this.chunks.push(chunk);
    };
    World.prototype.drawChunk = function (chunk) {
        var chunkpositionx = canvas_1.Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
        var i = 0;
        for (var _i = 0, _a = chunk.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tilepositionx = chunkpositionx + (Tile.tilesize * tile.x) - (Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (Tile.tilesize * tile.y) - (Tile.tilesize / 2);
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(tilepositionx, tilepositiony, Tile.tilesize + 1, Tile.tilesize + 1);
            canvas_1.Canvas.context.fillStyle = "#27ae60";
            canvas_1.Canvas.context.fill();
            canvas_1.Canvas.context.strokeStyle = "#2ecc71";
            canvas_1.Canvas.context.stroke();
            i++;
        }
    };
    World.prototype.generateSeed = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return World;
}());
exports.World = World;
