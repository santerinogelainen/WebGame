import { Color } from "./general";
import { Texture } from "./general";
import { Shape } from "./general";
import { Settings } from "./settings";
import { Canvas } from "./canvas";

export class Environment {
  static treernglimit = 9;
  color: Color;
  texture: Texture;
  name: string;
  shape: Shape;
  offset = {
    x: 0,
    y: 0
  };
  size = {
    x: 0,
    y: 0
  };
  constructor() {

  }

  draw(x: number, y: number) {
    Canvas.context.beginPath();
    x = x - this.offset.x;
    y = y - this.offset.y;
    if (Settings.useenvironmentcolor) {
      Canvas.context.fillStyle = this.color.toRGBA();
      switch (this.shape) {
        case Shape.CIRCLE:
          Canvas.context.arc(x, y, this.size.x, 0, 2 * Math.PI);
          Canvas.context.fill();
          break;
        case Shape.RECTANGLE:
          Canvas.context.fillRect(x, y, this.size.x, this.size.y);
          break;
        case Shape.TRIANGLE:
          Canvas.context.moveTo(x + this.size.x, y + this.size.y);
          Canvas.context.lineTo(x, y + this.size.y);
          Canvas.context.lineTo(x + (this.size.x / 2), y);
          Canvas.context.fill();
          break;
        default:
          console.log("Unknown shape: " + this.shape);
      }
    } else {
      Canvas.context.drawImage(this.texture.element, x, y, this.size.x, this.size.y);
    }
  }
}

export class Tree extends Environment {
  color: Color = new Color(0, 100, 0);
  texture: Texture = new Texture(["src/img/big_oak.png"]);
  name: string = "Tree";
  shape: Shape = Shape.TRIANGLE;
  offset = {
    x: 20,
    y: 40
  };
  size = {
    x: 80,
    y: 80
  };
}
