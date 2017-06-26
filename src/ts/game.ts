import { World } from "./world";
import { Chunk } from "./world";
import { Tile } from "./world";
import { Player } from "./character";
import { Canvas } from "./canvas";
import { Debug } from "./debug";

export class Game {

  static world: World;
  static player: Player;
  static key = {};

  static updateScreen(updateResolution:boolean = false) {
    //update background
    Canvas.updateBackground();
    //update each chunk
    for (let chunk of Game.world.chunks) {
      Game.world.drawChunk(chunk);
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

  static getDebugLines(): Array<string> {
    let debugLines:Array<string> = [
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

  static loop() {
    requestAnimationFrame(Game.loop);
    Game.player.walk(Game.key);
    Game.updateScreen();
  }

}
