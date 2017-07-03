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
var Tile = (function () {
    function Tile(x, y, noise) {
        this.texture = new Image();
        this.noise = noise;
        this.x = x;
        this.y = y;
    }
    //randomly pick a texture for the tile (or if only 1 then that one)
    Tile.prototype.setTexture = function (src) {
        var rng = Math.floor(Math.random() * src.length);
        this.texture.src = src[rng];
    };
    return Tile;
}());
Tile.tilesize = 40;
exports.Tile = Tile;
var Grass = (function (_super) {
    __extends(Grass, _super);
    function Grass(x, y, noise) {
        var _this = _super.call(this, x, y, noise) || this;
        _this.textures = [
            "src/img/grass_3.png",
            "src/img/grass_4.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return Grass;
}(Tile));
Grass.id = 1;
exports.Grass = Grass;
var Water = (function (_super) {
    __extends(Water, _super);
    function Water(x, y, noise) {
        var _this = _super.call(this, x, y, noise) || this;
        _this.textures = [
            "src/img/water.png",
            "src/img/water_1.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return Water;
}(Tile));
Water.id = 2;
exports.Water = Water;
var Sand = (function (_super) {
    __extends(Sand, _super);
    function Sand(x, y, noise) {
        var _this = _super.call(this, x, y, noise) || this;
        _this.textures = [
            "src/img/sand.png",
            "src/img/sand_1.png",
            "src/img/sand_2.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return Sand;
}(Tile));
Sand.id = 3;
exports.Sand = Sand;
