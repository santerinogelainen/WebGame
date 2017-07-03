
import * as tiles from "./tiles";

class BiomeTemplate {
  //every biome has a name, id, min noise and max noise
  static biomename: string;
  static id: number;
  min: number;
  max: number;

  //each biome has it's own implementation of getTile
  //this function returns a new Tile of the biomes type
  getTile(x: number, y:number, noise:number){};
}

class Planes extends BiomeTemplate {
  static biomename = "Planes";
  static id = 1;
  min = 0;
  max = 15;

  constructor() {
    super();
  }

  getTile(x: number, y: number, noise: number) {
    return new tiles.Grass(x, y, noise);
  }
}

class Sea extends BiomeTemplate {
  static biomename = "Sea";
  static id = 2;
  min = 16;
  max = 30;

  constructor() {
    super();
  }

  getTile(x: number, y:number, noise: number) {
    return new tiles.Water(x, y, noise);
  }
}

class Desert extends BiomeTemplate {
  static biomename = "Desert";
  static id = 3;
  min = 31;
  max = 45;

  constructor() {
    super();
  }

  getTile(x: number, y:number, noise: number) {
    return new tiles.Sand(x, y, noise);
  }
}

export class Biome {
  static intensity: number = 300;
  static planes = new Planes();
  static sea = new Sea();
  static desert = new Desert();
  static biomes = [Biome.planes, Biome.sea, Biome.desert];
}
