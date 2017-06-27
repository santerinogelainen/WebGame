(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var general_1 = require("./general");
var canvas_1 = require("./canvas");
var world_1 = require("./world");
var world_2 = require("./world");
var Character = (function () {
    function Character(id, name) {
        this.position = {
            world: { x: 0, y: 0 },
            chunk: { x: 0, y: 0 },
            tile: { x: 0, y: 0 },
            screen: { x: 0, y: 0 }
        };
        this.id = id;
        this.name = name;
        this.draw(canvas_1.Canvas.center.x, canvas_1.Canvas.center.y);
    }
    Character.prototype.draw = function (x, y) { };
    ;
    return Character;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.moving = false;
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
                this.position.tile.x = Math.round(world_1.Chunk.tilesperside / 2) + Math.round((this.position.world.x / world_2.Tile.tilesize)) - (this.position.chunk.x * world_1.Chunk.tilesperside) - 1;
                break;
            case general_1.Position.Y:
                this.position.chunk.y = Math.round(this.position.world.y / world_1.Chunk.chunksize);
                this.position.tile.y = Math.round(world_1.Chunk.tilesperside / 2) + Math.round((this.position.world.y / world_2.Tile.tilesize)) - (this.position.chunk.y * world_1.Chunk.tilesperside) - 1;
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
Player.size = 25;
Player.speed = 3;
exports.Player = Player;

},{"./canvas":1,"./general":5,"./world":7}],3:[function(require,module,exports){
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
    };
    return Debug;
}());
Debug.on = false;
Debug.lineHeight = 15;
exports.Debug = Debug;

},{"./canvas":1}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var general_1 = require("./general");
var world_2 = require("./world");
var world_3 = require("./world");
var character_1 = require("./character");
var canvas_1 = require("./canvas");
var debug_1 = require("./debug");
var Game = (function () {
    function Game() {
    }
    Game.updateScreen = function (updateResolution) {
        if (updateResolution === void 0) { updateResolution = false; }
        //update background
        canvas_1.Canvas.updateBackground();
        //update each chunk
        for (var chunk in Game.world.chunks) {
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
        if (pos.tile.x == 0 + loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.LEFT);
        }
        if (pos.tile.x == (world_2.Chunk.tilesperside - 1 - loadsens)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.RIGHT);
        }
        if (pos.tile.y == 0 + loadsens) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.DOWN);
        }
        if (pos.tile.y == (world_2.Chunk.tilesperside - 1 - loadsens)) {
            Game.world.generateChunk(pos.chunk.x, pos.chunk.y, general_1.Direction.UP);
        }
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y);
    };
    Game.getDebugLines = function () {
        var debugLines = [
            "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
            "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
            "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
            "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
            "Tiles per chunk (side): " + world_2.Chunk.tilesperside,
            "Chunk size: " + world_2.Chunk.chunksize,
            "Tile size: " + world_3.Tile.tilesize
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
    Game.loop = function () {
        requestAnimationFrame(Game.loop);
        Game.player.walk(Game.key);
        Game.checkPlayerPosition();
        Game.updateScreen();
    };
    return Game;
}());
Game.key = {};
exports.Game = Game;

},{"./canvas":1,"./character":2,"./debug":3,"./general":5,"./world":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var general_2 = require("./general");
var game_1 = require("./game");
var debug_1 = require("./debug");
window.onload = function () {
    //init everything
    canvas_1.Canvas.init();
    canvas_1.Canvas.setBackground(new general_2.Color(0, 0, 0, 1));
    game_1.Game.start();
    window.requestAnimationFrame(game_1.Game.loop);
    //generate additional chunks
    /*Game.world.generateChunk(0, 0, Direction.UP);
    Game.world.generateChunk(0, 1, Direction.LEFT);
    Game.world.generateChunk(-1, 1, Direction.DOWN);
    Game.world.generateChunk(0, 1, Direction.RIGHT);*/
    game_1.Game.world.generateChunk(0, 0, general_1.Direction.RIGHT);
    window.addEventListener("keydown", debug_1.Debug.toggle, false);
    window.addEventListener("keydown", game_1.Game.keypress, false);
    window.addEventListener("keyup", game_1.Game.keypress, false);
};
window.onresize = function () {
    canvas_1.Canvas.updateResolution();
    game_1.Game.updateScreen(true);
};

},{"./canvas":1,"./debug":3,"./game":4,"./general":5}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var general_1 = require("./general");
var Tile = (function () {
    function Tile(x, y) {
        this.x = x;
        this.y = y;
    }
    return Tile;
}());
Tile.tilesize = 50;
exports.Tile = Tile;
var Chunk = (function () {
    function Chunk(seed, x, y) {
        this.tiles = [];
        this.x = x;
        this.y = y;
        this.generateTiles(seed);
    }
    Chunk.prototype.generateTiles = function (seed) {
        var r = 0, c = 0;
        while (r < Chunk.tilesperside) {
            while (c < Chunk.tilesperside) {
                var tile = new Tile(r, c);
                this.tiles.push(tile);
                c++;
            }
            c = 0;
            r++;
        }
    };
    return Chunk;
}());
Chunk.tilesperside = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
Chunk.chunksize = Chunk.tilesperside * Tile.tilesize;
Chunk.loadsensitivity = 1;
exports.Chunk = Chunk;
var World = (function () {
    function World() {
        this.chunks = {};
        this.seed = this.generateSeed(-2147483647, 2147483647);
        this.generateChunk(0, 0, null);
    }
    World.prototype.generateChunk = function (x, y, direction) {
        var coords = this.calculateDirection(x, y, direction);
        if (!this.chunkExists(coords.x, coords.y)) {
            var chunk = new Chunk(this.seed, coords.x, coords.y);
            console.log(this.chunks);
            this.drawChunk(chunk);
            this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
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
        var i = 0;
        for (var _i = 0, _a = chunk.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tilepositionx = chunkpositionx + (Tile.tilesize * tile.x) - (Tile.tilesize / 2);
            var tilepositiony = chunkpositiony + (Tile.tilesize * tile.y) - (Tile.tilesize / 2);
            canvas_1.Canvas.context.beginPath();
            canvas_1.Canvas.context.rect(tilepositionx, tilepositiony, Tile.tilesize + 1, Tile.tilesize + 1);
            canvas_1.Canvas.context.fillStyle = "#27ae60";
            canvas_1.Canvas.context.fill();
            canvas_1.Canvas.context.strokeStyle = "#2ecc71";
            canvas_1.Canvas.context.stroke();
            i++;
        }
    };
    World.prototype.generateSeed = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return World;
}());
exports.World = World;

},{"./canvas":1,"./general":5}]},{},[6]);
