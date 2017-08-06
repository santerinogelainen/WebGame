import { Canvas } from "./canvas";
import { HorizontalAlign } from "./general";
import { VerticalAlign } from "./general";
import { Color } from "./general";

export class Tiletip {

  static offset: number = 10;
  static padding: number = 5;
  static fontsize: number = 15;
  static color: Color = new Color(255, 255, 255);
  static backgroundcolor: Color = new Color(0, 0, 0);
  static vertical: VerticalAlign = VerticalAlign.TOP;
  static horizontal: HorizontalAlign = HorizontalAlign.CENTER;

  static draw(tile) {
    Canvas.context.beginPath();
    Canvas.context.font = "15px sans-serif";
    Canvas.context.textBaseline = "top";
    let text: string;
    if (tile.environment != null) {
      text = tile.name + " (" + tile.environment.name + ")";
    } else {
      text = tile.name;
    }
    let width: number = Canvas.context.measureText(text).width;
    let height: number = Tiletip.fontsize;
    let x: number = Tiletip.getX(width);
    let y: number = Tiletip.getY(Tiletip.fontsize);
    Canvas.context.fillStyle = Tiletip.backgroundcolor.toRGBA();
    Canvas.context.fillRect((x - Tiletip.padding), (y - Tiletip.padding), (width + (2 * Tiletip.padding)), (height + (2 * Tiletip.padding)));
    Canvas.context.fillStyle = Tiletip.color.toRGBA();
    Canvas.context.fillText(text, x, y);
  }

  static getX(textwidth: number): number {
    switch(Tiletip.horizontal) {
      case HorizontalAlign.LEFT:
        return Tiletip.offset;
      case HorizontalAlign.CENTER:
        return (Canvas.width / 2) - (textwidth / 2);
      case HorizontalAlign.RIGHT:
        return Canvas.width - textwidth - Tiletip.offset;
      default:
        console.log("Unknown align: " + Tiletip.horizontal);
        return null;
    }
  }

  static getY(textheight: number): number {
    switch(Tiletip.vertical) {
      case VerticalAlign.TOP:
        return Tiletip.offset;
      case VerticalAlign.MIDDLE:
        return (Canvas.height / 2) - (textheight / 2);
      case VerticalAlign.BOTTOM:
        return Canvas.height - textheight - Tiletip.offset;
      default:
        console.log("Unknown align: " + Tiletip.vertical);
        return null;
    }
  }

}
