
import { Color } from "./general";
import { Settings } from "./settings";
import { Canvas } from "./canvas";
import { Debug } from "./debug";
import { coordinatesToString } from "./general";
import { Mouse } from "./mouse";
import { Environment } from "./environment";
import { Texture } from "./general";

declare var noise;

export class Tile {

  static size: number = 40;
  static hover = "";
  name: string;
  texture: Texture;
  environment: Environment;
  color: Color;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static getMouseCoordinates(chunksize, chunk) {
    let x: number = Math.floor(((Mouse.position.world.x + (chunksize / 2) + Tile.size) - (chunk.x * chunksize)) / Tile.size);
    let y: number = Math.floor(((Mouse.position.world.y + (chunksize / 2) + Tile.size) - (chunk.y * chunksize)) / Tile.size);
    return {"x": x, "y": y};
  }

  /*
  * Updates the current hovered tile
  */
  static updateHover(chunksize, chunk) {
    let tile = Tile.getMouseCoordinates(chunksize, chunk);
    let tilestring = coordinatesToString(tile.x, tile.y);
    Tile.hover = tilestring;
  }

  static generateNoise(x: number, y: number, seed?: number, abs:boolean = false) {
    if (seed != null) {
      noise.seed(seed);
    }
    if (abs) {
      return Math.abs(noise.simplex2(x, y));
    } else {
      return noise.simplex2(x, y);
    }
  }

  draw(x: number, y: number, chunk: boolean, tile: string) {
    Canvas.context.beginPath();
    if (Debug.lines) {
      Canvas.context.rect(x, y, Tile.size, Tile.size);
      Canvas.context.strokeStyle = this.color.toRGBA();
      Canvas.context.stroke();
    } else {
      if (Settings.usetilecolor) {
        Canvas.context.fillStyle = this.color.toRGBA();
        Canvas.context.fillRect(x, y, Tile.size, Tile.size);
      } else {
        Canvas.context.drawImage(this.texture.element, x, y, Tile.size, Tile.size);
      }
    }
    if (Debug.worldtext) {
      Canvas.context.font = "10px sans-serif";
      Canvas.context.fillStyle = "rgba(255, 255, 255, 0.5)";
      Canvas.context.fillText("" + this.x + ", " + this.y, x + 5, y + 22);
    }
    if (chunk && Tile.hover == tile) {
      this.drawStroke(x, y);
    }
  }

  drawStroke(x: number, y: number) {
    Canvas.context.beginPath();
    Canvas.context.lineWidth = Settings.tilehoverlinewidth;
    Canvas.context.strokeStyle = Settings.tilehovercolor.toRGBA();
    Canvas.context.strokeRect(x, y, Tile.size, Tile.size);
  }

}

export class Grass extends Tile {
  color: Color = new Color(77, 189, 51, 1);
  name: string = "Grass";
  texture: Texture = new Texture([
    "src/img/grass_3.png",
    "src/img/grass_4.png"
  ]);
}

export class DeepWater extends Tile {
  color: Color = new Color(38, 98, 133, 1);
  name: string = "Deep Water";
  texture: Texture = new Texture([
    "src/img/water.png",
    "src/img/water_1.png"
  ]);
}

export class Water extends Tile {
  color: Color = new Color(64, 164, 223, 1);
  name: string = "Water";
  texture: Texture = new Texture([
    "src/img/water.png",
    "src/img/water_1.png"
  ]);
}

export class Sand extends Tile {
  color: Color = new Color(237, 201, 175, 1);
  name: string = "Sand";
  texture: Texture = new Texture([
    "src/img/sand.png",
    "src/img/sand_1.png",
    "src/img/sand_2.png"
  ]);
}

export class Ice extends Tile {
  color: Color = new Color(212,240,255, 1);
  name: string = "Ice";
  texture: Texture = new Texture([
    "src/img/ice.png"
  ]);
}

export class Snow extends Tile {
  color: Color = new Color(248, 248, 255, 1);
  name: string = "Snow";
  texture: Texture = new Texture([
    "src/img/snow.png"
  ]);
}
