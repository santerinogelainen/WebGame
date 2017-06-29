"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var tiles_1 = require("./tiles");
var tiles_2 = require("./tiles");
var debug_1 = require("./debug");
var Chunk = (function () {
    function Chunk(seed, x, y) {
        this.tiles = [];
        this.x = x;
        this.y = y;
        this.generateTiles(seed);
    }
    Chunk.isOnScreen = function (chunk, playerx, playery) {
        var xplus = Math.ceil(playerx + (Chunk.perscreen / 2));
        var xminus = Math.floor(playerx - (Chunk.perscreen / 2));
        var yplus = Math.ceil(playery + (Chunk.perscreen / 2));
        var yminus = Math.floor(playery - (Chunk.perscreen / 2));
        if (chunk.x > xplus || chunk.x < xminus || chunk.y > yplus || chunk.y < yminus) {
            return false;
        }
        else {
            return true;
        }
    };
    Chunk.calculatePerScreenRatio = function () {
        Chunk.perscreen.x = Math.ceil(canvas_1.Canvas.width / Chunk.chunksize);
        Chunk.perscreen.y = Math.ceil(canvas_1.Canvas.height / Chunk.chunksize);
    };
    Chunk.prototype.generateTiles = function (seed) {
        var r = 0, c = 0;
        while (r < Chunk.tilesperside) {
            while (c < Chunk.tilesperside) {
                var tile = new tiles_2.Grass(r, c);
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
Chunk.chunksize = Chunk.tilesperside * tiles_1.Tile.tilesize;
Chunk.loadsensitivity = 2;
Chunk.perscreen = { x: 0, y: 0 };
exports.Chunk = Chunk;
var World = (function () {
    function World() {
        this.chunks = {};
        this.onscreen = [];
        Chunk.calculatePerScreenRatio();
        this.seed = this.generateSeed(-2147483647, 2147483647);
        this.generateChunk(0, 0, null);
    }
    World.prototype.loadChunk = function (x, y) {
        if (this.chunkExists(x, y)) {
            if (this.onscreen.indexOf(World.coordinatesToString(x, y)) == -1) {
                this.onscreen.push(World.coordinatesToString(x, y));
            }
        }
    };
    World.prototype.unloadChunk = function (x, y) {
        var arrayindex = this.onscreen.indexOf(World.coordinatesToString(x, y));
        if (arrayindex > -1) {
            this.onscreen.splice(arrayindex, 1);
        }
    };
    //load a bunch of chunks
    World.prototype.loadChunksOnWalk = function (pos, dir, playerposx, playerposy) {
        var indextop, indexbottom, x, y, unloadx, unloady;
        var halfy = Math.ceil(Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(Chunk.perscreen.x / 2) + 1;
        //might seem a bit backwards mut if we move on the x axis
        //we want to loop through on the y axis
        if (pos == general_2.Position.X) {
            indextop = playerposy + halfy;
            indexbottom = playerposy - halfy;
        }
        else if (pos == general_2.Position.Y) {
            indextop = playerposx + halfx;
            indexbottom = playerposx - halfy;
        }
        while (indextop >= indexbottom) {
            if (pos == general_2.Position.X) {
                y = indextop;
                unloady = indextop;
                if (dir == general_1.Direction.RIGHT) {
                    x = playerposx + halfx;
                    unloadx = playerposx - halfx - 1;
                }
                if (dir == general_1.Direction.LEFT) {
                    x = playerposx - halfx;
                    unloadx = playerposx + halfx + 1;
                }
            }
            if (pos == general_2.Position.Y) {
                x = indextop;
                unloadx = indextop;
                if (dir == general_1.Direction.UP) {
                    y = playerposy + halfy;
                    unloady = playerposy - halfy - 1;
                }
                if (dir == general_1.Direction.DOWN) {
                    y = playerposy - halfy;
                    unloady = playerposy + halfy + 1;
                }
            }
            this.unloadChunk(unloadx, unloady);
            this.loadChunk(x, y);
            indextop--;
        }
    };
    World.prototype.generateChunk = function (x, y, direction) {
        var coords = this.calculateDirection(x, y, direction);
        if (!this.chunkExists(coords.x, coords.y)) {
            var chunk = new Chunk(this.seed, coords.x, coords.y);
            this.drawChunk(chunk);
            this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
            this.loadChunk(coords.x, coords.y);
        }
    };
    World.prototype.chunkExists = function (x, y) {
        return this.chunks[World.coordinatesToString(x, y)] != null;
    };
    World.coordinatesToString = function (x, y) {
        var coords = x.toString() + y.toString();
        coords = coords.replace(/-/g, "m");
        return coords;
    };
    World.prototype.calculateDirection = function (x, y, dir) {
        switch (dir) {
            case general_1.Direction.UP:
                y += 1;
                break;
            case general_1.Direction.RIGHT:
                x += 1;
                break;
            case general_1.Direction.DOWN:
                y -= 1;
                break;
            case general_1.Direction.LEFT:
                x -= 1;
                break;
            default:
        }
        return { "x": x, "y": y };
    };
    World.prototype.drawChunk = function (chunk) {
        var chunkpositionx = canvas_1.Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
        var i = 0;
        for (var _i = 0, _a = chunk.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tilepositionx = chunkpositionx + (tiles_1.Tile.tilesize * tile.x) - (tiles_1.Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (tiles_1.Tile.tilesize * tile.y) - (tiles_1.Tile.tilesize / 2);
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.drawImage(tile.texture, tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
            if (debug_1.Debug.lines) {
                canvas_1.Canvas.context.rect(tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
                canvas_1.Canvas.context.strokeStyle = "rgba(255, 255, 255, 0.5)";
                canvas_1.Canvas.context.stroke();
            }
            i++;
        }
        if (debug_1.Debug.lines) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(chunkpositionx - (tiles_1.Tile.tilesize / 2), chunkpositiony - (tiles_1.Tile.tilesize / 2), Chunk.chunksize, Chunk.chunksize);
            canvas_1.Canvas.context.strokeStyle = "red";
            canvas_1.Canvas.context.stroke();
        }
    };
    World.prototype.generateSeed = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return World;
}());
exports.World = World;
