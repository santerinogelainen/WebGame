
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
  static biomename: "Planes";
  static id: number = 1;
  min: number = -10;
  max: number = 10;

  constructor() {
    super();
  }

  getTile(x: number, y: number, noise: number) {
    return new tiles.Grass(x, y, noise);
  }
}

class Sea extends BiomeTemplate {
  static biomename: "Sea";
  static id: number = 2;
  min: number = 11;
  max: number = 40;

  constructor() {
    super();
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
