import { Canvas } from "./canvas";
import { Direction } from "./general";
import { Position } from "./general";
import { Tile } from "./tiles";
import { Grass } from "./tiles";
import { Debug } from "./debug";
import { Biome } from "./biomes";
import { Sea } from "./biomes";
import { Settings } from "./settings";
import { rng } from "./general";
declare var noise;





export class Chunk {

  tiles: Array<Tile> = [];
  static tilesperside:number = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
  static chunksize:number = Chunk.tilesperside * Tile.tilesize;
  static loadsensitivity:number = 2;
  static perscreen:any = {x: 0, y: 0};
  x: number;
  y: number;

  constructor(x:number, y: number, seed) {
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

  generateTiles(seed): void {
    let r:number = 1;
    while (r <= Chunk.tilesperside) {
      let c = 1;
      while (c <= Chunk.tilesperside) {
        let tile;
        let x = r + (this.x * Chunk.tilesperside);
        let y = c + (this.y * Chunk.tilesperside);
        let islandnoise = Tile.generateNoise((x / Biome.islandsize), (y / Biome.islandsize), seed.island, true) * Biome.islandmax;
        if (islandnoise >= Sea.noise.min && islandnoise <= Sea.noise.max) {
          tile = Sea.getTile(r, c, islandnoise);
        } else {
        console.log("x: " + x + ", y: " + y)
          let temp: number = Tile.generateNoise((x / Biome.tempsize), (y / Biome.tempsize), seed.biome.temp) * Biome.tempmax;
          let hum: number = Tile.generateNoise((x / Biome.humsize), (y / Biome.humsize), seed.biome.hum) * Biome.hummax;
          console.log(seed);
          console.log("temp: " + temp + ", hum: " + hum);
          let biome = this.getBiome(temp, hum);
          tile = biome.getTile(r, c);
        }
        this.tiles.push(tile);
        c++;
      }
      r++;
    }
  }

  getBiome(temp: number, hum: number) {
    for (let biome in Biome.get) {
      let b = Biome.get[biome];
      if ((temp >= b.temperature.min && temp <= b.temperature.max) && (hum >= b.humidity.min && hum <= b.humidity.max)) {
        return b;
      }
    }
  }
}










export class World {

  seed = {
    island: 0,
    biome: {
      temp: 0,
      hum: 0
    }
  };
  chunks: any = {};
  onscreen: Array<string> = [];

  constructor() {
    Chunk.calculatePerScreenRatio();
    this.generateSeed();
    this.generateChunk(0, 0);
  }

  loadChunk(x: number, y:number) {
    if (this.chunkExists(x, y)) {
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
    let halfy:number = Math.ceil(Chunk.perscreen.y / 2) + 1;
    let halfx:number = Math.ceil(Chunk.perscreen.x / 2) + 1;
    //might seem a bit backwards mut if we move on the x axis
    //we want to loop through on the y axis
    if (pos == Position.X) {
      indextop = playerposy + halfy;
      indexbottom = playerposy - halfy;
    } else if (pos == Position.Y) {
      indextop = playerposx + halfx;
      indexbottom = playerposx - halfy;
    }
    while (indextop >= indexbottom) {
      if (pos == Position.X) {
        y = indextop;
        unloady = indextop;
        if (dir == Direction.RIGHT) {
          x = playerposx + halfx;
          unloadx = playerposx - halfx - 1;
        }
        if (dir == Direction.LEFT) {
          x = playerposx - halfx;
          unloadx = playerposx + halfx + 1;
        }
      }
      if (pos == Position.Y) {
        x = indextop;
        unloadx = indextop;
        if (dir == Direction.UP) {
          y = playerposy + halfy;
          unloady = playerposy - halfy - 1;
        }
        if (dir == Direction.DOWN) {
          y = playerposy - halfy;
          unloady = playerposy + halfy + 1;
        }
      }
      this.unloadChunk(unloadx, unloady);
      this.loadChunk(x, y);
      indextop--;
    }
  }

  generateChunk(x:number, y:number, direction?:number): void {
    let coords = this.calculateDirection(x, y, direction);
    if (!this.chunkExists(coords.x, coords.y)) {
      let chunk = new Chunk(coords.x, coords.y, this.seed);
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
    for (let tile of chunk.tiles) {
      let tilepositionx:number = chunkpositionx + (Tile.tilesize * (tile.x - 1)) - (Tile.tilesize / 2);
      let tilepositiony:number = chunkpositiony + (Tile.tilesize * -(tile.y)) - (Tile.tilesize / 2) + Chunk.chunksize;
      Canvas.context.beginPath();
      if (Debug.lines) {
        Canvas.context.rect(tilepositionx, tilepositiony, Tile.tilesize, Tile.tilesize);
        Canvas.context.strokeStyle = "rgba(255, 255, 255, 0.5)";
        Canvas.context.stroke();
      } else {
        if (Settings.usetilecolor) {
          Canvas.context.fillStyle = tile.color.getRGBA();
          Canvas.context.fillRect(tilepositionx, tilepositiony, Tile.tilesize, Tile.tilesize);
        } else {
          Canvas.context.drawImage(tile.texture, tilepositionx, tilepositiony, Tile.tilesize, Tile.tilesize);
        }
      }
      if (Debug.worldtext) {
        Canvas.context.font = "10px sans-serif";
        Canvas.context.fillStyle = "rgba(255, 255, 255, 0.5)";
        Canvas.context.fillText("" + tile.x + ", " + tile.y, tilepositionx + 5, tilepositiony + 22);
        Canvas.context.fillText("" + (tile.x + (chunk.x * Chunk.tilesperside)) + ", " + (tile.y + (chunk.y * Chunk.tilesperside)), tilepositionx + 5, tilepositiony + 32);
      }
    }
    if (Debug.worldtext) {
      Canvas.context.beginPath();
      Canvas.context.font = "15px sans-serif";
      Canvas.context.fillStyle = "red";
      Canvas.context.fillText("" + chunk.x + ", " + chunk.y, chunkpositionx - (Tile.tilesize / 2) + 5, chunkpositiony - (Tile.tilesize / 2) + 20);
    }
    if (Debug.lines) {
      Canvas.context.beginPath();
      Canvas.context.rect(chunkpositionx - (Tile.tilesize / 2), chunkpositiony - (Tile.tilesize / 2), Chunk.chunksize, Chunk.chunksize);
      Canvas.context.strokeStyle = "red";
      Canvas.context.stroke();
    }
  }

  generateSeed(): void {
    this.seed.island = rng(1, 65536);
    this.seed.biome.temp = rng(1, 65536);
    this.seed.biome.hum = rng(1, 65536);
  }
}
