
import * as tiles from "./tiles";

class Planes {
  id: number = 1;
  min: number = -10;
  max: number = 10;

  constructor() {

  }

  getTile(x: number, y: number, noise: number) {
    return new tiles.Grass(x, y, noise);
  }
}

class Sea {
  id: number = 2;
  min: number = 11;
  max: number = 40;

  constructor() {

  }

  getTile(x: number, y:number, noise: number) {
    return new tiles.Water(x, y, noise);
  }
}

export class Biome {
  static intensity: number = 300;
  static planes = new Planes();
  static sea = new Sea();
  static biomes = [Biome.planes, Biome.sea];
}
