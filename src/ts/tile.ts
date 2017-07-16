
import { Color } from "./general";
import { Settings } from "./settings";
import { Canvas } from "./canvas";
import { Debug } from "./debug";
import { coordinatesToString } from "./general";

declare var noise;

export class Tile {

  static tilesize: number = 40;
  static hover = "";
  texture:HTMLImageElement = new Image();
  name: string;
  color: Color;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /*
  * Updates the current hovered tile
  */
  static updateHover(x: number, y: number) {
    let tile: string = coordinatesToString(x, y);
    Tile.hover = tile;
  }

  //randomly pick a texture for the tile (or if only 1 then that one)
  setTexture(src: Array<string>) {
    let rng:number = Math.floor(Math.random() * src.length);
    this.texture.src = src[rng];
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
      Canvas.context.rect(x, y, Tile.tilesize, Tile.tilesize);
      Canvas.context.strokeStyle = this.color.toRGBA();
      Canvas.context.stroke();
    } else {
      if (Settings.usetilecolor) {
        Canvas.context.fillStyle = this.color.toRGBA();
        Canvas.context.fillRect(x, y, Tile.tilesize, Tile.tilesize);
      } else {
        Canvas.context.drawImage(this.texture, x, y, Tile.tilesize, Tile.tilesize);
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
    Canvas.context.strokeRect(x, y, Tile.tilesize, Tile.tilesize);
  }

}

export class Grass extends Tile {
  static id:number = 1;
  color: Color = new Color(77, 189, 51, 1);
  name: string = "Grass";
  textures: Array<string> = [
    "src/img/grass_3.png",
    "src/img/grass_4.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}

export class DeepWater extends Tile {
  static id:number = 2;
  color: Color = new Color(38, 98, 133, 1);
  name: string = "Deep Water";
  textures: Array<string> = [
    "src/img/water.png",
    "src/img/water_1.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}

export class Water extends Tile {
  static id:number = 2;
  color: Color = new Color(64, 164, 223, 1);
  name: string = "Water";
  textures: Array<string> = [
    "src/img/water.png",
    "src/img/water_1.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}

export class Sand extends Tile {
  static id:number = 3;
  color: Color = new Color(237, 201, 175, 1);
  name: string = "Sand";
  textures: Array<string> = [
    "src/img/sand.png",
    "src/img/sand_1.png",
    "src/img/sand_2.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}

export class Ice extends Tile {
  static id:number = 4;
  color: Color = new Color(212,240,255, 1);
  name: string = "Ice";
  textures: Array<string> = [
    "src/img/ice.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}

export class Snow extends Tile {
  static id:number = 5;
  color: Color = new Color(248, 248, 255, 1);
  name: string = "Snow";
  textures: Array<string> = [
    "src/img/snow.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}
