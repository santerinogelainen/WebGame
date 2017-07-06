export enum Direction {
  UP, RIGHT, DOWN, LEFT
}

export enum Position {
  X, Y, Z
}

export function rng(min: number, max:number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b:number, a:number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getRGBA() {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
  }
}
