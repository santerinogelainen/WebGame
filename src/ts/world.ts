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

  tiles = {};
  static tilesperside:number = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
  static chunksize:number = Chunk.tilesperside * Tile.tilesize;
  static loadsensitivity:number = 2;
  static perscreen:any = {x: 0, y: 0};
  x: number;
  y: number;

  constructor(x:number, y: number, seed) {
    this.x = x;
    this.y = y;
    this.generate(seed);
  }

  /*
  * Calculate how many chunks can fit the screen
  */
  static calculatePerScreenRatio(): void {
    Chunk.perscreen.x = Math.ceil(Canvas.width / Chunk.chunksize);
    Chunk.perscreen.y = Math.ceil(Canvas.height / Chunk.chunksize);
  }

  /*
  * Generates the necessary tiles for the chunk
  */
  generate(seed): void {
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
          let temp: number = Tile.generateNoise((x / Biome.tempsize), (y / Biome.tempsize), seed.biome.temp) * Biome.tempmax;
          let hum: number = Tile.generateNoise((x / Biome.humsize), (y / Biome.humsize), seed.biome.hum) * Biome.hummax;
          let biome = this.getBiome(temp, hum);
          tile = biome.getTile(r, c);
        }
        let name: string = World.coordinatesToString(r, c);
        this.tiles[name] = tile;
        c++;
      }
      r++;
    }
  }

  /*
  * Returns the biome that matches the temperature and humidity noise given
  */
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

  //all seeds for for the chunks / world generation
  seed = {
    island: 0,
    biome: {
      temp: 0,
      hum: 0
    }
  };
  //all the chunks that have been loaded
  chunks: any = {};
  /*
  * All the chunks that are on the screen.
  * This will update when the player moves.
  * Only these chunks will be drawn on the canvas, to prevent massive lag.
  */
  onscreen: Array<string> = [];



  /*
  * On creation, calculate chunk per screen ratio and generate all 3 world seeds
  * See: World.seed variable
  */
  constructor() {
    Chunk.calculatePerScreenRatio();
    this.generateSeed();
  }

  /*
  * Pushes the chunk to the onscreen array.
  * If chunk does not exist yet, it will automaticaly create one.
  * See World.onscreen variable
  */
  loadChunk(x: number, y:number) {
    if (this.chunkExists(x, y)) {
      if (this.onscreen.indexOf(World.coordinatesToString(x, y)) == -1) {
        this.onscreen.push(World.coordinatesToString(x, y));
      }
    } else {
      this.generateChunk(x, y);
    }
  }

  /*
  * Generate ALL the chunks that are currently on the screen.
  * This should only be used when the game is started.
  */
  genChunksOnScreen(playerposx: number, playerposy: number) {
    let x, y, stopx, stopy;
    let halfy:number = Math.ceil(Chunk.perscreen.y / 2) + 1;
    let halfx:number = Math.ceil(Chunk.perscreen.x / 2) + 1;
    x = playerposx - halfx;
    stopx = playerposx + halfx;
    y = playerposy - halfy;
    stopy = playerposy + halfy;
    while (x <= stopx) {
      while (y <= stopy) {
        this.loadChunk(x, y);
        y++;
      }
      y = playerposy - halfy;
      x++;
    }
  }

  /*
  * Removes the chunk from the onscreen array.
  * See World.onscreen variable
  */
  unloadChunk(x: number, y:number) {
    let arrayindex: number = this.onscreen.indexOf(World.coordinatesToString(x, y));
    if (arrayindex > -1) {
      this.onscreen.splice(arrayindex, 1);
    }
  }

  /*
  * Loads the "next" chunks when player moves.
  * Example:
  * If player moves up then it load all the chunks in the up direction
  */
  loadChunksOnWalk(pos: Position, dir: Direction, playerposx: number, playerposy: number) {
    let indextop, indexbottom, x, y, unloadx, unloady;
    let halfy:number = Math.ceil(Chunk.perscreen.y / 2) + 1;
    let halfx:number = Math.ceil(Chunk.perscreen.x / 2) + 1;
    //might seem a bit backwards mut if we move on the x axis
    //we want to loop through on the y axis
    if (pos == Position.X) {
      indextop = playerposy + halfy + 1;
      indexbottom = playerposy - halfy - 1;
    } else if (pos == Position.Y) {
      indextop = playerposx + halfx + 1;
      indexbottom = playerposx - halfy - 1;
    }
    while (indextop >= indexbottom) {
      if (pos == Position.X) {
        y = indextop;
        unloady = indextop;
        if (dir == Direction.RIGHT) {
          x = playerposx + halfx - 1;
          unloadx = playerposx - halfx - 1;
        }
        if (dir == Direction.LEFT) {
          x = playerposx - halfx + 1;
          unloadx = playerposx + halfx + 1;
        }
      }
      if (pos == Position.Y) {
        x = indextop;
        unloadx = indextop;
        if (dir == Direction.UP) {
          y = playerposy + halfy - 1;
          unloady = playerposy - halfy - 1;
        }
        if (dir == Direction.DOWN) {
          y = playerposy - halfy + 1;
          unloady = playerposy + halfy + 1;
        }
      }
      this.unloadChunk(unloadx, unloady);
      this.loadChunk(x, y);
      indextop--;
    }
  }

  /* Creates a new chunk */
  generateChunk(x:number, y:number, direction?:number): void {
    let coords = this.calculateDirection(x, y, direction);
    if (!this.chunkExists(coords.x, coords.y)) {
      let chunk = new Chunk(coords.x, coords.y, this.seed);
      this.chunks[World.coordinatesToString(coords.x, coords.y)] = chunk;
      this.loadChunk(coords.x, coords.y);
    }
  }

  /*
  * Checks if the chunk exists in the chunks variable.
  * Returns: boolean
  */
  chunkExists(x:number, y:number): boolean {
    return this.chunks[World.coordinatesToString(x, y)] != null;
  }

  /*
  * Returns a string version of the coordinates given.
  * Example:
  * -1, 4   ===   "m14"
  * 0, -12  ===   "0m12"
  */
  static coordinatesToString(x: number, y:number): string {
    let coords:string = x.toString() + y.toString();
    coords = coords.replace(/-/g, "m");
    return coords;
  }

  /*
  * Changes the coordinates to the direction given.
  * Returns a object with 2 values: x and y
  */
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

  /*
  * Draws a single chunk
  */
  drawChunk(chunk: Chunk, hover) {
    let c: string = World.coordinatesToString(chunk.x, chunk.y);
    let chunkpositionx:number = Canvas.center.x + (Chunk.chunksize * chunk.x) - (Chunk.chunksize / 2);
    let chunkpositiony:number = Canvas.center.y + (Chunk.chunksize * -chunk.y) - (Chunk.chunksize / 2);
    for (let tile in chunk.tiles) {
      let t:Tile = chunk.tiles[tile];
      let tilepositionx:number = chunkpositionx + (Tile.tilesize * (t.x - 1)) - (Tile.tilesize / 2);
      let tilepositiony:number = chunkpositiony + (Tile.tilesize * -(t.y)) - (Tile.tilesize / 2) + Chunk.chunksize;
      t.draw(tilepositionx, tilepositiony);
      if (c == hover.chunk && tile == hover.tile) {
        t.drawStroke(tilepositionx, tilepositiony);
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

  /*
  * Generates all 3 seeds for the world generation noise functions
  */
  generateSeed(): void {
    this.seed.island = rng(1, 65536);
    this.seed.biome.temp = rng(1, 65536);
    this.seed.biome.hum = rng(1, 65536);
  }
}
