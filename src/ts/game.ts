import { World } from "./world";
import { Direction } from "./general";
import { Position } from "./general";
import { Chunk } from "./world";
import { Tile } from "./tiles";
import { Player } from "./character";
import { Canvas } from "./canvas";
import { Debug } from "./debug";

export class Game {

  static world: World;
  static player: Player;
  static key = {};

  static updateResolution() {
    Canvas.updateResolution();
    Chunk.calculatePerScreenRatio();
    Game.updateScreen(true);
  }

  static updateScreen(updateResolution:boolean = false) {
    //update background
    Canvas.updateBackground();
    //update each chunk
    for (let chunk of Game.world.onscreen) {
      Game.world.drawChunk(Game.world.chunks[chunk]);
    }
    //update character
    if (updateResolution) {
      Game.player.draw(Canvas.center.x, Canvas.center.y);
    } else {
      Game.player.draw(Game.player.position.screen.x, Game.player.position.screen.y);
    }
    //debug
    if (Debug.on) {
      Debug.draw(Game.getDebugLines());
    }
  }

  static start() {
    Game.world = new World();
    Game.player = new Player(1, "asd");
  }

  static checkPlayerPosition() {
    let pos = Game.player.position;
    let loadsens = Chunk.loadsensitivity;
    if (pos.tile.x <= loadsens) { //left
      Game.world.generateChunk(pos.chunk.x, pos.chunk.y, Direction.LEFT);
    }
    if (pos.tile.x >= (Chunk.tilesperside - 1 - loadsens)) { //right
      Game.world.generateChunk(pos.chunk.x, pos.chunk.y, Direction.RIGHT);
    }
    if (pos.tile.y <= loadsens) { //bottom
      Game.world.generateChunk(pos.chunk.x, pos.chunk.y, Direction.DOWN);
      if (pos.tile.x <= loadsens) { //left
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y - 1, Direction.LEFT);
      }
      if (pos.tile.x >= (Chunk.tilesperside - 1 - loadsens)) { //right
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y - 1, Direction.RIGHT);
      }
    }
    if (pos.tile.y >= (Chunk.tilesperside - 1 - loadsens)) { //top
      Game.world.generateChunk(pos.chunk.x, pos.chunk.y, Direction.UP);
      if (pos.tile.x <= loadsens) { //left
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y + 1, Direction.LEFT);
      }
      if (pos.tile.x >= (Chunk.tilesperside - 1 - loadsens)) { //right
        Game.world.generateChunk(pos.chunk.x, pos.chunk.y + 1, Direction.RIGHT);
      }
    }
    Game.world.generateChunk(pos.chunk.x, pos.chunk.y);
  }

  static getDebugLines(): Array<string> {
    let debugLines:Array<string> = [
      "Loaded chunks: " + Game.world.onscreen.join(", "),
      "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
      "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
      "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
      "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
      "Tiles per chunk (side): " + Chunk.tilesperside,
      "Chunk size: " + Chunk.chunksize,
      "Tile size: " + Tile.tilesize
    ];
    return debugLines;
  }

  static keypress(e) {
    e = e || event;
    Game.key[e.keyCode] = e.type == 'keydown';
    if (Game.key[87] || Game.key[65] || Game.key[83] || Game.key[68]) {
      Game.player.moving = true;
    } else {
      Game.player.moving = false;
    }
  }

  static comparePositions(oldPosition, newPosition): void {
    if (oldPosition.x != newPosition.x) {
      if (oldPosition.x > newPosition.x) {
        Game.world.loadChunksOnWalk(Position.X, Direction.LEFT, newPosition.x, newPosition.y);
      }
      if (oldPosition.x < newPosition.x) {
        Game.world.loadChunksOnWalk(Position.X, Direction.RIGHT, newPosition.x, newPosition.y);
      }
    }
    if (oldPosition.y != newPosition.y) {
      if (oldPosition.y > newPosition.y) {
        Game.world.loadChunksOnWalk(Position.Y, Direction.DOWN, newPosition.x, newPosition.y);
      }
      if (oldPosition.y < newPosition.y) {
        Game.world.loadChunksOnWalk(Position.Y, Direction.UP, newPosition.x, newPosition.y);
      }
    }
  }

  static loop() {
    requestAnimationFrame(Game.loop);
    let oldPosition = {x: Game.player.position.chunk.x, y: Game.player.position.chunk.y};
    Game.player.walk(Game.key);
    let newPosition = {x: Game.player.position.chunk.x, y: Game.player.position.chunk.y};
    Game.comparePositions(oldPosition, newPosition);
    Game.checkPlayerPosition();
    Game.updateScreen();
  }

}
