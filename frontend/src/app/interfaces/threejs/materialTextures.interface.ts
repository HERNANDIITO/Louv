// Agrupación de las texturas en una interfaz para no tenerlas declaradas sueltas
export interface MaterialTextures {
  map ?: string;             // Color base
  normalMap ?: string;
  roughnessMap ?: string;
  metalnessMap ?: string;
  aoMap ?: string;
}