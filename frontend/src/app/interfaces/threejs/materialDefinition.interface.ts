import { MaterialTextures } from "./materialTextures.interface";
import { StandardOptions } from "./standardOptions.interface";
import { PhongOptions } from "./phongOptions.interface";
import { PhysicalOptions } from "./physicalOptions.interface";
import { GemstoneBVHOptions } from "./gemstoneBVHOptions.interface";

// Tipos de materiales admitidos
export type MaterialType = 'standard' | 'phong' | 'physical' | 'gemstones';

// Configuración materiales completa
export interface MaterialDefinition {
  materialType: MaterialType;             
  textures ?: Partial<MaterialTextures>;  
  options ?: StandardOptions | PhongOptions | PhysicalOptions | GemstoneBVHOptions;          
}