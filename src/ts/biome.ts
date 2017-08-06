
import * as tiles from "./tile";
import { Environment } from "./environment";
import { rng } from "./general";
import { Settings } from "./settings";

interface Noise {
  min: number,
  max: number
}

class BiomeTemplate {
  static biomename: string;
  temperature: Noise;
  humidity: Noise;
  altitude: Noise;

  //each biome has it's own implementation of getTile
  //this function returns a new Tile of the biomes type
  getTile(x: number, y:number){};

  calculateColorOffset(noise): number {
    let fullarea: number = this.temperature.max - this.temperature.min;
    let progress: number = this.temperature.max - noise;
    return Math.round((progress / fullarea) * Settings.maxcolornoiseoffset);
  };
}

class Plains extends BiomeTemplate {
  static biomename = "Plains";
  temperature = {
    min: -50,
    max: 50
  };
  humidity = {
    min: -50,
    max: 50
  };
  altitude = {
    min: 0,
    max: 50
  };

  getTile(x: number, y: number) {
    return new tiles.Grass(x, y);
  }
}

export class Sea extends Environment {
  static biomename = "Sea";
  temperature = {
    min: -50,
    max: 50
  };
  humidity = {
    min: 25,
    max: 50
  };
  altitude = {
    min: -50,
    max: 0
  };

  getTile(x: number, y: number) {
      return new tiles.DeepWater(x, y);
  }
}

class Desert extends BiomeTemplate {
  static biomename = "Desert";
  temperature = {
    min: 25,
    max:50
  };
  humidity = {
    min: 0,
    max: 25
  };
  altitude = {
    min: 0,
    max: 50
  };

  getTile(x: number, y: number) {
    return new tiles.Sand(x, y);
  }
}

class Forest extends Plains {
  static biomename = "Forest";
  temperature = {
    min: -25,
    max: 25
  };
  humidity = {
    min: -25,
    max: 50
  };
  altitude = {
    min: 0,
    max: 50
  };
  getTile(x: number, y: number) {
    let n: number = rng(1, 10);
    if (n > Environment.treernglimit) {
      return new tiles.Grass(x, y, true);
    }
    return new tiles.Grass(x, y);
  };
}

class Winter extends BiomeTemplate {
  static biomename = "Winter";
  temperature = {
    min: -50,
    max: -25
  };
  humidity = {
    min: -50,
    max: -25
  };
  altitude = {
    min: 35,
    max: 50
  };

  getTile(x: number, y: number) {
    return new tiles.Snow(x, y);
  }
}

class WinterForest extends Winter {
  static biomename = "Winter Forest";
  temperature = {min: -50, max: -25};
  humidity = {min: -25, max: 50};
  altitude = {min: 35, max: 50};

  getTile(x: number, y: number) {
    let n: number = rng(1, 10);
    if (n > Environment.treernglimit) {
      return new tiles.Snow(x, y, true);
    }
    return new tiles.Snow(x, y);
  };
}

/*class FrozenWater extends BiomeTemplate {
  static biomename = "Frozen Water";
  temperature = {min: 0, max:25};
  humidity = {min: 80, max: 100};

  constructor() {
    super();
  }

  getTile(x: number, y: number) {
    return new tiles.Ice(x, y);
  }
}*/

/*
* "static" class, holds all the settings for the biomes
*/


// TO DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// implement islands again


export class Biome {
  static islandsize: number = 500;
  static islandmax: number = 100;
  static tempmax: number = 50;
  static hummax: number = 50;
  static altmax: number = 50;
  static tempsize: number = 150;
  static humsize: number = 150;
  static altsize: number = 150;
  static get = {
    "forest": new Forest(),
    "desert": new Desert(),
    "winterforest": new WinterForest(),
    "winter": new Winter(),
    "sea": new Sea(),
    "plains": new Plains()
  };
}
