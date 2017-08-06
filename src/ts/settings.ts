import { Color } from "./general";

export class Settings {
  static maxcolornoiseoffset = 50;
  static usetilecolor = true;
  static useenvironmentcolor = true;
  static tilehovercolor: Color = new Color(255, 215, 0, 1);
  static tilehoverlinewidth: number = 2;
  static fpslimit: number = 60;
}
