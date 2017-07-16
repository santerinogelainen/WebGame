"use strict";
exports.__esModule = true;
var tile_1 = require("./tile");
var general_1 = require("./general");
var Canvas_1 = require("./Canvas");
var biome_1 = require("./biome");
var biome_2 = require("./biome");
var Chunk = (function () {
    function Chunk(x, y, seed) {
        this.tiles = {};
        this.x = x;
        this.y = y;
        this.generate(seed);
    }
    /*
    * Updates the current hovered chunk
    */
    Chunk.updateHover = function (x, y) {
        var chunk = general_1.coordinatesToString(x, y);
        Chunk.hover = chunk;
    };
    /*
    * Calculate how many chunks can fit the screen
    */
    Chunk.calculatePerScreenRatio = function () {
        Chunk.perscreen.x = Math.ceil(Canvas_1.Canvas.width / Chunk.chunksize);
        Chunk.perscreen.y = Math.ceil(Canvas_1.Canvas.height / Chunk.chunksize);
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
                var islandnoise = tile_1.Tile.generateNoise((x / biome_1.Biome.islandsize), (y / biome_1.Biome.islandsize), seed.island, true) * biome_1.Biome.islandmax;
                if (islandnoise >= biome_2.Sea.noise.min && islandnoise <= biome_2.Sea.noise.max) {
                    tile = biome_2.Sea.getTile(r, c, islandnoise);
                }
                else {
                    var temp = tile_1.Tile.generateNoise((x / biome_1.Biome.tempsize), (y / biome_1.Biome.tempsize), seed.biome.temp) * biome_1.Biome.tempmax;
                    var hum = tile_1.Tile.generateNoise((x / biome_1.Biome.humsize), (y / biome_1.Biome.humsize), seed.biome.hum) * biome_1.Biome.hummax;
                    var biome = this.getBiome(temp, hum);
                    tile = biome.getTile(r, c);
                }
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
    Chunk.prototype.getBiome = function (temp, hum) {
        for (var biome in biome_1.Biome.get) {
            var b = biome_1.Biome.get[biome];
            if ((temp >= b.temperature.min && temp <= b.temperature.max) && (hum >= b.humidity.min && hum <= b.humidity.max)) {
                return b;
            }
        }
    };
    return Chunk;
}());
Chunk.tilesperside = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
Chunk.chunksize = Chunk.tilesperside * tile_1.Tile.tilesize;
Chunk.loadsensitivity = 2;
Chunk.perscreen = { x: 0, y: 0 };
Chunk.hover = "";
exports.Chunk = Chunk;
