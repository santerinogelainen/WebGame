
import { Canvas } from "./canvas";
import { Chunk } from "./chunk";
import { Tile } from "./tile";
import { Direction } from "./general";
import { Color } from "./general";
import { Game } from "./game";
import { Debug } from "./debug";
import { Mouse } from "./mouse";

window.onload = () => {
  //init everything
  Canvas.init();
  Canvas.setBackground(new Color(0, 0, 0, 1));
  Game.init();
  Canvas.element.onmousemove = Mouse.updatePagePosition;
  Game.run();

  window.addEventListener("keydown", Debug.toggle, false);
  window.addEventListener("keydown", Game.keypress, false);
  window.addEventListener("keyup", Game.keypress, false);
};

window.onresize = () => {
  Game.updateResolution();
}
