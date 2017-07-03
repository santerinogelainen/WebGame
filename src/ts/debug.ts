
import { Canvas } from "./canvas";

export class Debug {

  static on:boolean = false;
  static lines:boolean = false;
  static worldtext:boolean = false;
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
    if (e.keyCode === 115) {
      e.preventDefault();
      if (Debug.lines == true) {
        Debug.lines = false;
      } else {
        Debug.lines = true;
      }
    }
    if (e.keyCode === 113) {
      e.preventDefault();
      if (Debug.worldtext == true) {
        Debug.worldtext = false;
      } else {
        Debug.worldtext = true;
      }
    }
  }

}
