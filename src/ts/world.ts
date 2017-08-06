import { Direction } from "./general";
import { Position } from "./general";
import { Chunk } from "./chunk";
import { rng } from "./general";
import { coordinatesToString } from "./general";

export class World {

  //all seeds for for the chunks / world generation
  seed = {
    island: 0,
    biome: {
      temp: 0,
      hum: 0,
      alt: 0
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
      if (this.onscreen.indexOf(coordinatesToString(x, y)) == -1) {
        this.onscreen.push(coordinatesToString(x, y));
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
    let arrayindex: number = this.onscreen.indexOf(coordinatesToString(x, y));
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
      this.chunks[coordinatesToString(coords.x, coords.y)] = chunk;
      this.loadChunk(coords.x, coords.y);
    }
  }

  /*
  * Checks if the chunk exists in the chunks variable.
  * Returns: boolean
  */
  chunkExists(x:number, y:number): boolean {
    return this.chunks[coordinatesToString(x, y)] != null;
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
  draw() {
    for (let chunk of this.onscreen) {
      this.chunks[chunk].draw();
    }
  }

  /*
  * Generates all 3 seeds for the world generation noise functions
  */
  generateSeed(): void {
    this.seed.island = rng(1, 65536);
    this.seed.biome.temp = rng(1, 65536);
    this.seed.biome.hum = rng(1, 65536);
    this.seed.biome.alt = rng(1, 65536);
  }
}
