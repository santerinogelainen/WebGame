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
        this.temperature = { min: 0, max: 0 };
        this.humidity = { min: 0, max: 0 };
    }
    //each biome has it's own implementation of getTile
    //this function returns a new Tile of the biomes type
    BiomeTemplate.prototype.getTile = function (x, y, hum, temp) { };
    ;
    return BiomeTemplate;
}());
var Plains = (function (_super) {
    __extends(Plains, _super);
    function Plains() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 0, max: 100 };
        _this.humidity = { min: 0, max: 100 };
        return _this;
    }
    Plains.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Grass(x, y, hum, temp);
    };
    return Plains;
}(BiomeTemplate));
Plains.biomename = "Plains";
Plains.id = 1;
var Sea = (function (_super) {
    __extends(Sea, _super);
    function Sea() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 25, max: 100 };
        _this.humidity = { min: 75, max: 100 };
        return _this;
    }
    Sea.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Water(x, y, hum, temp);
    };
    return Sea;
}(BiomeTemplate));
Sea.biomename = "Sea";
Sea.id = 2;
var Desert = (function (_super) {
    __extends(Desert, _super);
    function Desert() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 75, max: 100 };
        _this.humidity = { min: 0, max: 25 };
        return _this;
    }
    Desert.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Sand(x, y, hum, temp);
    };
    return Desert;
}(BiomeTemplate));
Desert.biomename = "Desert";
Desert.id = 3;
var Forest = (function (_super) {
    __extends(Forest, _super);
    function Forest() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 25, max: 100 };
        _this.humidity = { min: 25, max: 75 };
        return _this;
    }
    Forest.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Grass(x, y, hum, temp);
    };
    return Forest;
}(BiomeTemplate));
Forest.biomename = "Forest";
Forest.id = 4;
var Winter = (function (_super) {
    __extends(Winter, _super);
    function Winter() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 0, max: 25 };
        _this.humidity = { min: 0, max: 50 };
        return _this;
    }
    Winter.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Snow(x, y, hum, temp);
    };
    return Winter;
}(BiomeTemplate));
Winter.biomename = "Winter";
Winter.id = 5;
var FrozenWater = (function (_super) {
    __extends(FrozenWater, _super);
    function FrozenWater() {
        var _this = _super.call(this) || this;
        _this.temperature = { min: 0, max: 25 };
        _this.humidity = { min: 50, max: 100 };
        return _this;
    }
    FrozenWater.prototype.getTile = function (x, y, hum, temp) {
        return new tiles.Ice(x, y, hum, temp);
    };
    return FrozenWater;
}(BiomeTemplate));
FrozenWater.biomename = "Frozen Water";
FrozenWater.id = 5;
var Biome = (function () {
    function Biome() {
    }
    return Biome;
}());
Biome.intensity = 250;
Biome.maxtemp = 100;
Biome.maxhum = 100;
Biome.plains = new Plains();
Biome.sea = new Sea();
Biome.desert = new Desert();
Biome.forest = new Forest();
Biome.winter = new Winter();
Biome.frozenwater = new FrozenWater();
Biome.biomes = [Biome.frozenwater, Biome.winter, Biome.desert, Biome.sea, Biome.forest, Biome.plains];
exports.Biome = Biome;
