
import * as general from "./general";

export class Canvas {

  static element: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
  static context: CanvasRenderingContext2D = Canvas.element.getContext("2d");
  static bg: general.Color;
  static width: number = Canvas.element.clientWidth;
  static height: number = Canvas.element.clientHeight;
  static center = {x: (Canvas.width/2), y: (Canvas.height/2)};

  static init() {
    Canvas.element.width = Canvas.width;
    Canvas.element.height = Canvas.height;
  }

  static clear() {
    Canvas.context.clearRect(0, 0, this.width, this.height);
  }

  static setBackground(color: general.Color) {
    Canvas.bg = color;
    Canvas.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
    Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
  }

  static updateResolution() {
    //update canvas values
    let centerx:number = (Canvas.width / 2);
    let centery:number = (Canvas.height / 2);
    Canvas.center = {x: centerx, y: centery};
    Canvas.width = Canvas.element.clientWidth;
    Canvas.height = Canvas.element.clientHeight;
    Canvas.element.width = Canvas.width;
    Canvas.element.height = Canvas.height;
  }

  static updateBackground() {
    if (Canvas.bg != null) {
      //clear canvas
      Canvas.clear();
      //set background color of canvas
      Canvas.setBackground(Canvas.bg);
    }
  }

}
