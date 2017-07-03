"use strict";
exports.__esModule = true;
var tiles = require("./tiles");
var Planes = (function () {
    function Planes() {
        this.id = 1;
        this.min = -10;
        this.max = 10;
    }
    Planes.prototype.getTile = function (x, y, noise) {
        return new tiles.Grass(x, y, noise);
    };
    return Planes;
}());
var Sea = (function () {
    function Sea() {
        this.id = 2;
        this.min = 11;
        this.max = 40;
    }
    Sea.prototype.getTile = function (x, y, noise) {
        return new tiles.Water(x, y, noise);
    };
    return Sea;
}());
var Biome = (function () {
    function Biome() {
    }
    return Biome;
}());
Biome.intensity = 300;
Biome.planes = new Planes();
Biome.sea = new Sea();
Biome.biomes = [Biome.planes, Biome.sea];
exports.Biome = Biome;
