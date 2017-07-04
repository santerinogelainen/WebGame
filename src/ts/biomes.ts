
import * as tiles from "./tiles";

class BiomeTemplate {
  //every biome has a name, id, min noise and max noise
  static biomename: string;
  static id: number;
  temperature = {min: 0, max:0};
  humidity = {min: 0, max: 0};

  //each biome has it's own implementation of getTile
  //this function returns a new Tile of the biomes type
  getTile(x: number, y:number, hum:number, temp:number){};
}

class Plains extends BiomeTemplate {
  static biomename = "Plains";
  static id = 1;
  temperature = {min: 0, max:100};
  humidity = {min: 0, max: 100};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Grass(x, y, hum, temp);
  }
}

class Sea extends BiomeTemplate {
  static biomename = "Sea";
  static id = 2;
  temperature = {min: 25, max:100};
  humidity = {min: 75, max: 100};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Water(x, y, hum, temp);
  }
}

class Desert extends BiomeTemplate {
  static biomename = "Desert";
  static id = 3;
  temperature = {min: 75, max:100};
  humidity = {min: 0, max: 25};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Sand(x, y, hum, temp);
  }
}

class Forest extends BiomeTemplate {
  static biomename = "Forest";
  static id = 4;
  temperature = {min: 25, max:100};
  humidity = {min: 25, max: 75};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Grass(x, y, hum, temp);
  }
}

class Winter extends BiomeTemplate {
  static biomename = "Winter";
  static id = 5;
  temperature = {min: 0, max:25};
  humidity = {min: 0, max: 50};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Snow(x, y, hum, temp);
  }
}

class FrozenWater extends BiomeTemplate {
  static biomename = "Frozen Water";
  static id = 5;
  temperature = {min: 0, max:25};
  humidity = {min: 50, max: 100};

  constructor() {
    super();
  }

  getTile(x: number, y: number, hum: number, temp: number) {
    return new tiles.Ice(x, y, hum, temp);
  }
}

export class Biome {
  static intensity: number = 300;
  static maxtemp: number = 100;
  static maxhum: number = 100;
  static plains = new Plains();
  static sea = new Sea();
  static desert = new Desert();
  static forest = new Forest();
  static winter = new Winter();
  static frozenwater = new FrozenWater();
  static biomes = [Biome.frozenwater, Biome.winter, Biome.desert, Biome.sea, Biome.forest, Biome.plains];
}
