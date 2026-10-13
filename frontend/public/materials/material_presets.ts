import { MaterialDefinition } from "../../src/app/interfaces/threejs/materialDefinition.interface";

const gold18: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xfff2bf,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const gold14: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xfcf6d7,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const gold9: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xffde21,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const roseGold18: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xffcbde,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const roseGold14: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xfac0d6,
    //color: 0xFCB3CE,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const roseGold9: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xfcb3ce,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

const whiteGold: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/gold/baseColorWhiteGold.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg",
  },
  options: {
    color: 0xebf4fc,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xffe375,
    emissiveIntensity: 0.05,
    envMapIntensity: 0.96,
  },
};

export const diamond: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0xffffff,
    ior: 2.417,
    aberrationStrength: 0.04,
    fresnelStrength: 2.5,
    absorptionColor: [0.0, 0.0, 0.0],
    opacity: 0.933,
  },
};

export const ruby: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0xe0115f,
    ior: 1.762,
    bounces: 2,
    aberrationStrength: 0.008,
    fresnelStrength: 1.2,
    absorptionColor: [0.1, 5.5, 4.5],
    opacity: 0.933,
  },
};

export const emerald: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0x50c878,
    ior: 1.575,
    bounces: 2,
    aberrationStrength: 0.005,
    fresnelStrength: 1.1,
    absorptionColor: [5.0, 0.2, 3.5],
    opacity: 0.933,
  },
};

export const sapphire: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0x0f52ba,
    ior: 1.765,
    bounces: 2,
    aberrationStrength: 0.009,
    fresnelStrength: 1.3,
    absorptionColor: [5.5, 3.5, 0.1],
    opacity: 0.933,
  },
};

export const amethyst: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0x9966cc,
    ior: 1.544,
    bounces: 2,
    aberrationStrength: 0.004,
    fresnelStrength: 1.0,
    absorptionColor: [1.8, 5.0, 0.4],
    opacity: 0.933,
  },
};

export const aquamarine: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0x7fffd4,
    ior: 1.577,
    bounces: 3,
    aberrationStrength: 0.006,
    fresnelStrength: 1.2,
    absorptionColor: [1.2, 0.1, 0.3],
    opacity: 0.933,
  },
};

export const blueTourmaline: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0x007577,
    ior: 1.635,
    bounces: 2,
    aberrationStrength: 0.007,
    fresnelStrength: 1.15,
    absorptionColor: [4.5, 0.6, 0.4],
    opacity: 0.933,
  },
};

export const imperialTopaz: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0xffa500,
    ior: 1.619,
    bounces: 2,
    aberrationStrength: 0.008,
    fresnelStrength: 1.2,
    absorptionColor: [0.2, 2.5, 5.0],
    opacity: 0.933,
  },
};

export const none: MaterialDefinition = {
  materialType: "phong",
  textures: {},
  options: {
    color: 0xffffff,
    opacity: 0.0,
    transparent: true,
    ior: 1.0,
    bounces: 0,
    aberrationStrength: 0.0,
    fresnelStrength: 0.0,
    absorptionColor: [0.0, 0.0, 0.0],
  },
};

const blackSilk: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg",
  },
  options: {
    color: 0x000000,
    envMapIntensity: 0.1,
  },
};

const whiteSilk: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg",
  },
  options: {
    color: 0xc2c2c2,
    envMapIntensity: 0.1,
  },
};

const redSilk: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg",
  },
  options: {
    color: 0x570b0b,
    envMapIntensity: 0.1,
  },
};

const blueSilk: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg",
  },
  options: {
    color: 0x0f1230,
    envMapIntensity: 0.1,
  },
};

const purpleSilk: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg",
  },
  options: {
    color: 0x241030,
    envMapIntensity: 0.1,
  },
};

const blackVelvet: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg",
  },
  options: {
    color: 0x000000,
    envMapIntensity: 0.1,
  },
};

const whiteVelvet: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg",
  },
  options: {
    color: 0xf7f7f7,
    envMapIntensity: 0.1,
  },
};

const redVelvet: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg",
  },
  options: {
    color: 0x800606,
    envMapIntensity: 0.1,
  },
};

const blueVelvet: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg",
  },
  options: {
    color: 0x10063d,
    envMapIntensity: 0.1,
  },
};

const purpleVelvet: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg",
  },
  options: {
    color: 0x3a2845,
    envMapIntensity: 0.1,
  },
};

const blackLeather: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg",
  },
  options: {
    color: 0x000000,
    envMapIntensity: 0.1,
  },
};

const whiteLeather: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg",
  },
  options: {
    color: 0xffffff,
    envMapIntensity: 0.1,
  },
};

const redLeather: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg",
  },
  options: {
    color: 0x961818,
    envMapIntensity: 0.1,
  },
};

const blueLeather: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg",
  },
  options: {
    color: 0x140854,
    envMapIntensity: 0.1,
  },
};

const purpleLeather: MaterialDefinition = {
  materialType: "standard",
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg",
  },
  options: {
    color: 0x5f4370,
    envMapIntensity: 0.1,
  },
};

export const presets: Record<string, MaterialDefinition> = {
  gold18,
  gold14,
  gold9,
  roseGold18,
  roseGold14,
  roseGold9,
  whiteGold,
  ruby,
  diamond,
  aquamarine,
  blueTourmaline,
  emerald,
  sapphire,
  amethyst,
  none,
  // Silk
  whiteSilk,
  blackSilk,
  redSilk,
  blueSilk,
  purpleSilk,
  // Velvet
  blackVelvet,
  whiteVelvet,
  redVelvet,
  blueVelvet,
  purpleVelvet,
  // Leather
  blackLeather,
  whiteLeather,
  redLeather,
  blueLeather,
  purpleLeather,
};
