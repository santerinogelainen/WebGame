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
  static loadsensitivity:number = 1;
  x: number;
  y: number;

  constructor(seed:number, x:number, y: number) {
    this.x = x;
    this.y = y;
    this.generateTiles(seed);
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
  chunks: any = {};

  constructor() {
    this.seed = this.generateSeed(-2147483647, 2147483647);
    this.generateChunk(0, 0, null);
  }

  generateChunk(x:number, y:number, direction?:number): void {
    let coords = this.calculateDirection(x, y, direction);
    if (!this.chunkExists(coords.x, coords.y)) {
      let chunk = new Chunk(this.seed, coords.x, coords.y);
      console.log(this.chunks);
      this.drawChunk(chunk);
      this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
    }
  }

  chunkExists(x:number, y:number): boolean {
    return this.chunks[World.coordinatesToString(x, y)] != null;
  }

  static coordinatesToString(x: number, y:number): string {
    let coords:string = x.toString() + y.toString();
    coords = coords.replace(/-/g, "m");
    return coords;
  }

  calculateDirection(x: number, y: number, dir?: number) {
    switch (dir) {
      case Direction.UP:
        y += 1;
        break;
      case Direction.RIGHT:
        x += 1;
        break;
      case Direction.DOWN:
        y -= 1;
        break;
      case Direction.LEFT:
        x -= 1;
        break;
      default:
        //do nothing
    }
    return {"x": x, "y": y};
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
