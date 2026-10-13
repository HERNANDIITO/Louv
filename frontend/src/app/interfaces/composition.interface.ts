import { Setting } from "./setting.interface";

export interface Composition {
  baseStructure: string;
  size: string;
  material: string;
  materialPurity: string;
  profile: string;
  variant: string;
  settingsSize: string;
  settings: Setting[];
}
