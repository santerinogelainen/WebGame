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
