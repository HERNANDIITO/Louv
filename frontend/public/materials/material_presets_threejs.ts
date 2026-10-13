import { MaterialDefinition } from "../../src/app/interfaces/threejs/materialDefinition.interface"

const gold18: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xFFF2BF,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const gold14: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xFCF6D7,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const gold9: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xFCFAED,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const roseGold18: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xffcbde,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const roseGold14: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xFAC0D6,
    //color: 0xFCB3CE,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const roseGold9: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColor.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xFCB3CE,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const whiteGold: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/gold/baseColorWhiteGold.jpeg",
    normalMap: "/gold/normal.jpeg",
    roughnessMap: "/gold/roughness.jpeg",
    metalnessMap: "/gold/metallic.jpeg",
    aoMap: "/gold/ambientOcclusion.jpeg"
  },
  options: {
    color: 0xEBF4FC,
    metalness: 0.923,
    roughness: 0.3,
    emissive: 0xFFE375,
    emissiveIntensity: 0.12,
    envMapIntensity: .96
  }
}

const diamond: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0xffffff,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      // Entorno neutro de estudio:
      // arriba muy claro, abajo profundo, medios suaves
      vec3 topColor = vec3(0.98, 0.98, 0.96);
      vec3 upperMidColor = vec3(0.72, 0.74, 0.76);
      vec3 lowerMidColor = vec3(0.22, 0.24, 0.26);
      vec3 bottomColor = vec3(0.02, 0.025, 0.03);
      vec3 base;

      if (h > 0.72) {
        base = mix(upperMidColor, topColor, (h - 0.72) / 0.28);
      } else if (h > 0.38) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.38) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.38);
      }

      // Highlights grandes y suaves tipo estudio
      vec3 lightDirA = normalize(vec3(0.30, 0.92, 0.18));
      vec3 lightDirB = normalize(vec3(-0.55, 0.78, -0.10));
      vec3 lightDirC = normalize(vec3(0.08, 0.98, -0.42));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 18.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 24.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 12.0);

      // Sombreado lateral y hacia abajo
      float sideShade = 1.0 - 0.24 * abs(dir.x);
      float lowerShade = 1.0 - 0.20 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      // Highlights casi blancos, con muy ligera diferencia de temperatura
      color += vec3(1.00, 0.99, 0.97) * highlightA * 0.34;
      color += vec3(0.94, 0.97, 1.00) * highlightB * 0.22;
      color += vec3(0.90, 0.92, 0.95) * highlightC * 0.10;

      // Lift mínimo para evitar negros muertos absolutos
      color += vec3(0.008);

      return clamp(color, 0.0, 1.0);
    }
    `
  }
}

const ruby: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0xA83928,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      // Techo muy luminoso con tinte rosado cálido,
      // medios ricos en carmín, base vino profunda
      vec3 topColor      = vec3(1.00, 0.96, 0.98);
      vec3 upperMidColor = vec3(0.92, 0.30, 0.42);
      vec3 lowerMidColor = vec3(0.42, 0.04, 0.11);
      vec3 bottomColor   = vec3(0.055, 0.000, 0.015);

      vec3 base;
      if (h > 0.74) {
        base = mix(upperMidColor, topColor, (h - 0.74) / 0.26);
      } else if (h > 0.40) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.40) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.40);
      }

      // Luces de estudio amplias y elegantes
      vec3 lightDirA = normalize(vec3(0.24, 0.95, 0.16));
      vec3 lightDirB = normalize(vec3(-0.48, 0.84, -0.06));
      vec3 lightDirC = normalize(vec3(0.10, 0.99, -0.34));
      vec3 lightDirD = normalize(vec3(-0.08, 0.72, 0.68));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 20.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 28.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 14.0);
      float highlightD = pow(max(dot(dir, lightDirD), 0.0), 36.0);

      float sideShade  = 1.0 - 0.18 * abs(dir.x);
      float lowerShade = 1.0 - 0.14 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      // Halo vertical suave para efecto escaparate / vitrina de lujo
      float verticalGlow = pow(h, 2.2) * 0.10;
      color += vec3(0.22, 0.03, 0.07) * verticalGlow;

      // Highlights pulidos, perlados, con leves variaciones rosadas
      color += vec3(1.00, 0.98, 0.99) * highlightA * 0.42;
      color += vec3(1.00, 0.88, 0.93) * highlightB * 0.26;
      color += vec3(0.98, 0.72, 0.82) * highlightC * 0.15;
      color += vec3(1.00, 0.99, 1.00) * highlightD * 0.10;

      // Lift sutil para evitar negros muertos
      color += vec3(0.010, 0.0015, 0.003);

      // Un toque de compresión tonal suave para acabado más fotográfico
      color = pow(clamp(color, 0.0, 1.0), vec3(0.92));

      return clamp(color, 0.0, 1.0);
    }
  `
  }
}

const aquamarine: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0xd0f0f9,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      // Entorno de alta joyería para aguamarina:
      // arriba muy limpio y glacial, medios aqua delicados,
      // base azul-verdosa suave y transparente
      vec3 topColor      = vec3(0.96, 1.00, 1.00);
      vec3 upperMidColor = vec3(0.42, 0.84, 0.92);
      vec3 lowerMidColor = vec3(0.10, 0.34, 0.40);
      vec3 bottomColor   = vec3(0.02, 0.10, 0.12);

      vec3 base;
      if (h > 0.74) {
        base = mix(upperMidColor, topColor, (h - 0.74) / 0.26);
      } else if (h > 0.40) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.40) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.40);
      }

      // Luces de estudio premium, suaves y cristalinas
      vec3 lightDirA = normalize(vec3(0.24, 0.95, 0.18));
      vec3 lightDirB = normalize(vec3(-0.48, 0.84, -0.06));
      vec3 lightDirC = normalize(vec3(0.10, 0.99, -0.34));
      vec3 lightDirD = normalize(vec3(-0.10, 0.74, 0.66));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 20.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 28.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 14.0);
      float highlightD = pow(max(dot(dir, lightDirD), 0.0), 34.0);

      // Modelado suave, menos dramático que zafiro
      float sideShade  = 1.0 - 0.14 * abs(dir.x);
      float lowerShade = 1.0 - 0.11 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      // Glow vertical ligero, tipo vitrina clara
      float verticalGlow = pow(h, 2.1) * 0.09;
      color += vec3(0.05, 0.12, 0.12) * verticalGlow;

      // Highlights blancos fríos, con sesgo aqua muy sutil
      color += vec3(1.00, 1.00, 1.00) * highlightA * 0.44;
      color += vec3(0.92, 1.00, 1.00) * highlightB * 0.28;
      color += vec3(0.78, 0.96, 1.00) * highlightC * 0.14;
      color += vec3(0.98, 1.00, 1.00) * highlightD * 0.08;

      // Lift delicado para que la piedra respire
      color += vec3(0.006, 0.012, 0.012);

      // Acabado fotográfico suave y luminoso
      color = pow(clamp(color, 0.0, 1.0), vec3(0.91));

      return clamp(color, 0.0, 1.0);
    }
    `
  }
};

const blueTourmaline: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0x72DBE8,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      vec3 topColor      = vec3(0.94, 1.00, 1.00);
      vec3 upperMidColor = vec3(0.06, 0.90, 1.00);
      vec3 lowerMidColor = vec3(0.00, 0.36, 0.48);
      vec3 bottomColor   = vec3(0.00, 0.07, 0.10);

      vec3 base;
      if (h > 0.76) {
        base = mix(upperMidColor, topColor, (h - 0.76) / 0.24);
      } else if (h > 0.42) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.42) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.42);
      }

      vec3 lightDirA = normalize(vec3(0.28, 0.94, 0.18));
      vec3 lightDirB = normalize(vec3(-0.52, 0.82, -0.08));
      vec3 lightDirC = normalize(vec3(0.06, 0.99, -0.30));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 22.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 32.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 15.0);

      float sideShade  = 1.0 - 0.15 * abs(dir.x);
      float lowerShade = 1.0 - 0.14 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      color += vec3(1.00, 1.00, 1.00) * highlightA * 0.46;
      color += vec3(0.86, 1.00, 1.00) * highlightB * 0.30;
      color += vec3(0.58, 0.96, 1.00) * highlightC * 0.14;

      color += vec3(0.000, 0.012, 0.014);
      color = pow(clamp(color, 0.0, 1.0), vec3(0.90));

      return clamp(color, 0.0, 1.0);
    }
    `
  }
};

const emerald: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0x33966D,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      vec3 topColor      = vec3(0.99, 1.00, 0.99);
      vec3 upperMidColor = vec3(0.12, 0.60, 0.38);
      vec3 lowerMidColor = vec3(0.01, 0.18, 0.11);
      vec3 bottomColor   = vec3(0.00, 0.025, 0.020);

      vec3 base;
      if (h > 0.76) {
        base = mix(upperMidColor, topColor, (h - 0.76) / 0.24);
      } else if (h > 0.42) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.42) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.42);
      }

      vec3 lightDirA = normalize(vec3(0.26, 0.94, 0.18));
      vec3 lightDirB = normalize(vec3(-0.50, 0.82, -0.06));
      vec3 lightDirC = normalize(vec3(0.06, 0.99, -0.28));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 26.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 36.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 18.0);

      float sideShade  = 1.0 - 0.15 * abs(dir.x);
      float lowerShade = 1.0 - 0.15 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      color += vec3(1.00, 1.00, 1.00) * highlightA * 0.42;
      color += vec3(0.94, 1.00, 0.98) * highlightB * 0.22;
      color += vec3(0.78, 0.94, 0.88) * highlightC * 0.10;

      color += vec3(0.0008, 0.006, 0.004);
      color = pow(clamp(color, 0.0, 1.0), vec3(0.94));

      return clamp(color, 0.0, 1.0);
    }
    `
  }
};

const sapphire: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    //color: 0x3f46cc,
    color: 0x3c42a3,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
      dir = normalize(dir);
      float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

      // Entorno de alta joyería para zafiro:
      // techo limpio y frío, medios azul real, base azul noche
      vec3 topColor      = vec3(0.96, 0.98, 1.00);
      vec3 upperMidColor = vec3(0.22, 0.40, 0.92);
      vec3 lowerMidColor = vec3(0.04, 0.09, 0.34);
      vec3 bottomColor   = vec3(0.005, 0.012, 0.060);

      vec3 base;
      if (h > 0.74) {
        base = mix(upperMidColor, topColor, (h - 0.74) / 0.26);
      } else if (h > 0.40) {
        base = mix(lowerMidColor, upperMidColor, (h - 0.40) / 0.34);
      } else {
        base = mix(bottomColor, lowerMidColor, h / 0.40);
      }

      // Luces de estudio premium, frías y definidas
      vec3 lightDirA = normalize(vec3(0.24, 0.95, 0.18));
      vec3 lightDirB = normalize(vec3(-0.48, 0.84, -0.06));
      vec3 lightDirC = normalize(vec3(0.10, 0.99, -0.34));
      vec3 lightDirD = normalize(vec3(-0.12, 0.72, 0.68));

      float highlightA = pow(max(dot(dir, lightDirA), 0.0), 22.0);
      float highlightB = pow(max(dot(dir, lightDirB), 0.0), 32.0);
      float highlightC = pow(max(dot(dir, lightDirC), 0.0), 15.0);
      float highlightD = pow(max(dot(dir, lightDirD), 0.0), 40.0);

      // Modelado suave con algo más de contraste lateral
      float sideShade  = 1.0 - 0.18 * abs(dir.x);
      float lowerShade = 1.0 - 0.15 * (1.0 - h);

      vec3 color = base * sideShade * lowerShade;

      // Glow vertical sutil, frío, tipo vitrina de lujo
      float verticalGlow = pow(h, 2.3) * 0.085;
      color += vec3(0.015, 0.035, 0.11) * verticalGlow;

      // Highlights blancos fríos con leve inclinación azul
      color += vec3(1.00, 1.00, 1.00) * highlightA * 2.0;
      color += vec3(0.90, 0.96, 1.00) * highlightB * 2.4;
      color += vec3(0.72, 0.84, 1.00) * highlightC * 1.4;
      color += vec3(0.98, 0.99, 1.00) * highlightD * 0.8;

      // Lift mínimo para que el azul profundo no se cierre demasiado
      color += vec3(0.001, 0.003, 0.010);

      // Compresión tonal suave para acabado fotográfico
      color = pow(clamp(color, 0.15, 1.0), vec3(0.93));

      return clamp(color, 0.15, 1.0);
    }
    `
  }
};

const amethyst: MaterialDefinition = {
  materialType: 'gemstones',
  textures: {},
  options: {
    color: 0x8549B3,
    bounces: 3,
    ior: 2.67,
    aberrationStrength: 0.001,
    fresnelStrength: 1.55,
    envSample: `
      vec3 envSample(vec3 dir) {
        dir = normalize(dir);
        float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

        vec3 topColor      = vec3(0.985, 0.975, 1.00);
        vec3 upperMidColor = vec3(0.48, 0.22, 0.72);
        vec3 lowerMidColor = vec3(0.15, 0.05, 0.26);
        vec3 bottomColor   = vec3(0.020, 0.008, 0.045);

        vec3 base;
        if (h > 0.76) {
          base = mix(upperMidColor, topColor, (h - 0.76) / 0.24);
        } else if (h > 0.42) {
          base = mix(lowerMidColor, upperMidColor, (h - 0.42) / 0.34);
        } else {
          base = mix(bottomColor, lowerMidColor, h / 0.42);
        }

        vec3 lightDirA = normalize(vec3(0.28, 0.94, 0.18));
        vec3 lightDirB = normalize(vec3(-0.52, 0.82, -0.08));
        vec3 lightDirC = normalize(vec3(0.06, 0.99, -0.30));

        float highlightA = pow(max(dot(dir, lightDirA), 0.0), 24.0);
        float highlightB = pow(max(dot(dir, lightDirB), 0.0), 36.0);
        float highlightC = pow(max(dot(dir, lightDirC), 0.0), 17.0);

        float sideShade  = 1.0 - 0.16 * abs(dir.x);
        float lowerShade = 1.0 - 0.16 * (1.0 - h);

        vec3 color = base * sideShade * lowerShade;

        color += vec3(1.00, 1.00, 1.00) * highlightA * 0.42;
        color += vec3(0.97, 0.94, 1.00) * highlightB * 0.22;
        color += vec3(0.82, 0.70, 0.98) * highlightC * 0.10;

        color += vec3(0.002, 0.001, 0.006);
        color = pow(clamp(color, 0.0, 1.0), vec3(0.94));

        return clamp(color, 0.0, 1.0);
      }
    `
  }
};

const none: MaterialDefinition = { 
  materialType: 'phong',
  textures: {},
  options: {
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
      }
    `,
    uniforms: {
      time: { value: 0.0 } 
    },
    transparent: true,
    opacity: 0.0,
    defines: {}
  }
}

const blackSilk: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg"
  },
  options: {
    color: 0x000000,
    envMapIntensity: .1
  }
}

const whiteSilk: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg"
  },
  options: {
    color: 0xc2c2c2,
    envMapIntensity: .1
  }
}

const redSilk: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg"
  },
  options: {
    color: 0x570b0b,
    envMapIntensity: .1
  }
}

const blueSilk: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg"
  },
  options: {
    color: 0x0f1230,
    envMapIntensity: .1
  }
}

const purpleSilk: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/silk/baseColor.jpg",
    normalMap: "/silk/normal.jpg",
    roughnessMap: "/silk/roughness.jpg",
    metalnessMap: "/silk/metallic.jpg",
    aoMap: "/silk/ambientOcclusion.jpg"
  },
  options: {
    color: 0x241030,
    envMapIntensity: .1
  }
}

const blackVelvet: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg"
  },
  options: {
    color: 0x000000,
    envMapIntensity: .1
  }
}

const whiteVelvet: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg"
  },
  options: {
    color: 0xf7f7f7,
    envMapIntensity: .1
  }
}

const redVelvet: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg"
  },
  options: {
    color: 0x800606,
    envMapIntensity: .1
  }
}

const blueVelvet: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg"
  },
  options: {
    color: 0x10063d,
    envMapIntensity: .1
  }
}

const purpleVelvet: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/velvet/baseColor.jpg",
    normalMap: "/velvet/normal.jpg",
    roughnessMap: "/velvet/roughness.jpg",
    metalnessMap: "/velvet/metallic.jpg",
    aoMap: "/velvet/ambientOcclusion.jpg"
  },
  options: {
    color: 0x3a2845,
    envMapIntensity: .1
  }
}

const blackLeather: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg"
  },
  options: {
    color: 0x000000,
    envMapIntensity: .1
  }
}

const whiteLeather: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg"
  },
  options: {
    color: 0xffffff,
    envMapIntensity: .1
  }
}

const redLeather: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg"
  },
  options: {
    color: 0x961818,
    envMapIntensity: .1
  }
}

const blueLeather: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg"
  },
  options: {
    color: 0x140854,
    envMapIntensity: .1
  }
}

const purpleLeather: MaterialDefinition = {
  materialType: 'standard',
  textures: {
    map: "/leather/baseColor.jpg",
    normalMap: "/leather/normal.jpg",
    roughnessMap: "/leather/roughness.jpg",
    aoMap: "/leather/ambientOcclusion.jpg"
  },
  options: {
    color: 0x5f4370,
    envMapIntensity: .1
  }
}

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
