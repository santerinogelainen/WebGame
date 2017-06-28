
import { Canvas } from "./canvas";
import { Chunk } from "./world";
import { Tile } from "./world";
import { Direction } from "./general";
import { Color } from "./general";
import { Game } from "./game";
import { Debug } from "./debug";

window.onload = () => {
  //init everything
  Canvas.init();
  Canvas.setBackground(new Color(0, 0, 0, 1));
  Game.start();

  window.requestAnimationFrame(Game.loop);

  //generate additional chunks
  /*Game.world.generateChunk(0, 0, Direction.UP);
  Game.world.generateChunk(0, 1, Direction.LEFT);
  Game.world.generateChunk(-1, 1, Direction.DOWN);
  Game.world.generateChunk(0, 1, Direction.RIGHT);*/
  //Game.world.generateChunk(0, 0, Direction.RIGHT);

  window.addEventListener("keydown", Debug.toggle, false);
  window.addEventListener("keydown", Game.keypress, false);
  window.addEventListener("keyup", Game.keypress, false);
};

window.onresize = () => {
  Game.updateResolution();
}
