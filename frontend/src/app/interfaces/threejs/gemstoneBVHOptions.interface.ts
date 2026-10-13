import { ColorRepresentation } from "three";

export interface GemstoneBVHOptions {
  color?: ColorRepresentation;
  bounces?: number;
  ior?: number;
  aberrationStrength?: number;
  fresnelStrength?: number;
  envSample?: string;
}