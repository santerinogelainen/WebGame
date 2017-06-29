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

  setTexture(src: string) {
    this.texture.src = src;
  }
}

export class Grass extends Tile {
  static id:number = 1;
  constructor(x:number, y:number) {
    super(x, y);
    this.setTexture("src/img/grass.png");
  }
}
