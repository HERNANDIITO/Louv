import { IUniform } from "three";

export interface PhongOptions {
  transparent ?: boolean;
  vertexShader ?: string;
  fragmentShader ?: string;
  uniforms ?: Record<string, IUniform>; // Threejs espera dentro de uniforms esta estructura: time: { value: 0.0 },
  opacity ?: number;
  defines ?: { [key: string]: any };
}
