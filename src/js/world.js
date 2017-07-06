"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var tiles_1 = require("./tiles");
var debug_1 = require("./debug");
var biomes_1 = require("./biomes");
var biomes_2 = require("./biomes");
var settings_1 = require("./settings");
var general_3 = require("./general");
var Chunk = (function () {
    function Chunk(x, y, seed) {
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
        var r = 1;
        while (r <= Chunk.tilesperside) {
            var c = 1;
            while (c <= Chunk.tilesperside) {
                var tile = void 0;
                var x = r + (this.x * Chunk.tilesperside);
                var y = c + (this.y * Chunk.tilesperside);
                var islandnoise = tiles_1.Tile.generateNoise((x / biomes_1.Biome.islandsize), (y / biomes_1.Biome.islandsize), seed.island, true) * biomes_1.Biome.islandmax;
                if (islandnoise >= biomes_2.Sea.noise.min && islandnoise <= biomes_2.Sea.noise.max) {
                    tile = biomes_2.Sea.getTile(r, c, islandnoise);
                }
                else {
                    console.log("x: " + x + ", y: " + y);
                    var temp = tiles_1.Tile.generateNoise((x / biomes_1.Biome.tempsize), (y / biomes_1.Biome.tempsize), seed.biome.temp) * biomes_1.Biome.tempmax;
                    var hum = tiles_1.Tile.generateNoise((x / biomes_1.Biome.humsize), (y / biomes_1.Biome.humsize), seed.biome.hum) * biomes_1.Biome.hummax;
                    console.log(seed);
                    console.log("temp: " + temp + ", hum: " + hum);
                    var biome = this.getBiome(temp, hum);
                    tile = biome.getTile(r, c);
                }
                this.tiles.push(tile);
                c++;
            }
            r++;
        }
    };
    Chunk.prototype.getBiome = function (temp, hum) {
        for (var biome in biomes_1.Biome.get) {
            var b = biomes_1.Biome.get[biome];
            if ((temp >= b.temperature.min && temp <= b.temperature.max) && (hum >= b.humidity.min && hum <= b.humidity.max)) {
                return b;
            }
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
        this.seed = {
            island: 0,
            biome: {
                temp: 0,
                hum: 0
            }
        };
        this.chunks = {};
        this.onscreen = [];
        Chunk.calculatePerScreenRatio();
        this.generateSeed();
        this.generateChunk(0, 0);
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
            var chunk = new Chunk(coords.x, coords.y, this.seed);
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
        for (var _i = 0, _a = chunk.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tilepositionx = chunkpositionx + (tiles_1.Tile.tilesize * (tile.x - 1)) - (tiles_1.Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (tiles_1.Tile.tilesize * -(tile.y)) - (tiles_1.Tile.tilesize / 2) + Chunk.chunksize;
            canvas_1.Canvas.context.beginPath();
            if (debug_1.Debug.lines) {
                canvas_1.Canvas.context.rect(tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
                canvas_1.Canvas.context.strokeStyle = "rgba(255, 255, 255, 0.5)";
                canvas_1.Canvas.context.stroke();
            }
            else {
                if (settings_1.Settings.usetilecolor) {
                    canvas_1.Canvas.context.fillStyle = tile.color.getRGBA();
                    canvas_1.Canvas.context.fillRect(tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
                }
                else {
                    canvas_1.Canvas.context.drawImage(tile.texture, tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
                }
            }
            if (debug_1.Debug.worldtext) {
                canvas_1.Canvas.context.font = "10px sans-serif";
                canvas_1.Canvas.context.fillStyle = "rgba(255, 255, 255, 0.5)";
                canvas_1.Canvas.context.fillText("" + tile.x + ", " + tile.y, tilepositionx + 5, tilepositiony + 22);
                canvas_1.Canvas.context.fillText("" + (tile.x + (chunk.x * Chunk.tilesperside)) + ", " + (tile.y + (chunk.y * Chunk.tilesperside)), tilepositionx + 5, tilepositiony + 32);
            }
        }
        if (debug_1.Debug.worldtext) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.font = "15px sans-serif";
            canvas_1.Canvas.context.fillStyle = "red";
            canvas_1.Canvas.context.fillText("" + chunk.x + ", " + chunk.y, chunkpositionx - (tiles_1.Tile.tilesize / 2) + 5, chunkpositiony - (tiles_1.Tile.tilesize / 2) + 20);
        }
        if (debug_1.Debug.lines) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(chunkpositionx - (tiles_1.Tile.tilesize / 2), chunkpositiony - (tiles_1.Tile.tilesize / 2), Chunk.chunksize, Chunk.chunksize);
            canvas_1.Canvas.context.strokeStyle = "red";
            canvas_1.Canvas.context.stroke();
        }
    };
    World.prototype.generateSeed = function () {
        this.seed.island = general_3.rng(1, 65536);
        this.seed.biome.temp = general_3.rng(1, 65536);
        this.seed.biome.hum = general_3.rng(1, 65536);
    };
    return World;
}());
exports.World = World;
