(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./tiles":8}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Canvas = (function () {
    function Canvas() {
    }
    Canvas.init = function () {
        Canvas.element.width = Canvas.width;
        Canvas.element.height = Canvas.height;
    };
    Canvas.clear = function () {
        Canvas.context.clearRect(0, 0, this.width, this.height);
    };
    Canvas.setBackground = function (color) {
        Canvas.bg = color;
        Canvas.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
    };
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
    Canvas.updateBackground = function () {
        if (Canvas.bg != null) {
            //clear canvas
            Canvas.clear();
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

},{}],3:[function(require,module,exports){
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
var world_1 = require("./world");
var tiles_1 = require("./tiles");
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
            tile: { x: Math.ceil(world_1.Chunk.tilesperside / 2), y: Math.ceil(world_1.Chunk.tilesperside / 2) },
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
                this.position.chunk.x = Math.round(this.position.world.x / world_1.Chunk.chunksize);
                this.position.tile.x = Math.round(world_1.Chunk.tilesperside / 2) + Math.round((this.position.world.x / tiles_1.Tile.tilesize)) - (this.position.chunk.x * world_1.Chunk.tilesperside);
                break;
            case general_1.Position.Y:
                this.position.chunk.y = Math.round(this.position.world.y / world_1.Chunk.chunksize);
                this.position.tile.y = Math.round(world_1.Chunk.tilesperside / 2) + Math.round((this.position.world.y / tiles_1.Tile.tilesize)) - (this.position.chunk.y * world_1.Chunk.tilesperside);
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
    return Player;
}(Character));
Player.size = 20;
Player.speed = 3;
exports.Player = Player;

},{"./canvas":2,"./general":6,"./tiles":8,"./world":9}],4:[function(require,module,exports){
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

},{"./canvas":2}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var general_1 = require("./general");
var general_2 = require("./general");
var world_2 = require("./world");
var tiles_1 = require("./tiles");
var character_1 = require("./character");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var Game = (function () {
    function Game() {
    }
    Game.updateResolution = function () {
        canvas_1.Canvas.updateResolution();
        world_2.Chunk.calculatePerScreenRatio();
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
    };
    Game.start = function () {
        Game.world = new world_1.World();
        Game.player = new character_1.Player(1, "asd");
    };
    Game.checkPlayerPosition = function () {
        var pos = Game.player.position;
        var loadsens = world_2.Chunk.loadsensitivity;
        if (pos.tile.x <= loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.LEFT);
        }
        if (pos.tile.x >= (world_2.Chunk.tilesperside - loadsens + 1)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.RIGHT);
        }
        if (pos.tile.y <= loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.DOWN);
            if (pos.tile.x <= loadsens) {
                Game.world.generateChunk(pos.chunk.x, pos.chunk.y - 1, general_1.Direction.LEFT);
            }
            if (pos.tile.x >= (world_2.Chunk.tilesperside - loadsens)) {
                Game.world.generateChunk(pos.chunk.x, pos.chunk.y - 1, general_1.Direction.RIGHT);
            }
        }
        if (pos.tile.y >= (world_2.Chunk.tilesperside - loadsens + 1)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.UP);
            if (pos.tile.x <= loadsens) {
                Game.world.generateChunk(pos.chunk.x, pos.chunk.y + 1, general_1.Direction.LEFT);
            }
            if (pos.tile.x >= (world_2.Chunk.tilesperside - loadsens + 1)) {
                Game.world.generateChunk(pos.chunk.x, pos.chunk.y + 1, general_1.Direction.RIGHT);
            }
        }
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y);
    };
    Game.getDebugLines = function () {
        var debugLines = [
            "Loaded chunks: " + Game.world.onscreen.join(", "),
            "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
            "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
            "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
            "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
            "Tiles per chunk (side): " + world_2.Chunk.tilesperside,
            "Chunk size: " + world_2.Chunk.chunksize,
            "Tile size: " + tiles_1.Tile.tilesize
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
        var oldPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
        Game.player.walk(Game.key);
        var newPosition = { x: Game.player.position.chunk.x, y: Game.player.position.chunk.y };
        Game.comparePositions(oldPosition, newPosition);
        Game.checkPlayerPosition();
        Game.updateScreen();
    };
    return Game;
}());
Game.key = {};
exports.Game = Game;

},{"./canvas":2,"./character":3,"./debug":4,"./general":6,"./tiles":8,"./world":9}],6:[function(require,module,exports){
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
var Color = (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return Color;
}());
exports.Color = Color;

},{}],7:[function(require,module,exports){
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
    game_1.Game.start();
    window.requestAnimationFrame(game_1.Game.loop);
    window.addEventListener("keydown", debug_1.Debug.toggle, false);
    window.addEventListener("keydown", game_1.Game.keypress, false);
    window.addEventListener("keyup", game_1.Game.keypress, false);
};
window.onresize = function () {
    game_1.Game.updateResolution();
};

},{"./canvas":2,"./debug":4,"./game":5,"./general":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var tiles_1 = require("./tiles");
var debug_1 = require("./debug");
var biomes_1 = require("./biomes");
var Chunk = (function () {
    function Chunk(x, y) {
        this.tiles = [];
        this.x = x;
        this.y = y;
        this.generateTiles();
    }
    Chunk.isOnScreen = function (chunk, playerx, playery) {
        var xplus = Math.ceil(playerx + (Chunk.perscreen / 2));
        var xminus = Math.floor(playerx - (Chunk.perscreen / 2));
        var yplus = Math.ceil(playery + (Chunk.perscreen / 2));
        var yminus = Math.floor(playery - (Chunk.perscreen / 2));
        if (chunk.x > xplus || chunk.x < xminus || chunk.y > yplus || chunk.y < yminus) {
            return false;
        }
        else {
            return true;
        }
    };
    Chunk.calculatePerScreenRatio = function () {
        Chunk.perscreen.x = Math.ceil(canvas_1.Canvas.width / Chunk.chunksize);
        Chunk.perscreen.y = Math.ceil(canvas_1.Canvas.height / Chunk.chunksize);
    };
    Chunk.prototype.generateTiles = function () {
        var r = 1;
        while (r <= Chunk.tilesperside) {
            var c = 1;
            while (c <= Chunk.tilesperside) {
                var noise_1 = this.generateTileNoise(r, c);
                var biome = this.getTileBiome(noise_1);
                var tile = biome.getTile(r, c, noise_1);
                this.tiles.push(tile);
                c++;
            }
            r++;
        }
    };
    Chunk.prototype.generateTileNoise = function (tilex, tiley) {
        var x = tilex + (this.x * Chunk.tilesperside);
        var y = tiley + (this.y * Chunk.tilesperside);
        var biome = noise.perlin2(x / biomes_1.Biome.intensity, y / biomes_1.Biome.intensity) * 100;
        return Math.abs(Math.round(biome));
    };
    Chunk.prototype.getTileBiome = function (noise) {
        for (var _i = 0, _a = biomes_1.Biome.biomes; _i < _a.length; _i++) {
            var biome = _a[_i];
            if (noise <= biome.max && noise >= biome.min) {
                return biome;
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
    function World() {
        this.chunks = {};
        this.onscreen = [];
        Chunk.calculatePerScreenRatio();
        this.generateSeed();
        this.generateChunk(0, 0);
    }
    World.prototype.loadChunk = function (x, y) {
        if (this.chunkExists(x, y)) {
            if (this.onscreen.indexOf(World.coordinatesToString(x, y)) == -1) {
                this.onscreen.push(World.coordinatesToString(x, y));
            }
        }
    };
    World.prototype.unloadChunk = function (x, y) {
        var arrayindex = this.onscreen.indexOf(World.coordinatesToString(x, y));
        if (arrayindex > -1) {
            this.onscreen.splice(arrayindex, 1);
        }
    };
    //load a bunch of chunks
    World.prototype.loadChunksOnWalk = function (pos, dir, playerposx, playerposy) {
        var indextop, indexbottom, x, y, unloadx, unloady;
        var halfy = Math.ceil(Chunk.perscreen.y / 2) + 1;
        var halfx = Math.ceil(Chunk.perscreen.x / 2) + 1;
        //might seem a bit backwards mut if we move on the x axis
        //we want to loop through on the y axis
        if (pos == general_2.Position.X) {
            indextop = playerposy + halfy;
            indexbottom = playerposy - halfy;
        }
        else if (pos == general_2.Position.Y) {
            indextop = playerposx + halfx;
            indexbottom = playerposx - halfy;
        }
        while (indextop >= indexbottom) {
            if (pos == general_2.Position.X) {
                y = indextop;
                unloady = indextop;
                if (dir == general_1.Direction.RIGHT) {
                    x = playerposx + halfx;
                    unloadx = playerposx - halfx - 1;
                }
                if (dir == general_1.Direction.LEFT) {
                    x = playerposx - halfx;
                    unloadx = playerposx + halfx + 1;
                }
            }
            if (pos == general_2.Position.Y) {
                x = indextop;
                unloadx = indextop;
                if (dir == general_1.Direction.UP) {
                    y = playerposy + halfy;
                    unloady = playerposy - halfy - 1;
                }
                if (dir == general_1.Direction.DOWN) {
                    y = playerposy - halfy;
                    unloady = playerposy + halfy + 1;
                }
            }
            this.unloadChunk(unloadx, unloady);
            this.loadChunk(x, y);
            indextop--;
        }
    };
    World.prototype.generateChunk = function (x, y, direction) {
        var coords = this.calculateDirection(x, y, direction);
        if (!this.chunkExists(coords.x, coords.y)) {
            var chunk = new Chunk(coords.x, coords.y);
            this.drawChunk(chunk);
            this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
            this.loadChunk(coords.x, coords.y);
        }
    };
    World.prototype.chunkExists = function (x, y) {
        return this.chunks[World.coordinatesToString(x, y)] != null;
    };
    World.coordinatesToString = function (x, y) {
        var coords = x.toString() + y.toString();
        coords = coords.replace(/-/g, "m");
        return coords;
    };
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
    World.prototype.drawChunk = function (chunk) {
        var chunkpositionx = canvas_1.Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
        var chunkpositiony = canvas_1.Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
        for (var _i = 0, _a = chunk.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tilepositionx = chunkpositionx + (tiles_1.Tile.tilesize * (tile.x - 1)) - (tiles_1.Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (tiles_1.Tile.tilesize * -(tile.y)) - (tiles_1.Tile.tilesize / 2) + Chunk.chunksize;
            canvas_1.Canvas.context.beginPath();
            if (debug_1.Debug.lines) {
                canvas_1.Canvas.context.rect(tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
                canvas_1.Canvas.context.strokeStyle = "rgba(255, 255, 255, 0.5)";
                canvas_1.Canvas.context.stroke();
            }
            else {
                canvas_1.Canvas.context.drawImage(tile.texture, tilepositionx, tilepositiony, tiles_1.Tile.tilesize, tiles_1.Tile.tilesize);
            }
            if (debug_1.Debug.worldtext) {
                canvas_1.Canvas.context.font = "10px sans-serif";
                canvas_1.Canvas.context.fillStyle = "rgba(255, 255, 255, 0.5)";
                canvas_1.Canvas.context.fillText("n:" + tile.noise, tilepositionx + 5, tilepositiony + 12);
                canvas_1.Canvas.context.fillText("" + tile.x + ", " + tile.y, tilepositionx + 5, tilepositiony + 22);
                canvas_1.Canvas.context.fillText("" + (tile.x + (chunk.x * Chunk.tilesperside)) + ", " + (tile.y + (chunk.y * Chunk.tilesperside)), tilepositionx + 5, tilepositiony + 32);
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
    World.prototype.generateSeed = function () {
        this.seed = Math.random();
        noise.seed(this.seed);
    };
    return World;
}());
exports.World = World;

},{"./biomes":1,"./canvas":2,"./debug":4,"./general":6,"./tiles":8}]},{},[7]);
