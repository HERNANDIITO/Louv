import { ColorRepresentation, CubeTexture } from "three";

export interface PhysicalOptions {
  color ?: ColorRepresentation;
  emissive ?: ColorRepresentation;
  emissiveIntensity ?: number;
  clearcoat ?: number;
  clearcoatRoughness: number;
  ior ?: number;
  reflectivity ?: number;
  metalness ?: number;
  roughness ?: number;
  transmission ?: number;   // Cantidad de luz que atraviesa
  thickness ?: number;      // Grosor óptico interno
  attenuationColor ?: ColorRepresentation;
  attenuationDistance ?: number;
  specularIntensity ?: number;
  opacity ?: number
  envMap ?: CubeTexture;
  envMapIntensity ?: number;
  transparent ?: boolean;
  iridescence ?: number;
}