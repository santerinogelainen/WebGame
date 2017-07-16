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
var tiles = require("./tile");
var BiomeTemplate = (function () {
    function BiomeTemplate() {
    }
    //each biome has it's own implementation of getTile
    //this function returns a new Tile of the biomes type
    BiomeTemplate.prototype.getTile = function (x, y) { };
    ;
    return BiomeTemplate;
}());
var Plains = (function (_super) {
    __extends(Plains, _super);
    function Plains() {
        var _this = _super.call(this) || this;
        _this.temperature = {
            min: -50,
            max: 50
        };
        _this.humidity = {
            min: -50,
            max: 50
        };
        return _this;
    }
    Plains.prototype.getTile = function (x, y) {
        return new tiles.Grass(x, y);
    };
    return Plains;
}(BiomeTemplate));
Plains.biomename = "Plains";
var Sea = (function () {
    function Sea() {
    }
    Sea.getTile = function (x, y, noise) {
        if (noise < 24) {
            return new tiles.DeepWater(x, y);
        }
        else {
            if (noise <= 27) {
                return new tiles.Water(x, y);
            }
            else {
                return new tiles.Sand(x, y);
            }
        }
    };
    return Sea;
}());
Sea.biomename = "Sea";
Sea.noise = {
    min: 0,
    max: 30
};
exports.Sea = Sea;
var Desert = (function (_super) {
    __extends(Desert, _super);
    function Desert() {
        var _this = _super.call(this) || this;
        _this.temperature = {
            min: 25,
            max: 50
        };
        _this.humidity = {
            min: 0,
            max: 25
        };
        return _this;
    }
    Desert.prototype.getTile = function (x, y) {
        return new tiles.Sand(x, y);
    };
    return Desert;
}(BiomeTemplate));
Desert.biomename = "Desert";
var Forest = (function (_super) {
    __extends(Forest, _super);
    function Forest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.temperature = {
            min: -25,
            max: 25
        };
        _this.humidity = {
            min: -25,
            max: 50
        };
        return _this;
    }
    return Forest;
}(Plains));
Forest.biomename = "Forest";
var Winter = (function (_super) {
    __extends(Winter, _super);
    function Winter() {
        var _this = _super.call(this) || this;
        _this.temperature = {
            min: -50,
            max: -25
        };
        _this.humidity = {
            min: -50,
            max: -25
        };
        return _this;
    }
    Winter.prototype.getTile = function (x, y) {
        return new tiles.Snow(x, y);
    };
    return Winter;
}(BiomeTemplate));
Winter.biomename = "Winter";
var WinterForest = (function (_super) {
    __extends(WinterForest, _super);
    function WinterForest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.temperature = { min: -50, max: -25 };
        _this.humidity = { min: -25, max: 50 };
        return _this;
    }
    return WinterForest;
}(Winter));
WinterForest.biomename = "Winter Forest";
/*class FrozenWater extends BiomeTemplate {
  static biomename = "Frozen Water";
  temperature = {min: 0, max:25};
  humidity = {min: 80, max: 100};

  constructor() {
    super();
  }

  getTile(x: number, y: number) {
    return new tiles.Ice(x, y);
  }
}*/
var Biome = (function () {
    function Biome() {
    }
    return Biome;
}());
Biome.islandsize = 500;
Biome.islandmax = 100;
Biome.tempsize = 150;
Biome.tempmax = 50;
Biome.humsize = 150;
Biome.hummax = 50;
Biome.get = {
    "forest": new Forest(),
    "desert": new Desert(),
    "winterforest": new WinterForest(),
    "winter": new Winter(),
    "plains": new Plains()
};
exports.Biome = Biome;
