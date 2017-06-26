import { Canvas } from "./canvas";
import { Direction } from "./general";

export class Tile {

  static tilesize: number = 50;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Chunk {

  tiles: Array<Tile> = [];
  static tilesperside:number = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
  static chunksize:number = Chunk.tilesperside * Tile.tilesize;
  x: number;
  y: number;

  constructor(seed:number, x:number, y: number, direction?: number) {
    this.x = x;
    this.y = y;
    this.checkDirection(direction);
    this.generateTiles(seed);
  }

  checkDirection(dir?: number) {
    switch (dir) {
      case Direction.UP:
        this.y += 1;
        break;
      case Direction.RIGHT:
        this.x += 1;
        break;
      case Direction.DOWN:
        this.y -= 1;
        break;
      case Direction.LEFT:
        this.x -= 1;
        break;
      default:
        //do nothing
    }
  }

  generateTiles(seed:number): void {
    let r:number = 0, c:number = 0;
    while (r < Chunk.tilesperside) {
      while (c < Chunk.tilesperside) {
        let tile: Tile = new Tile(r, c);
        this.tiles.push(tile);
        c++;
      }
      c = 0;
      r++;
    }
  }
}

export class World {

  seed: number;
  chunks: Array<Chunk> = [];

  constructor() {
    this.seed = this.generateSeed(-2147483647, 2147483647);
    this.generateChunk(0, 0, null);
  }

  generateChunk(x:number, y:number, direction?:number): void {
    let chunk = new Chunk(this.seed, x, y, direction);
    console.log(chunk);
    this.drawChunk(chunk);
    this.chunks.push(chunk);
  }

  checkChunkExistance(x:number, y:number, direction?:number) {

  }

  drawChunk(chunk: Chunk) {
    let chunkpositionx:number = Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
    let chunkpositiony:number = Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
    let i = 0;
    for (let tile of chunk.tiles) {
      let tilepositionx:number = chunkpositionx + (Tile.tilesize * tile.x) - (Tile.tilesize / 2);
      let tilepositiony:number = chunkpositiony + (Tile.tilesize * tile.y) - (Tile.tilesize / 2);
      Canvas.context.beginPath();
      Canvas.context.rect(tilepositionx, tilepositiony, Tile.tilesize + 1, Tile.tilesize + 1);
      Canvas.context.fillStyle = "#27ae60";
      Canvas.context.fill();
      Canvas.context.strokeStyle = "#2ecc71";
      Canvas.context.stroke();
      i++;
    }
  }

  generateSeed(min: number, max: number): number {
    return Math.floor(Math.random() * (max-min+1)+min);
  }
}
