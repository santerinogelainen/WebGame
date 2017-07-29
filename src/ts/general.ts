export enum Direction {
  UP, RIGHT, DOWN, LEFT
}

export enum Position {
  X, Y, Z
}

export enum HorizontalAlign {
  LEFT, CENTER, RIGHT
}

export enum VerticalAlign {
  TOP, MIDDLE, BOTTOM
}

export enum Shape {
  RECTANGLE, CIRCLE, TRIANGLE
}

export function rng(min: number, max:number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Texture {
  element: HTMLImageElement = new Image();

  constructor(possibilities: Array<string>) {
    this.setTexture(possibilities);
  }

  //randomly pick a texture (or if only 1 then that one)
  setTexture(srcs: Array<string>) {
    let rng:number = Math.floor(Math.random() * srcs.length);
    this.element.src = srcs[rng];
  }
}

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b:number, a?:number) {
    this.r = r;
    this.g = g;
    this.b = b;
    if (a != null) {
      this.a = a;
    } else {
      this.a = 1;
    }
  }

  toRGBA() {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
  }
}

/*
* Returns a string version of the coordinates given.
* Example:
* -1, 4   ===   "m14"
* 0, -12  ===   "0m12"
*/
export function coordinatesToString(x: number, y:number): string {
  let coords:string = x.toString() + y.toString();
  coords = coords.replace(/-/g, "m");
  return coords;
}
