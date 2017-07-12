"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var tiles_1 = require("./tiles");
var debug_1 = require("./debug");
var biomes_1 = require("./biomes");
var biomes_2 = require("./biomes");
var general_3 = require("./general");
var Chunk = (function () {
    function Chunk(x, y, seed) {
        this.tiles = {};
        this.x = x;
        this.y = y;
        this.generate(seed);
    }
    /*
    * Calculate how many chunks can fit the screen
    */
    Chunk.calculatePerScreenRatio = function () {
        Chunk.perscreen.x = Math.ceil(canvas_1.Canvas.width / Chunk.chunksize);
        Chunk.perscreen.y = Math.ceil(canvas_1.Canvas.height / Chunk.chunksize);
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
                var islandnoise = tiles_1.Tile.generateNoise((x / biomes_1.Biome.islandsize), (y / biomes_1.Biome.islandsize), seed.island, true) * biomes_1.Biome.islandmax;
                if (islandnoise >= biomes_2.Sea.noise.min && islandnoise <= biomes_2.Sea.noise.max) {
                    tile = biomes_2.Sea.getTile(r, c, islandnoise);
                }
                else {
                    var temp = tiles_1.Tile.generateNoise((x / biomes_1.Biome.tempsize), (y / biomes_1.Biome.tempsize), seed.biome.temp) * biomes_1.Biome.tempmax;
                    var hum = tiles_1.Tile.generateNoise((x / biomes_1.Biome.humsize), (y / biomes_1.Biome.humsize), seed.biome.hum) * biomes_1.Biome.hummax;
                    var biome = this.getBiome(temp, hum);
                    tile = biome.getTile(r, c);
                }
                var name_1 = World.coordinatesToString(r, c);
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
    /*
    * On creation, calculate chunk per screen ratio and generate all 3 world seeds
    * See: World.seed variable
    */
    function World() {
        //all seeds for for the chunks / world generation
        this.seed = {
            island: 0,
            biome: {
                temp: 0,
                hum: 0
            }
        };
        //all the chunks that have been loaded
        this.chunks = {};
        /*
        * All the chunks that are on the screen.
        * This will update when the player moves.
        * Only these chunks will be drawn on the canvas, to prevent massive lag.
        */
        this.onscreen = [];
        Chunk.calculatePerScreenRatio();
        this.generateSeed();
    }
    /*
    * Pushes the chunk to the onscreen array.
    * If chunk does not exist yet, it will automaticaly create one.
    * See World.onscreen variable
    */
    World.prototype.loadChunk = function (x, y) {
        if (this.chunkExists(x, y)) {
            if (this.onscreen.indexOf(World.coordinatesToString(x, y)) == -1) {
                this.onscreen.push(World.coordinatesToString(x, y));
            }
        }
        else {
            this.generateChunk(x, y);
        }
    };
    /*
    * Generate ALL the chunks that are currently on the screen.
    * This should only be used when the game is started.
    */
    World.prototype.genChunksOnScreen = function (playerposx, playerposy) {
        var x, y, stopx, stopy;
        var halfy = Math.ceil(Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(Chunk.perscreen.x / 2) + 1;
        x = playerposx - halfx;
        stopx = playerposx + halfx;
        y = playerposy - halfy;
        stopy = playerposy + halfy;
        while (x <= stopx) {
            while (y <= stopy) {
                this.loadChunk(x, y);
                y++;
            }
            y = playerposy - halfy;
            x++;
        }
    };
    /*
    * Removes the chunk from the onscreen array.
    * See World.onscreen variable
    */
    World.prototype.unloadChunk = function (x, y) {
        var arrayindex = this.onscreen.indexOf(World.coordinatesToString(x, y));
        if (arrayindex > -1) {
            this.onscreen.splice(arrayindex, 1);
        }
    };
    /*
    * Loads the "next" chunks when player moves.
    * Example:
    * If player moves up then it load all the chunks in the up direction
    */
    World.prototype.loadChunksOnWalk = function (pos, dir, playerposx, playerposy) {
        var indextop, indexbottom, x, y, unloadx, unloady;
        var halfy = Math.ceil(Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(Chunk.perscreen.x / 2) + 1;
        //might seem a bit backwards mut if we move on the x axis
        //we want to loop through on the y axis
        if (pos == general_2.Position.X) {
            indextop = playerposy + halfy + 1;
            indexbottom = playerposy - halfy - 1;
        }
        else if (pos == general_2.Position.Y) {
            indextop = playerposx + halfx + 1;
            indexbottom = playerposx - halfy - 1;
        }
        while (indextop >= indexbottom) {
            if (pos == general_2.Position.X) {
                y = indextop;
                unloady = indextop;
                if (dir == general_1.Direction.RIGHT) {
                    x = playerposx + halfx - 1;
                    unloadx = playerposx - halfx - 1;
                }
                if (dir == general_1.Direction.LEFT) {
                    x = playerposx - halfx + 1;
                    unloadx = playerposx + halfx + 1;
                }
            }
            if (pos == general_2.Position.Y) {
                x = indextop;
                unloadx = indextop;
                if (dir == general_1.Direction.UP) {
                    y = playerposy + halfy - 1;
                    unloady = playerposy - halfy - 1;
                }
                if (dir == general_1.Direction.DOWN) {
                    y = playerposy - halfy + 1;
                    unloady = playerposy + halfy + 1;
                }
            }
            this.unloadChunk(unloadx, unloady);
            this.loadChunk(x, y);
            indextop--;
        }
    };
    /* Creates a new chunk */
    World.prototype.generateChunk = function (x, y, direction) {
        var coords = this.calculateDirection(x, y, direction);
        if (!this.chunkExists(coords.x, coords.y)) {
            var chunk = new Chunk(coords.x, coords.y, this.seed);
            this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
            this.loadChunk(coords.x, coords.y);
        }
    };
    /*
    * Checks if the chunk exists in the chunks variable.
    * Returns: boolean
    */
    World.prototype.chunkExists = function (x, y) {
        return this.chunks[World.coordinatesToString(x, y)] != null;
    };
    /*
    * Returns a string version of the coordinates given.
    * Example:
    * -1, 4   ===   "m14"
    * 0, -12  ===   "0m12"
    */
    World.coordinatesToString = function (x, y) {
        var coords = x.toString() + y.toString();
        coords = coords.replace(/-/g, "m");
        return coords;
    };
    /*
    * Changes the coordinates to the direction given.
    * Returns a object with 2 values: x and y
    */
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
    /*
    * Draws a single chunk
    */
    World.prototype.drawChunk = function (chunk, hover) {
        var c = World.coordinatesToString(chunk.x, chunk.y);
        var chunkpositionx = canvas_1.Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
        for (var tile in chunk.tiles) {
            var t = chunk.tiles[tile];
            var tilepositionx = chunkpositionx + (tiles_1.Tile.tilesize * (t.x - 1)) - (tiles_1.Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (tiles_1.Tile.tilesize * -(t.y)) - (tiles_1.Tile.tilesize / 2) + Chunk.chunksize;
            t.draw(tilepositionx, tilepositiony);
            if (c == hover.chunk && tile == hover.tile) {
                t.drawStroke(tilepositionx, tilepositiony);
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
    /*
    * Generates all 3 seeds for the world generation noise functions
    */
    World.prototype.generateSeed = function () {
        this.seed.island = general_3.rng(1, 65536);
        this.seed.biome.temp = general_3.rng(1, 65536);
        this.seed.biome.hum = general_3.rng(1, 65536);
    };
    return World;
}());
exports.World = World;
