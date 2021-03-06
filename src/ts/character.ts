import { Position as Pos } from "./general";
import { Canvas } from "./canvas";
import { Chunk } from "./chunk";
import { Tile } from "./tile";

class Character {
  id: number;
  name: string;
  position: any;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  draw(x: number, y: number){};
}




export class Player extends Character {

  static size:number = 20;
  static speed:number = 3;
  moving: boolean = false;
  position: any = {
    world: {x: 0, y: 0},
    chunk: {x: 0, y: 0},
    tile: {x: Math.ceil(Chunk.tilesperside / 2), y: Math.ceil(Chunk.tilesperside / 2)},
    screen: {x: 0, y: 0}
  };

  constructor(id: number, name:string) {
    super(id, name);
    this.draw(Canvas.center.x, Canvas.center.y);
  }

  draw(x: number, y: number) {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = "#d35400";
    Canvas.context.arc(x, y, Player.size, 0, 2 * Math.PI);
    Canvas.context.fill();
    this.position.screen.x = x;
    this.position.screen.y = y;
  }

  updatePosition(position: number): void {
    switch(position) {
      case Pos.X:
        this.position.chunk.x = Math.round(this.position.world.x / Chunk.size);
        this.position.tile.x = Math.round(Chunk.tilesperside / 2) + Math.round((this.position.world.x / Tile.size)) - (this.position.chunk.x * Chunk.tilesperside);
        break;
      case Pos.Y:
        this.position.chunk.y = Math.round(this.position.world.y / Chunk.size);
        this.position.tile.y = Math.round(Chunk.tilesperside / 2) + Math.round((this.position.world.y / Tile.size)) - (this.position.chunk.y * Chunk.tilesperside);
        break;
      default:
        console.log("Error: unknown position " + position);
    }
  }

  walk(key) {
    let speed = Player.speed;
    if (key[16]) {
      speed = 2 * speed;
    }
    if (key[87]) { //W
      Canvas.center.y += speed;
      this.position.world.y += speed;
      this.updatePosition(Pos.Y);
    }
    if (key[65]) { //A
      Canvas.center.x += speed;
      this.position.world.x -= speed;
      this.updatePosition(Pos.X);
    }
    if (key[83]) { //S
      Canvas.center.y -= speed;
      this.position.world.y -= speed;
      this.updatePosition(Pos.Y);
    }
    if (key[68]) { //D
      Canvas.center.x -= speed;
      this.position.world.x += speed;
      this.updatePosition(Pos.X);
    }
  }

}
