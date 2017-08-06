"use strict";
exports.__esModule = true;
var tile_1 = require("./tile");
var general_1 = require("./general");
var canvas_1 = require("./canvas");
var biome_1 = require("./biome");
var debug_1 = require("./debug");
var mouse_1 = require("./mouse");
var Chunk = (function () {
    function Chunk(x, y, seed) {
        this.tiles = {};
        this.x = x;
        this.y = y;
        this.generate(seed);
    }
    Chunk.getMouseCoordinates = function () {
        var x = Math.round((mouse_1.Mouse.position.world.x) / Chunk.size);
        var y = Math.round((mouse_1.Mouse.position.world.y) / Chunk.size);
        return { "x": x, "y": y };
    };
    /*
    * Updates the current hovered chunk and tile
    */
    Chunk.updateHover = function () {
        var coords = Chunk.getMouseCoordinates();
        var chunk = general_1.coordinatesToString(coords.x, coords.y);
        Chunk.hover = chunk;
        tile_1.Tile.updateHover(Chunk.size, coords);
    };
    /*
    * Calculate how many chunks can fit the screen
    */
    Chunk.calculatePerScreenRatio = function () {
        Chunk.perscreen.x = Math.ceil(canvas_1.Canvas.width / Chunk.size);
        Chunk.perscreen.y = Math.ceil(canvas_1.Canvas.height / Chunk.size);
    };
    /*
    * Generates the necessary tiles for the chunk
    */
    Chunk.prototype.generate = function (seed) {
        var r = 1;
        while (r <= Chunk.tilesperside) {
            var c = 1;
            while (c <= Chunk.tilesperside) {
                var tile = void 0;
                var x = r + (this.x * Chunk.tilesperside);
                var y = c + (this.y * Chunk.tilesperside);
                /*let islandnoise = Tile.generateNoise((x / Biome.islandsize), (y / Biome.islandsize), seed.island, true) * Biome.islandmax;
                if (islandnoise >= Sea.noise.min && islandnoise <= Sea.noise.max) {
                  tile = Sea.getTile(r, c, islandnoise);
                } else {*/
                var temp = tile_1.Tile.generateNoise((x / biome_1.Biome.tempsize), (y / biome_1.Biome.tempsize), seed.biome.temp) * biome_1.Biome.tempmax;
                var hum = tile_1.Tile.generateNoise((x / biome_1.Biome.humsize), (y / biome_1.Biome.humsize), seed.biome.hum) * biome_1.Biome.hummax;
                var alt = tile_1.Tile.generateNoise((x / biome_1.Biome.altsize), (y / biome_1.Biome.altsize), seed.biome.alt) * biome_1.Biome.altmax;
                var biome = this.getBiome(temp, hum, alt);
                tile = biome.getTile(r, c);
                //tile.setColorOffset(biome.calculateColorOffset(alt));
                //}
                var name_1 = general_1.coordinatesToString(r, c);
                this.tiles[name_1] = tile;
                c++;
            }
            r++;
        }
    };
    /*
    * Returns the biome that matches the temperature and humidity noise given
    */
    Chunk.prototype.getBiome = function (temp, hum, alt) {
        for (var biome in biome_1.Biome.get) {
            var b = biome_1.Biome.get[biome];
            if ((temp >= b.temperature.min && temp <= b.temperature.max) && (hum >= b.humidity.min && hum <= b.humidity.max)) {
                return b;
            }
        }
    };
    Chunk.prototype.draw = function () {
        var chunk = general_1.coordinatesToString(this.x, this.y);
        var chunkpositionx = canvas_1.Canvas.center.x + (Chunk.size * this.x) - (Chunk.size / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (Chunk.size * -this.y) - (Chunk.size / 2);
        for (var t in this.tiles) {
            var tile = this.tiles[t];
            var tilepositionx = chunkpositionx + (tile_1.Tile.size * (tile.x - 1));
            var tilepositiony = chunkpositiony + (tile_1.Tile.size * -(tile.y)) + Chunk.size;
            if (chunk == Chunk.hover) {
                tile.draw(tilepositionx, tilepositiony, true, t);
            }
            else {
                tile.draw(tilepositionx, tilepositiony, false, t);
            }
        }
        if (debug_1.Debug.worldtext) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.font = "15px sans-serif";
            canvas_1.Canvas.context.fillStyle = "red";
            canvas_1.Canvas.context.fillText("" + this.x + ", " + this.y, chunkpositionx - (tile_1.Tile.size / 2) + 5, chunkpositiony - (tile_1.Tile.size / 2) + 20);
        }
        if (debug_1.Debug.lines) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(chunkpositionx - (tile_1.Tile.size / 2), chunkpositiony - (tile_1.Tile.size / 2), Chunk.size, Chunk.size);
            canvas_1.Canvas.context.strokeStyle = "red";
            canvas_1.Canvas.context.stroke();
        }
    };
    return Chunk;
}());
Chunk.tilesperside = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
Chunk.size = Chunk.tilesperside * tile_1.Tile.size;
Chunk.perscreen = { x: 0, y: 0 };
Chunk.hover = "";
exports.Chunk = Chunk;
