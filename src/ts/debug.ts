
import { Canvas } from "./canvas";

export class Debug {

  static on:boolean = false;
  static lineHeight:number = 15;

  static draw(lines: Array<string>) {
    Canvas.context.beginPath();
    Canvas.context.font = Debug.lineHeight + "px sans-serif";
    Canvas.context.fillStyle = "#ffffff";
    let nthLine:number = 1;
    for (let line of lines) {
      Canvas.context.fillText(line, 0, nthLine * Debug.lineHeight);
      nthLine++;
    }
  }

  static toggle(e) {
    e = e || event;
    if (e.keyCode === 114) {
      e.preventDefault();
      if (Debug.on == true) {
        Debug.on = false;
      } else {
        Debug.on = true;
      }
    }
  }

}
