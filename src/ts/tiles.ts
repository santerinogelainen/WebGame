
declare var noise;

export class Tile {

  static tilesize: number = 40;
  static id: number;
  texture:HTMLImageElement = new Image();
  noise: number;
  x: number;
  y: number;

  constructor(x: number, y: number, noise: number) {
    this.noise = noise;
    this.x = x;
    this.y = y;
  }

  //randomly pick a texture for the tile (or if only 1 then that one)
  setTexture(src: Array<string>) {
    let rng:number = Math.floor(Math.random() * src.length);
    this.texture.src = src[rng];
  }

}

export class Grass extends Tile {
  static id:number = 1;
  static textures: Array<string> = [
    "src/img/grass_3.png",
    "src/img/grass_4.png"
  ];
  constructor(x:number, y:number, noise: number) {
    super(x, y, noise);
    this.setTexture(Grass.textures);
  }
}

export class Water extends Tile {
  static id:number = 2;
  static textures: Array<string> = [
    "src/img/water.png"
  ];
  constructor(x:number, y:number, noise: number) {
    super(x, y, noise);
    this.setTexture(Water.textures);
  }
}
