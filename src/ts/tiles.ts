export class Tile {

  static tilesize: number = 50;
  static id: number;
  texture:HTMLImageElement = new Image();
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  //randomly pick a texture for the tile (or if only 1 then that one)
  setTexture(src: Array<string>) {
    let rng:number = Math.floor(Math.random() * (src.length - 1));
    this.texture.src = src[rng];
  }
}

export class Grass extends Tile {
  static id:number = 1;
  static textures: Array<string> = [
    "src/img/grass.png",
    "src/img/grass_1.png",
    "src/img/grass_2.png"
  ];
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture(Grass.textures);
  }
}
