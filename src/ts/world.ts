import { Canvas } from "./canvas";
import { Direction } from "./general";
import { Position } from "./general";

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
  static perscreen:any = {x: 0, y: 0};
  x: number;
  y: number;

  constructor(seed:number, x:number, y: number) {
    this.x = x;
    this.y = y;
    this.generateTiles(seed);
  }

  static isOnScreen(chunk: Chunk, playerx: number, playery: number): boolean {
    let xplus: number = Math.ceil(playerx + (Chunk.perscreen / 2));
    let xminus: number = Math.floor(playerx - (Chunk.perscreen / 2));
    let yplus: number = Math.ceil(playery + (Chunk.perscreen / 2));
    let yminus:number = Math.floor(playery - (Chunk.perscreen / 2));
    if (chunk.x > xplus || chunk.x < xminus || chunk.y > yplus || chunk.y < yminus) {
      return false;
    } else {
      return true;
    }
  }

  static calculatePerScreenRatio(): void {
    Chunk.perscreen.x = Math.ceil(Canvas.width / Chunk.chunksize);
    Chunk.perscreen.y = Math.ceil(Canvas.height / Chunk.chunksize);
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
  onscreen: Array<string> = [];

  constructor() {
    Chunk.calculatePerScreenRatio();
    this.seed = this.generateSeed(-2147483647, 2147483647);
    this.generateChunk(0, 0, null);
  }

  loadChunk(x: number, y:number) {
    if (this.chunkExists(x, y)) {
      console.log(this.onscreen.indexOf(World.coordinatesToString(x, y)));
      if (this.onscreen.indexOf(World.coordinatesToString(x, y)) == -1) {
        this.onscreen.push(World.coordinatesToString(x, y));
      }
    }
  }

  unloadChunk(x: number, y:number) {
    let arrayindex: number = this.onscreen.indexOf(World.coordinatesToString(x, y));
    if (arrayindex > -1) {
      this.onscreen.splice(arrayindex, 1);
    }
  }

  //load a bunch of chunks
  loadChunksOnWalk(pos: Position, dir: Direction, playerposx: number, playerposy: number) {
    let indextop, indexbottom, x, y, unloadx, unloady;
    //might seem a bit backwards mut if we move on the x axis
    //we want to loop through on the y axis
    if (pos == Position.X) {
      indextop = playerposy + Math.ceil(Chunk.perscreen.y / 2);
      indexbottom = playerposy - Math.ceil(Chunk.perscreen.y / 2);
    } else if (pos == Position.Y) {
      indextop = playerposx + Math.ceil(Chunk.perscreen.x / 2);
      indexbottom = playerposx - Math.ceil(Chunk.perscreen.x / 2);
    }
    while (indextop >= indexbottom) {
      if (pos == Position.X) {
        if (dir == Direction.RIGHT) {
          x = playerposx + Math.ceil(Chunk.perscreen.x / 2) + 1;
          y = indextop;
          unloadx = playerposx - Math.ceil(Chunk.perscreen.x / 2) - 2;
          unloady = indextop;
        }
        if (dir == Direction.LEFT) {
          x = playerposx - Math.ceil(Chunk.perscreen.x / 2) - 1;
          y = indextop;
          unloadx = playerposx + Math.ceil(Chunk.perscreen.x / 2) + 2;
          unloady = indextop;
        }
      }
      if (pos == Position.Y) {
        if (dir == Direction.UP) {
          x = indextop;
          y = playerposy + Math.ceil(Chunk.perscreen.y / 2) + 1;
          unloadx = indextop;
          unloady = playerposy - Math.ceil(Chunk.perscreen.y / 2) - 2;
        }
        if (dir == Direction.DOWN) {
          x = indextop;
          y = playerposy - Math.ceil(Chunk.perscreen.y / 2) - 1;
          unloadx = indextop;
          unloady = playerposy + Math.ceil(Chunk.perscreen.y / 2) + 2;
        }
      }
      console.log("x: " + x);
      console.log("y: " + y);
      console.log("unloadx" + unloadx);
      console.log("unloady" + unloady);
      console.log("------");
      this.unloadChunk(unloadx, unloady);
      this.loadChunk(x, y);
      indextop--;
    }
    console.log(this.onscreen);
    console.log("--------------------------------------------------------------");
  }

  generateChunk(x:number, y:number, direction?:number): void {
    let coords = this.calculateDirection(x, y, direction);
    if (!this.chunkExists(coords.x, coords.y)) {
      let chunk = new Chunk(this.seed, coords.x, coords.y);
      this.drawChunk(chunk);
      this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
      this.loadChunk(coords.x, coords.y);
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
