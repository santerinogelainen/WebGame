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
var general_1 = require("./general");
var settings_1 = require("./settings");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var general_2 = require("./general");
var mouse_1 = require("./mouse");
var Tile = (function () {
    function Tile(x, y) {
        this.texture = new Image();
        this.x = x;
        this.y = y;
    }
    Tile.getMouseCoordinates = function (chunksize, chunk) {
        var x = Math.floor(((mouse_1.Mouse.position.world.x + (chunksize / 2) + Tile.size) - (chunk.x * chunksize)) / Tile.size);
        var y = Math.floor(((mouse_1.Mouse.position.world.y + (chunksize / 2) + Tile.size) - (chunk.y * chunksize)) / Tile.size);
        return { "x": x, "y": y };
    };
    /*
    * Updates the current hovered tile
    */
    Tile.updateHover = function (chunksize, chunk) {
        var tile = Tile.getMouseCoordinates(chunksize, chunk);
        var tilestring = general_2.coordinatesToString(tile.x, tile.y);
        Tile.hover = tilestring;
    };
    //randomly pick a texture for the tile (or if only 1 then that one)
    Tile.prototype.setTexture = function (src) {
        var rng = Math.floor(Math.random() * src.length);
        this.texture.src = src[rng];
    };
    Tile.generateNoise = function (x, y, seed, abs) {
        if (abs === void 0) { abs = false; }
        if (seed != null) {
            noise.seed(seed);
        }
        if (abs) {
            return Math.abs(noise.simplex2(x, y));
        }
        else {
            return noise.simplex2(x, y);
        }
    };
    Tile.prototype.draw = function (x, y, chunk, tile) {
        canvas_1.Canvas.context.beginPath();
        if (debug_1.Debug.lines) {
            canvas_1.Canvas.context.rect(x, y, Tile.size, Tile.size);
            canvas_1.Canvas.context.strokeStyle = this.color.toRGBA();
            canvas_1.Canvas.context.stroke();
        }
        else {
            if (settings_1.Settings.usetilecolor) {
                canvas_1.Canvas.context.fillStyle = this.color.toRGBA();
                canvas_1.Canvas.context.fillRect(x, y, Tile.size, Tile.size);
            }
            else {
                canvas_1.Canvas.context.drawImage(this.texture, x, y, Tile.size, Tile.size);
            }
        }
        if (debug_1.Debug.worldtext) {
            canvas_1.Canvas.context.font = "10px sans-serif";
            canvas_1.Canvas.context.fillStyle = "rgba(255, 255, 255, 0.5)";
            canvas_1.Canvas.context.fillText("" + this.x + ", " + this.y, x + 5, y + 22);
        }
        if (chunk && Tile.hover == tile) {
            this.drawStroke(x, y);
        }
    };
    Tile.prototype.drawStroke = function (x, y) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.lineWidth = settings_1.Settings.tilehoverlinewidth;
        canvas_1.Canvas.context.strokeStyle = settings_1.Settings.tilehovercolor.toRGBA();
        canvas_1.Canvas.context.strokeRect(x, y, Tile.size, Tile.size);
    };
    return Tile;
}());
Tile.size = 40;
Tile.hover = "";
exports.Tile = Tile;
var Grass = (function (_super) {
    __extends(Grass, _super);
    function Grass(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(77, 189, 51, 1);
        _this.name = "Grass";
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
var DeepWater = (function (_super) {
    __extends(DeepWater, _super);
    function DeepWater(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(38, 98, 133, 1);
        _this.name = "Deep Water";
        _this.textures = [
            "src/img/water.png",
            "src/img/water_1.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return DeepWater;
}(Tile));
DeepWater.id = 2;
exports.DeepWater = DeepWater;
var Water = (function (_super) {
    __extends(Water, _super);
    function Water(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(64, 164, 223, 1);
        _this.name = "Water";
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
    function Sand(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(237, 201, 175, 1);
        _this.name = "Sand";
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
var Ice = (function (_super) {
    __extends(Ice, _super);
    function Ice(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(212, 240, 255, 1);
        _this.name = "Ice";
        _this.textures = [
            "src/img/ice.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return Ice;
}(Tile));
Ice.id = 4;
exports.Ice = Ice;
var Snow = (function (_super) {
    __extends(Snow, _super);
    function Snow(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = new general_1.Color(248, 248, 255, 1);
        _this.name = "Snow";
        _this.textures = [
            "src/img/snow.png"
        ];
        _this.setTexture(_this.textures);
        return _this;
    }
    return Snow;
}(Tile));
Snow.id = 5;
exports.Snow = Snow;
