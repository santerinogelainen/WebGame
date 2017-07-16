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
  static mouse: any = {
    world: {x: 0, y: 0},
    chunk: {x: 0, y: 0},
    tile: {x: 0, y: 0}
  };

  constructor(id: number, name:string) {
    super(id, name);
    this.draw(Canvas.center.x, Canvas.center.y);
  }

  draw(x: number, y: number) {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = "#d35400";
    Canvas.context.arc(x - (Player.size), y - (Player.size), Player.size, 0, 2 * Math.PI);
    Canvas.context.fill();
    this.position.screen.x = x;
    this.position.screen.y = y;
  }

  updatePosition(position: number): void {
    switch(position) {
      case Pos.X:
        this.position.chunk.x = Math.round(this.position.world.x / Chunk.chunksize);
        this.position.tile.x = Math.round(Chunk.tilesperside / 2) + Math.round((this.position.world.x / Tile.tilesize)) - (this.position.chunk.x * Chunk.tilesperside);
        break;
      case Pos.Y:
        this.position.chunk.y = Math.round(this.position.world.y / Chunk.chunksize);
        this.position.tile.y = Math.round(Chunk.tilesperside / 2) + Math.round((this.position.world.y / Tile.tilesize)) - (this.position.chunk.y * Chunk.tilesperside);
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

  /*
  * Updates the mouse position in relation to the canvas.
  */
  updateMousePosition(e) {
    e = e || window.event;
    let oldPosition = {x: Player.mouse.tile.x, y: Player.mouse.tile.y};
    Player.mouse.world.x = -(Canvas.center.x - e.pageX) + (Tile.tilesize / 2);
    Player.mouse.world.y = (Canvas.center.y - e.pageY) - (Tile.tilesize / 2);
    Player.mouse.chunk.x = Math.round((Player.mouse.world.x) / Chunk.chunksize);
    Player.mouse.chunk.y = Math.round((Player.mouse.world.y) / Chunk.chunksize);
    Player.mouse.tile.x = Math.floor(((Player.mouse.world.x + (Chunk.chunksize / 2) + Tile.tilesize) - (Player.mouse.chunk.x * Chunk.chunksize)) / Tile.tilesize);
    Player.mouse.tile.y = Math.floor(((Player.mouse.world.y + (Chunk.chunksize / 2) + Tile.tilesize) - (Player.mouse.chunk.y * Chunk.chunksize)) / Tile.tilesize);
    let newPosition = {x: Player.mouse.tile.x, y: Player.mouse.tile.y};
    if (newPosition.x != oldPosition.x || newPosition.y != oldPosition.y) {
      Chunk.updateHover(Player.mouse.chunk.x, Player.mouse.chunk.y);
      Tile.updateHover(Player.mouse.tile.x, Player.mouse.tile.y);
    }
  }

}
