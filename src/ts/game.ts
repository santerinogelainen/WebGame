import { World } from "./world";
import { Direction } from "./general";
import { Position } from "./general";
import { Chunk } from "./chunk";
import { Tile } from "./tile";
import { Player } from "./character";
import { Canvas } from "./canvas";
import { Debug } from "./debug";
import { Tiletip } from "./tiletip";
import { Settings } from "./settings";
import { Mouse } from "./mouse";

export class Game {

  static world: World;
  static player: Player;
  static key = {};

  //fps shit
  static fpsInterval;
  static timeInterval;
  static curTime: number;
  static elapsed;
  static startTime: number;
  static curFps: number;
  static frameCount: number = 0;
  static prevFrameCount: number = 0;

  static updateResolution() {
    Canvas.updateResolution();
    Chunk.calculatePerScreenRatio();
    Game.updateScreen(true);
  }

  static updateScreen(updateResolution:boolean = false) {
    //update background
    Canvas.updateBackground();
    //update each chunk
    Game.world.draw();
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
    //update menus etc
    if (Game.world.chunks[Chunk.hover] != null) {
      Tiletip.draw(Game.world.chunks[Chunk.hover].tiles[Tile.hover]);
    }
  }

  static init() {
    Game.world = new World();
    Game.player = new Player(1, "asd");
    Game.world.genChunksOnScreen(Game.player.position.chunk.x, Game.player.position.chunk.y);
  }

  static getDebugLines(): Array<string> {
    let debugLines:Array<string> = [
      "FPS: " + Game.curFps + " (limit: " + Settings.fpslimit + ")",
      /*"Loaded chunks: " + Game.world.onscreen.join(", "),*/
      "Fixed position: x=" + Game.player.position.screen.x + " y=" + Game.player.position.screen.y,
      "World position: x=" + Game.player.position.world.x + " y=" + Game.player.position.world.y,
      "Chunk position: x=" + Game.player.position.chunk.x + " y=" + Game.player.position.chunk.y,
      "Tile position: x=" + Game.player.position.tile.x + " y=" + Game.player.position.tile.y,
      "Tiles per chunk (side): " + Chunk.tilesperside,
      "Chunk size: " + Chunk.size,
      "Tile size: " + Tile.size
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

  static updateHover() {
    Mouse.updateWorldPosition();
    Chunk.updateHover();
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

    Game.curTime = Date.now();
    Game.elapsed = Game.curTime - Game.timeInterval;
    let sinceStart: number = Game.curTime - Game.startTime;

    if (Game.elapsed > Game.fpsInterval) {
      Game.updateHover();
      Game.timeInterval = Game.curTime - (Game.elapsed % Game.fpsInterval);
      let oldPosition = {x: Game.player.position.chunk.x, y: Game.player.position.chunk.y};
      Game.player.walk(Game.key);
      let newPosition = {x: Game.player.position.chunk.x, y: Game.player.position.chunk.y};
      Game.comparePositions(oldPosition, newPosition);
      Game.updateScreen();

      Game.frameCount++;
      Game.curFps = Math.round((Game.frameCount / sinceStart) * 1000);
    }
  }

  static run() {
    Game.fpsInterval = 1000 / Settings.fpslimit;
    Game.timeInterval = Date.now();
    Game.startTime = Game.timeInterval;
    Game.loop();
  }

}
