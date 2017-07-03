"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var tiles = require("./tiles");
var BiomeTemplate = (function () {
    function BiomeTemplate() {
    }
    //each biome has it's own implementation of getTile
    //this function returns a new Tile of the biomes type
    BiomeTemplate.prototype.getTile = function (x, y, noise) { };
    ;
    return BiomeTemplate;
}());
var Planes = (function (_super) {
    __extends(Planes, _super);
    function Planes() {
        var _this = _super.call(this) || this;
        _this.min = 0;
        _this.max = 15;
        return _this;
    }
    Planes.prototype.getTile = function (x, y, noise) {
        return new tiles.Grass(x, y, noise);
    };
    return Planes;
}(BiomeTemplate));
Planes.biomename = "Planes";
Planes.id = 1;
var Sea = (function (_super) {
    __extends(Sea, _super);
    function Sea() {
        var _this = _super.call(this) || this;
        _this.min = 16;
        _this.max = 30;
        return _this;
    }
    Sea.prototype.getTile = function (x, y, noise) {
        return new tiles.Water(x, y, noise);
    };
    return Sea;
}(BiomeTemplate));
Sea.biomename = "Sea";
Sea.id = 2;
var Desert = (function (_super) {
    __extends(Desert, _super);
    function Desert() {
        var _this = _super.call(this) || this;
        _this.min = 31;
        _this.max = 45;
        return _this;
    }
    Desert.prototype.getTile = function (x, y, noise) {
        return new tiles.Sand(x, y, noise);
    };
    return Desert;
}(BiomeTemplate));
Desert.biomename = "Desert";
Desert.id = 3;
var Biome = (function () {
    function Biome() {
    }
    return Biome;
}());
Biome.intensity = 300;
Biome.planes = new Planes();
Biome.sea = new Sea();
Biome.desert = new Desert();
Biome.biomes = [Biome.planes, Biome.sea, Biome.desert];
exports.Biome = Biome;
