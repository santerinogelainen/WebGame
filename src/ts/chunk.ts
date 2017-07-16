import { Tile } from "./tile";
import { coordinatesToString } from "./general";
import { Canvas } from "./Canvas";
import { Biome } from "./biome";
import { Sea } from "./biome";

export class Chunk {

  tiles = {};
  static tilesperside:number = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
  static chunksize:number = Chunk.tilesperside * Tile.tilesize;
  static loadsensitivity:number = 2;
  static perscreen:any = {x: 0, y: 0};
  static hover = "";
  x: number;
  y: number;

  constructor(x:number, y: number, seed) {
    this.x = x;
    this.y = y;
    this.generate(seed);
  }

  /*
  * Updates the current hovered chunk
  */
  static updateHover(x: number, y: number) {
    let chunk: string = coordinatesToString(x, y);
    Chunk.hover = chunk;
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
        let name: string = coordinatesToString(r, c);
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
