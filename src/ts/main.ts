
import { Canvas } from "./canvas";
import { Chunk } from "./chunk";
import { Tile } from "./tile";
import { Direction } from "./general";
import { Color } from "./general";
import { Game } from "./game";
import { Debug } from "./debug";

window.onload = () => {
  //init everything
  Canvas.init();
  Canvas.setBackground(new Color(0, 0, 0, 1));
  Game.start();
  Canvas.element.onmousemove = Game.player.updateMousePosition;

  window.requestAnimationFrame(Game.loop);

  window.addEventListener("keydown", Debug.toggle, false);
  window.addEventListener("keydown", Game.keypress, false);
  window.addEventListener("keyup", Game.keypress, false);
};

window.onresize = () => {
  Game.updateResolution();
}
