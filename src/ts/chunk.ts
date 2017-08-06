import { Tile } from "./tile";
import { coordinatesToString } from "./general";
import { Canvas } from "./canvas";
import { Biome } from "./biome";
import { Sea } from "./biome";
import { Debug } from "./debug";
import { Mouse } from "./mouse";

export class Chunk {

  tiles = {};
  static tilesperside:number = 7; //USE ONLY NUMBERS WHERE % 2 = 1;
  static size:number = Chunk.tilesperside * Tile.size;
  static perscreen:any = {x: 0, y: 0};
  static hover = "";
  x: number;
  y: number;

  constructor(x:number, y: number, seed) {
    this.x = x;
    this.y = y;
    this.generate(seed);
  }

  static getMouseCoordinates() {
    let x: number = Math.round((Mouse.position.world.x) / Chunk.size);
    let y: number = Math.round((Mouse.position.world.y) / Chunk.size);
    return {"x": x, "y": y};
  }

  /*
  * Updates the current hovered chunk and tile
  */
  static updateHover() {
    let coords = Chunk.getMouseCoordinates();
    let chunk: string = coordinatesToString(coords.x, coords.y);
    Chunk.hover = chunk;
    Tile.updateHover(Chunk.size, coords);
  }

  /*
  * Calculate how many chunks can fit the screen
  */
  static calculatePerScreenRatio(): void {
    Chunk.perscreen.x = Math.ceil(Canvas.width / Chunk.size);
    Chunk.perscreen.y = Math.ceil(Canvas.height / Chunk.size);
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
        /*let islandnoise = Tile.generateNoise((x / Biome.islandsize), (y / Biome.islandsize), seed.island, true) * Biome.islandmax;
        if (islandnoise >= Sea.noise.min && islandnoise <= Sea.noise.max) {
          tile = Sea.getTile(r, c, islandnoise);
        } else {*/
          let temp: number = Tile.generateNoise((x / Biome.tempsize), (y / Biome.tempsize), seed.biome.temp) * Biome.tempmax;
          let hum: number = Tile.generateNoise((x / Biome.humsize), (y / Biome.humsize), seed.biome.hum) * Biome.hummax;
          let alt: number = Tile.generateNoise((x / Biome.altsize), (y / Biome.altsize), seed.biome.alt) * Biome.altmax;
          let biome = this.getBiome(temp, hum, alt);
          tile = biome.getTile(r, c);

          //tile.setColorOffset(biome.calculateColorOffset(alt));
        //}
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
  getBiome(temp: number, hum: number, alt: number) {
    for (let biome in Biome.get) {
      let b = Biome.get[biome];
      if ((temp >= b.temperature.min && temp <= b.temperature.max) && (hum >= b.humidity.min && hum <= b.humidity.max)) {
        return b;
      }
    }
  }

  draw() {
    let chunk: string = coordinatesToString(this.x, this.y);
    let chunkpositionx:number = Canvas.center.x + (Chunk.size * this.x) - (Chunk.size / 2);
    let chunkpositiony:number = Canvas.center.y + (Chunk.size * -this.y) - (Chunk.size / 2);
    for (let t in this.tiles) {
      let tile:Tile = this.tiles[t];
      let tilepositionx:number = chunkpositionx + (Tile.size * (tile.x - 1));
      let tilepositiony:number = chunkpositiony + (Tile.size * -(tile.y)) + Chunk.size;
      if (chunk == Chunk.hover) {
        tile.draw(tilepositionx, tilepositiony, true, t);
      } else {
        tile.draw(tilepositionx, tilepositiony, false, t);
      }
    }
    if (Debug.worldtext) {
      Canvas.context.beginPath();
      Canvas.context.font = "15px sans-serif";
      Canvas.context.fillStyle = "red";
      Canvas.context.fillText("" + this.x + ", " + this.y, chunkpositionx - (Tile.size / 2) + 5, chunkpositiony - (Tile.size / 2) + 20);
    }
    if (Debug.lines) {
      Canvas.context.beginPath();
      Canvas.context.rect(chunkpositionx - (Tile.size / 2), chunkpositiony - (Tile.size / 2), Chunk.size, Chunk.size);
      Canvas.context.strokeStyle = "red";
      Canvas.context.stroke();
    }
  }

}
