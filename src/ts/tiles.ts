
import { Color } from "./general";

declare var noise;

export class Tile {

  static tilesize: number = 40;
  static id: number;
  texture:HTMLImageElement = new Image();
  color: Color;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  //randomly pick a texture for the tile (or if only 1 then that one)
  setTexture(src: Array<string>) {
    let rng:number = Math.floor(Math.random() * src.length);
    this.texture.src = src[rng];
  }

  static generateNoise(x: number, y: number, seed?: number) {
    if (seed != null) {
      noise.seed(seed);
    }
    return Math.abs(noise.perlin2(x, y));
  }

}

export class Grass extends Tile {
  static id:number = 1;
  color: Color = new Color(77, 189, 51, 1);
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
  textures: Array<string> = [
    "src/img/snow.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(this.textures);
  }
}
