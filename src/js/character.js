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
        canvas_1.Canvas.context.arc(x, y, Player.size, 0, 2 * Math.PI);
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
        Player.mouse.world.x = -(canvas_1.Canvas.center.x - e.pageX);
        Player.mouse.world.y = (canvas_1.Canvas.center.y - e.pageY);
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
