(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
* Abstract class
*/
var Canvas = (function () {
    function Canvas() {
    }
    /*
    * Since everything is static we can't construct
    * the class so instead we have an initialization method
    * that sets the width and height for the canvas element.
    */
    Canvas.init = function () {
        Canvas.element.width = Canvas.width;
        Canvas.element.height = Canvas.height;
    };
    /*
    * Clears absolutely EVERYTHING off the canvas.
    */
    Canvas.clear = function () {
        Canvas.context.beginPath();
        Canvas.context.clearRect(0, 0, this.width, this.height);
    };
    /*
    * Sets the background color for the canvas
    */
    Canvas.setBackground = function (color) {
        Canvas.bg = color;
        Canvas.context.beginPath();
        Canvas.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
    };
    /*
    * Updates the resolution when the user resizes their window.
    * Useless since the game bugs out when the screen is resized.
    */
    Canvas.updateResolution = function () {
        //update canvas values
        var centerx = (Canvas.width / 2);
        var centery = (Canvas.height / 2);
        Canvas.center = { x: centerx, y: centery };
        Canvas.width = Canvas.element.clientWidth;
        Canvas.height = Canvas.element.clientHeight;
        Canvas.element.width = Canvas.width;
        Canvas.element.height = Canvas.height;
    };
    /*
    * Updates the background in gameloop
    */
    Canvas.updateBackground = function () {
        if (Canvas.bg != null) {
            //clear canvas
            //Canvas.clear();
            //set background color of canvas
            Canvas.setBackground(Canvas.bg);
        }
    };
    return Canvas;
}());
Canvas.element = document.getElementById("canvas");
Canvas.context = Canvas.element.getContext("2d");
Canvas.width = Canvas.element.clientWidth;
Canvas.height = Canvas.element.clientHeight;
Canvas.center = { x: (Canvas.width / 2), y: (Canvas.height / 2) };
exports.Canvas = Canvas;

},{}],2:[function(require,module,exports){
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

},{"./tile":11}],3:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],4:[function(require,module,exports){
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
var canvas_1 = require("./canvas");
var chunk_1 = require("./chunk");
var tile_1 = require("./tile");
var Character = (function () {
    function Character(id, name) {
        this.id = id;
        this.name = name;
    }
    Character.prototype.draw = function (x, y) { };
    ;
    return Character;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(id, name) {
        var _this = _super.call(this, id, name) || this;
        _this.moving = false;
        _this.position = {
            world: { x: 0, y: 0 },
            chunk: { x: 0, y: 0 },
            tile: { x: Math.ceil(chunk_1.Chunk.tilesperside / 2), y: Math.ceil(chunk_1.Chunk.tilesperside / 2) },
            screen: { x: 0, y: 0 }
        };
        _this.draw(canvas_1.Canvas.center.x, canvas_1.Canvas.center.y);
        return _this;
    }
    Player.prototype.draw = function (x, y) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.fillStyle = "#d35400";
        canvas_1.Canvas.context.arc(x - (Player.size), y - (Player.size), Player.size, 0, 2 * Math.PI);
        canvas_1.Canvas.context.fill();
        this.position.screen.x = x;
        this.position.screen.y = y;
    };
    Player.prototype.updatePosition = function (position) {
        switch (position) {
            case general_1.Position.X:
                this.position.chunk.x = Math.round(this.position.world.x / chunk_1.Chunk.chunksize);
                this.position.tile.x = Math.round(chunk_1.Chunk.tilesperside / 2) + Math.round((this.position.world.x / tile_1.Tile.tilesize)) - (this.position.chunk.x * chunk_1.Chunk.tilesperside);
                break;
            case general_1.Position.Y:
                this.position.chunk.y = Math.round(this.position.world.y / chunk_1.Chunk.chunksize);
                this.position.tile.y = Math.round(chunk_1.Chunk.tilesperside / 2) + Math.round((this.position.world.y / tile_1.Tile.tilesize)) - (this.position.chunk.y * chunk_1.Chunk.tilesperside);
                break;
            default:
                console.log("Error: unknown position " + position);
        }
    };
    Player.prototype.walk = function (key) {
        var speed = Player.speed;
        if (key[16]) {
            speed = 2 * speed;
        }
        if (key[87]) {
            canvas_1.Canvas.center.y += speed;
            this.position.world.y += speed;
            this.updatePosition(general_1.Position.Y);
        }
        if (key[65]) {
            canvas_1.Canvas.center.x += speed;
            this.position.world.x -= speed;
            this.updatePosition(general_1.Position.X);
        }
        if (key[83]) {
            canvas_1.Canvas.center.y -= speed;
            this.position.world.y -= speed;
            this.updatePosition(general_1.Position.Y);
        }
        if (key[68]) {
            canvas_1.Canvas.center.x -= speed;
            this.position.world.x += speed;
            this.updatePosition(general_1.Position.X);
        }
    };
    /*
    * Updates the mouse position in relation to the canvas.
    */
    Player.prototype.updateMousePosition = function (e) {
        e = e || window.event;
        var oldPosition = { x: Player.mouse.tile.x, y: Player.mouse.tile.y };
        Player.mouse.world.x = -(canvas_1.Canvas.center.x - e.pageX) + (tile_1.Tile.tilesize / 2);
        Player.mouse.world.y = (canvas_1.Canvas.center.y - e.pageY) - (tile_1.Tile.tilesize / 2);
        Player.mouse.chunk.x = Math.round((Player.mouse.world.x) / chunk_1.Chunk.chunksize);
        Player.mouse.chunk.y = Math.round((Player.mouse.world.y) / chunk_1.Chunk.chunksize);
        Player.mouse.tile.x = Math.floor(((Player.mouse.world.x + (chunk_1.Chunk.chunksize / 2) + tile_1.Tile.tilesize) - (Player.mouse.chunk.x * chunk_1.Chunk.chunksize)) / tile_1.Tile.tilesize);
        Player.mouse.tile.y = Math.floor(((Player.mouse.world.y + (chunk_1.Chunk.chunksize / 2) + tile_1.Tile.tilesize) - (Player.mouse.chunk.y * chunk_1.Chunk.chunksize)) / tile_1.Tile.tilesize);
        var newPosition = { x: Player.mouse.tile.x, y: Player.mouse.tile.y };
        if (newPosition.x != oldPosition.x || newPosition.y != oldPosition.y) {
            chunk_1.Chunk.updateHover(Player.mouse.chunk.x, Player.mouse.chunk.y);
            tile_1.Tile.updateHover(Player.mouse.tile.x, Player.mouse.tile.y);
        }
    };
    return Player;
}(Character));
Player.size = 20;
Player.speed = 3;
Player.mouse = {
    world: { x: 0, y: 0 },
    chunk: { x: 0, y: 0 },
    tile: { x: 0, y: 0 }
};
exports.Player = Player;

},{"./canvas":3,"./chunk":5,"./general":8,"./tile":11}],5:[function(require,module,exports){
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

},{"./Canvas":1,"./biome":2,"./general":8,"./tile":11}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var Debug = (function () {
    function Debug() {
    }
    Debug.draw = function (lines) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.font = Debug.lineHeight + "px sans-serif";
        canvas_1.Canvas.context.fillStyle = "#ffffff";
        var nthLine = 1;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            canvas_1.Canvas.context.fillText(line, 0, nthLine * Debug.lineHeight);
            nthLine++;
        }
    };
    Debug.toggle = function (e) {
        e = e || event;
        if (e.keyCode === 114) {
            e.preventDefault();
            if (Debug.on == true) {
                Debug.on = false;
            }
            else {
                Debug.on = true;
            }
        }
        if (e.keyCode === 115) {
            e.preventDefault();
            if (Debug.lines == true) {
                Debug.lines = false;
            }
            else {
                Debug.lines = true;
            }
        }
        if (e.keyCode === 113) {
            e.preventDefault();
            if (Debug.worldtext == true) {
                Debug.worldtext = false;
            }
            else {
                Debug.worldtext = true;
            }
        }
    };
    return Debug;
}());
Debug.on = false;
Debug.lines = false;
Debug.worldtext = false;
Debug.lineHeight = 15;
exports.Debug = Debug;

},{"./canvas":3}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var general_1 = require("./general");
var general_2 = require("./general");
var chunk_1 = require("./chunk");
var tile_1 = require("./tile");
var character_1 = require("./character");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var tiletip_1 = require("./tiletip");
var settings_1 = require("./settings");
var Game = (function () {
    function Game() {
    }
    Game.updateResolution = function () {
        canvas_1.Canvas.updateResolution();
        chunk_1.Chunk.calculatePerScreenRatio();
        Game.updateScreen(true);
    };
    Game.updateScreen = function (updateResolution) {
        if (updateResolution === void 0) { updateResolution = false; }
        //update background
        canvas_1.Canvas.updateBackground();
        //update each chunk
        for (var _i = 0, _a = Game.world.onscreen; _i < _a.length; _i++) {
            var chunk = _a[_i];
            Game.world.drawChunk(Game.world.chunks[chunk]);
        }
        //update character
        if (updateResolution) {
            Game.player.draw(canvas_1.Canvas.center.x, canvas_1.Canvas.center.y);
        }
        else {
            Game.player.draw(Game.player.position.screen.x, Game.player.position.screen.y);
        }
        //debug
        if (debug_1.Debug.on) {
            debug_1.Debug.draw(Game.getDebugLines());
        }
        //update menus etc
        if (Game.world.chunks[chunk_1.Chunk.hover] != null) {
            tiletip_1.Tiletip.draw(Game.world.chunks[chunk_1.Chunk.hover].tiles[tile_1.Tile.hover]);
        }
    };
    Game.init = function () {
        Game.world = new world_1.World();
        Game.player = new character_1.Player(1, "asd");
        Game.world.genChunksOnScreen(Game.player.position.chunk.x, Game.player.position.chunk.y);
    };
    Game.getDebugLines = function () {
        var debugLines = [
            "FPS: " + Game.curFps + " (limit: " + settings_1.Settings.fpslimit + ")",
            "Loaded chunks: " + Game.world.onscreen.join(", "),
            "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
            "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
            "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
            "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
            "Tiles per chunk (side): " + chunk_1.Chunk.tilesperside,
            "Chunk size: " + chunk_1.Chunk.chunksize,
            "Tile size: " + tile_1.Tile.tilesize
        ];
        return debugLines;
    };
    Game.keypress = function (e) {
        e = e || event;
        Game.key[e.keyCode] = e.type == 'keydown';
        if (Game.key[87] || Game.key[65] || Game.key[83] || Game.key[68]) {
            Game.player.moving = true;
        }
        else {
            Game.player.moving = false;
        }
    };
    Game.comparePositions = function (oldPosition, newPosition) {
        if (oldPosition.x != newPosition.x) {
            if (oldPosition.x > newPosition.x) {
                Game.world.loadChunksOnWalk(general_2.Position.X, general_1.Direction.LEFT, newPosition.x, newPosition.y);
            }
            if (oldPosition.x < newPosition.x) {
                Game.world.loadChunksOnWalk(general_2.Position.X, general_1.Direction.RIGHT, newPosition.x, newPosition.y);
            }
        }
        if (oldPosition.y != newPosition.y) {
            if (oldPosition.y > newPosition.y) {
                Game.world.loadChunksOnWalk(general_2.Position.Y, general_1.Direction.DOWN, newPosition.x, newPosition.y);
            }
            if (oldPosition.y < newPosition.y) {
                Game.world.loadChunksOnWalk(general_2.Position.Y, general_1.Direction.UP, newPosition.x, newPosition.y);
            }
        }
    };
    Game.loop = function () {
        requestAnimationFrame(Game.loop);
        Game.curTime = Date.now();
        Game.elapsed = Game.curTime - Game.timeInterval;
        if (Game.elapsed > Game.fpsInterval) {
            Game.timeInterval = Game.curTime - (Game.elapsed % Game.fpsInterval);
            var oldPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
            Game.player.walk(Game.key);
            var newPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
            Game.comparePositions(oldPosition, newPosition);
            Game.updateScreen();
            var sinceStart = Game.curTime - Game.startTime;
            Game.curFps = Math.round(1000 / (sinceStart / ++Game.frameCount));
        }
    };
    Game.run = function () {
        Game.fpsInterval = 1000 / settings_1.Settings.fpslimit;
        Game.timeInterval = Date.now();
        Game.startTime = Game.timeInterval;
        Game.loop();
    };
    return Game;
}());
Game.key = {};
Game.frameCount = 0;
exports.Game = Game;

},{"./canvas":3,"./character":4,"./chunk":5,"./debug":6,"./general":8,"./settings":10,"./tile":11,"./tiletip":12,"./world":13}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
})(Direction = exports.Direction || (exports.Direction = {}));
var Position;
(function (Position) {
    Position[Position["X"] = 0] = "X";
    Position[Position["Y"] = 1] = "Y";
    Position[Position["Z"] = 2] = "Z";
})(Position = exports.Position || (exports.Position = {}));
var HorizontalAlign;
(function (HorizontalAlign) {
    HorizontalAlign[HorizontalAlign["LEFT"] = 0] = "LEFT";
    HorizontalAlign[HorizontalAlign["CENTER"] = 1] = "CENTER";
    HorizontalAlign[HorizontalAlign["RIGHT"] = 2] = "RIGHT";
})(HorizontalAlign = exports.HorizontalAlign || (exports.HorizontalAlign = {}));
var VerticalAlign;
(function (VerticalAlign) {
    VerticalAlign[VerticalAlign["TOP"] = 0] = "TOP";
    VerticalAlign[VerticalAlign["MIDDLE"] = 1] = "MIDDLE";
    VerticalAlign[VerticalAlign["BOTTOM"] = 2] = "BOTTOM";
})(VerticalAlign = exports.VerticalAlign || (exports.VerticalAlign = {}));
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.rng = rng;
var Color = (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        if (a != null) {
            this.a = a;
        }
        else {
            this.a = 1;
        }
    }
    Color.prototype.toRGBA = function () {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };
    return Color;
}());
exports.Color = Color;
/*
* Returns a string version of the coordinates given.
* Example:
* -1, 4   ===   "m14"
* 0, -12  ===   "0m12"
*/
function coordinatesToString(x, y) {
    var coords = x.toString() + y.toString();
    coords = coords.replace(/-/g, "m");
    return coords;
}
exports.coordinatesToString = coordinatesToString;

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var game_1 = require("./game");
var debug_1 = require("./debug");
window.onload = function () {
    //init everything
    canvas_1.Canvas.init();
    canvas_1.Canvas.setBackground(new general_1.Color(0, 0, 0, 1));
    game_1.Game.init();
    canvas_1.Canvas.element.onmousemove = game_1.Game.player.updateMousePosition;
    game_1.Game.run();
    window.addEventListener("keydown", debug_1.Debug.toggle, false);
    window.addEventListener("keydown", game_1.Game.keypress, false);
    window.addEventListener("keyup", game_1.Game.keypress, false);
};
window.onresize = function () {
    game_1.Game.updateResolution();
};

},{"./canvas":3,"./debug":6,"./game":7,"./general":8}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var general_1 = require("./general");
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
Settings.usetilecolor = true;
Settings.tilehovercolor = new general_1.Color(255, 215, 0, 1);
Settings.tilehoverlinewidth = 2;
Settings.fpslimit = 50;
exports.Settings = Settings;

},{"./general":8}],11:[function(require,module,exports){
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
var Tile = (function () {
    function Tile(x, y) {
        this.texture = new Image();
        this.x = x;
        this.y = y;
    }
    /*
    * Updates the current hovered tile
    */
    Tile.updateHover = function (x, y) {
        var tile = general_2.coordinatesToString(x, y);
        Tile.hover = tile;
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
            canvas_1.Canvas.context.rect(x, y, Tile.tilesize, Tile.tilesize);
            canvas_1.Canvas.context.strokeStyle = this.color.toRGBA();
            canvas_1.Canvas.context.stroke();
        }
        else {
            if (settings_1.Settings.usetilecolor) {
                canvas_1.Canvas.context.fillStyle = this.color.toRGBA();
                canvas_1.Canvas.context.fillRect(x, y, Tile.tilesize, Tile.tilesize);
            }
            else {
                canvas_1.Canvas.context.drawImage(this.texture, x, y, Tile.tilesize, Tile.tilesize);
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
        canvas_1.Canvas.context.strokeRect(x, y, Tile.tilesize, Tile.tilesize);
    };
    return Tile;
}());
Tile.tilesize = 40;
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

},{"./canvas":3,"./debug":6,"./general":8,"./settings":10}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var general_3 = require("./general");
var Tiletip = (function () {
    function Tiletip() {
    }
    Tiletip.draw = function (tile) {
        canvas_1.Canvas.context.beginPath();
        canvas_1.Canvas.context.font = "15px sans-serif";
        canvas_1.Canvas.context.textBaseline = "top";
        var text = tile.name;
        var width = canvas_1.Canvas.context.measureText(text).width;
        var height = Tiletip.fontsize;
        var x = Tiletip.getX(width);
        var y = Tiletip.getY(Tiletip.fontsize);
        canvas_1.Canvas.context.fillStyle = Tiletip.backgroundcolor.toRGBA();
        canvas_1.Canvas.context.fillRect((x - Tiletip.padding), (y - Tiletip.padding), (width + (2 * Tiletip.padding)), (height + (2 * Tiletip.padding)));
        canvas_1.Canvas.context.fillStyle = Tiletip.color.toRGBA();
        canvas_1.Canvas.context.fillText(text, x, y);
    };
    Tiletip.getX = function (textwidth) {
        switch (Tiletip.horizontal) {
            case general_1.HorizontalAlign.LEFT:
                return Tiletip.offset;
            case general_1.HorizontalAlign.CENTER:
                return (canvas_1.Canvas.width / 2) - (textwidth / 2);
            case general_1.HorizontalAlign.RIGHT:
                return canvas_1.Canvas.width - textwidth - Tiletip.offset;
            default:
                console.log("Unknown align: " + Tiletip.horizontal);
                return null;
        }
    };
    Tiletip.getY = function (textheight) {
        switch (Tiletip.vertical) {
            case general_2.VerticalAlign.TOP:
                return Tiletip.offset;
            case general_2.VerticalAlign.MIDDLE:
                return (canvas_1.Canvas.height / 2) - (textheight / 2);
            case general_2.VerticalAlign.BOTTOM:
                return canvas_1.Canvas.height - textheight - Tiletip.offset;
            default:
                console.log("Unknown align: " + Tiletip.vertical);
                return null;
        }
    };
    return Tiletip;
}());
Tiletip.offset = 10;
Tiletip.padding = 5;
Tiletip.fontsize = 15;
Tiletip.color = new general_3.Color(255, 255, 255);
Tiletip.backgroundcolor = new general_3.Color(0, 0, 0);
Tiletip.vertical = general_2.VerticalAlign.TOP;
Tiletip.horizontal = general_1.HorizontalAlign.CENTER;
exports.Tiletip = Tiletip;

},{"./canvas":3,"./general":8}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var tile_1 = require("./tile");
var debug_1 = require("./debug");
var chunk_1 = require("./chunk");
var general_3 = require("./general");
var general_4 = require("./general");
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
        chunk_1.Chunk.calculatePerScreenRatio();
        this.generateSeed();
    }
    /*
    * Pushes the chunk to the onscreen array.
    * If chunk does not exist yet, it will automaticaly create one.
    * See World.onscreen variable
    */
    World.prototype.loadChunk = function (x, y) {
        if (this.chunkExists(x, y)) {
            if (this.onscreen.indexOf(general_4.coordinatesToString(x, y)) == -1) {
                this.onscreen.push(general_4.coordinatesToString(x, y));
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
        var halfy = Math.ceil(chunk_1.Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(chunk_1.Chunk.perscreen.x / 2) + 1;
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
        var arrayindex = this.onscreen.indexOf(general_4.coordinatesToString(x, y));
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
        var halfy = Math.ceil(chunk_1.Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(chunk_1.Chunk.perscreen.x / 2) + 1;
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
            var chunk = new chunk_1.Chunk(coords.x, coords.y, this.seed);
            this.chunks[general_4.coordinatesToString(coords.x, coords.y)] = chunk;
            this.loadChunk(coords.x, coords.y);
        }
    };
    /*
    * Checks if the chunk exists in the chunks variable.
    * Returns: boolean
    */
    World.prototype.chunkExists = function (x, y) {
        return this.chunks[general_4.coordinatesToString(x, y)] != null;
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
    World.prototype.drawChunk = function (chunk) {
        var c = general_4.coordinatesToString(chunk.x, chunk.y);
        var chunkpositionx = canvas_1.Canvas.center.x + (chunk_1.Chunk.chunksize * chunk.x) - (chunk_1.Chunk.chunksize / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (chunk_1.Chunk.chunksize * -chunk.y) - (chunk_1.Chunk.chunksize / 2);
        for (var tile in chunk.tiles) {
            var t = chunk.tiles[tile];
            var tilepositionx = chunkpositionx + (tile_1.Tile.tilesize * (t.x - 1)) - (tile_1.Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (tile_1.Tile.tilesize * -(t.y)) - (tile_1.Tile.tilesize / 2) + chunk_1.Chunk.chunksize;
            if (c == chunk_1.Chunk.hover) {
                t.draw(tilepositionx, tilepositiony, true, tile);
            }
            else {
                t.draw(tilepositionx, tilepositiony, false, tile);
            }
        }
        if (debug_1.Debug.worldtext) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.font = "15px sans-serif";
            canvas_1.Canvas.context.fillStyle = "red";
            canvas_1.Canvas.context.fillText("" + chunk.x + ", " + chunk.y, chunkpositionx - (tile_1.Tile.tilesize / 2) + 5, chunkpositiony - (tile_1.Tile.tilesize / 2) + 20);
        }
        if (debug_1.Debug.lines) {
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(chunkpositionx - (tile_1.Tile.tilesize / 2), chunkpositiony - (tile_1.Tile.tilesize / 2), chunk_1.Chunk.chunksize, chunk_1.Chunk.chunksize);
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

},{"./canvas":3,"./chunk":5,"./debug":6,"./general":8,"./tile":11}]},{},[9]);
