import { ColorRepresentation, CubeTexture } from "three";

// Parametros adicionales que puede contener un material según el tipo y si se desea
export interface StandardOptions {
  color?: ColorRepresentation;
  emissive?: ColorRepresentation;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  envMap?: CubeTexture;
  envMapIntensity?: number;
  ior?: number;
  absorptionColor?: number[];
  aberrationStrength?: number;
  fresnelStrength?: number;
  bounces?: number;
}
