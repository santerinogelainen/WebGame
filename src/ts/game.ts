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
  static mouse: any = {
    world: {x: 0, y: 0},
    chunk: {x: 0, y: 0},
    tile: {x: 0, y: 0}
  };
  static hover = {chunk: "", tile: ""};

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
      Game.world.drawChunk(Game.world.chunks[chunk], Game.hover);
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
    Game.world.genChunksOnScreen(Game.player.position.chunk.x, Game.player.position.chunk.y);
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
    Game.updateScreen();
  }

  /*
  * Updates the mouse position in relation to the canvas.
  */
  static updateMousePosition(e) {
    e = e || window.event;
    let oldPosition = {x: Game.mouse.tile.x, y: Game.mouse.tile.y};
    Game.mouse.world.x = -(Canvas.center.x - e.pageX) + (Tile.tilesize / 2);
    Game.mouse.world.y = (Canvas.center.y - e.pageY) - (Tile.tilesize / 2);
    Game.mouse.chunk.x = Math.round((Game.mouse.world.x) / Chunk.chunksize);
    Game.mouse.chunk.y = Math.round((Game.mouse.world.y) / Chunk.chunksize);
    Game.mouse.tile.x = Math.floor(((Game.mouse.world.x + (Chunk.chunksize / 2) + Tile.tilesize) - (Game.mouse.chunk.x * Chunk.chunksize)) / Tile.tilesize);
    Game.mouse.tile.y = Math.floor(((Game.mouse.world.y + (Chunk.chunksize / 2) + Tile.tilesize) - (Game.mouse.chunk.y * Chunk.chunksize)) / Tile.tilesize);
    let newPosition = {x: Game.mouse.tile.x, y: Game.mouse.tile.y};
    if (newPosition.x != oldPosition.x || newPosition.y != oldPosition.y) {
      Game.updateHoverTile();
    }
  }

  static updateHoverTile() {
    let chunk: string = World.coordinatesToString(Game.mouse.chunk.x, Game.mouse.chunk.y);
    let tile: string = World.coordinatesToString(Game.mouse.tile.x, Game.mouse.tile.y);
    Game.hover.chunk = chunk;
    Game.hover.tile = tile;
  }

}
