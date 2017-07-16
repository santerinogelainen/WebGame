
import * as tiles from "./tile";

interface Noise {
  min: number,
  max: number
}

class BiomeTemplate {
  static biomename: string;
  temperature: Noise;
  humidity: Noise;

  //each biome has it's own implementation of getTile
  //this function returns a new Tile of the biomes type
  getTile(x: number, y:number){};
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

  constructor() {
    super();
  }

  getTile(x: number, y: number) {
    return new tiles.Grass(x, y);
  }
}

export class Sea {
  static biomename = "Sea";
  static noise = {
    min: 0,
    max: 30
  };

  static getTile(x: number, y: number, noise: number) {
    if ( noise < 24 ) {
      return new tiles.DeepWater(x, y);
    } else {
      if ( noise <= 27 ) {
        return new tiles.Water(x, y);
      } else {
        return new tiles.Sand(x, y);
      }
    }
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

  constructor() {
    super();
  }

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

  constructor() {
    super();
  }

  getTile(x: number, y: number) {
    return new tiles.Snow(x, y);
  }
}

class WinterForest extends Winter {
  static biomename = "Winter Forest";
  temperature = {min: -50, max: -25};
  humidity = {min: -25, max: 50};
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

export class Biome {
  static islandsize: number = 500;
  static islandmax: number = 100;
  static tempsize: number = 150;
  static tempmax: number = 50;
  static humsize: number = 150;
  static hummax: number = 50;
  static get = {
    "forest": new Forest(),
    "desert": new Desert(),
    "winterforest": new WinterForest(),
    "winter": new Winter(),
    "plains": new Plains()
  };
}
