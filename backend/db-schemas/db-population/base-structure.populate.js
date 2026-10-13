
import mongoose from "mongoose";

import BaseStructure from "../base-structure.schema.js";
import Profile from "../profile.schema.js";
import Material from "../material.schema.js";
import Cut from "../cut.schema.js";
import Setting from "../setting.schema.js";
import Gemstone from "../gemstone.schema.js";


async function populateBaseStructureCollection(deps = {}) {
  try {

    const placeholderImage = "placeholder.image.png"; // public/images
    const placeholderModel = "placeholder.glb"; // public/models

    /* ----------------------------- CARGA DE DATOS ----------------------------- */

    //log("Cargando perfiles...");
    const profiles = deps.Profile && deps.Profile.length ? deps.Profile : await Profile.find();
    const profileByName = {};
    for (const p of profiles) profileByName[p.name] = p._id;

    const materials = deps.Material && deps.Material.length ? deps.Material : await Material.find();
    const matByName = {};
    for (const m of materials) matByName[m.name] = m._id;

    const cuts = deps.Cut && deps.Cut.length ? deps.Cut : await Cut.find();
    const cutByName = {};
    for (const c of cuts) cutByName[c.name] = c._id;

    const settings = deps.Setting && deps.Setting.length ? deps.Setting.map(s => s.toObject()) : await Setting.find().lean();
    const settingByName = {};
    for (const s of settings) settingByName[s.name] = s._id;

    const gems = deps.Gemstone && deps.Gemstone.length ? deps.Gemstone : await Gemstone.find();
    const gemByName = {};
    for (const g of gems) gemByName[g.name] = g._id;

    /* ------------------------- FUNCIONES PICK + LOGS -------------------------- */

    const pickProfile = (name) => {
      const id = profileByName[name] || Object.values(profileByName)[0] || null;
      return id;
    };

    const pickMat = (name) => {
      const id = matByName[name] || Object.values(matByName)[0] || null;
      return id;
    };

    const pickCut = (name) => {
      const id = cutByName[name] || null;
      return id;
    };

    const pickSetting = (name) => {
      const id = settingByName[name] || null;
      return id;
    };

    const pickGem = (name) => {
      const id = gemByName[name] || null;
      return id;
    };

    /* ------------------------- FUNCIONES CLAWS + LOGS ------------------------- */

    const getClawNumberId = (settingName, clawNumberName) => {
        const setting  = settings.find(x => x.name === settingName);
        
        if (!setting ) { 
            return null; 
        }
        
        const clawNumber = setting.clawNumber?.find(
            cn => cn.name === clawNumberName
        );
        if (!clawNumber) return null;

        return clawNumber._id;
    };

    const getClawTypeId = (settingName, clawNumberName, clawTypeName) => {
        const setting = settings.find(s => s.name === settingName);
        if (!setting) return null;

        const clawNumber = setting.clawNumber?.find(
            cn => cn.name === clawNumberName
        );
        if (!clawNumber) return null;

        // compatibleCuts es un array
        for (const cut of clawNumber.compatibleCuts ?? []) {
            const clawType = cut.clawType?.find(
            ct => ct.name.toLowerCase() === clawTypeName.toLowerCase()
            );
            if (clawType) return clawType._id;
        }

        return null;
    };


    /* ---------------------- DEFINICIÓN DE ESTRUCTURAS ------------------------- */

    const baseStructures = [
      {
        name: "Clásico",
        description: "Diseño clásico que puede incorporar de una a 3 gemas.",
        defaultDesign: {
          material: pickMat("Oro amarillo"),
          profile: pickProfile("Media caña")
        },
        profiles: [
          {
            profile: pickProfile("Media caña"),
            model: "D-shape.gltf",
            volume: mongoose.Types.Decimal128.fromString("96.3056"),
            variants: [
              {
                name: "sin gemas",
                image: "D-basic.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("15.00"),
                modelBySize: [],
                settingsInfo: []
              },  
              {
                name: "1 gema",
                image: "D-una_gema.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("30.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Halo"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.1") }
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "small",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "medium",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "big",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "medium",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              },
              {
                name: "3 gemas",
                image: "D-tres_gemas.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA IZQUIERDA??
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00834066"),
                        positionZ: mongoose.Types.Decimal128.fromString("-0.00416158"),
                        rotationX: mongoose.Types.Decimal128.fromString("-0.2062614"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97849691")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 2,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA CENTRAL
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00929954"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 3,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA DERECHA
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00834066"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.00416158"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.23548476"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97187805")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              }
            ]
          },
          {
            profile: pickProfile("Redondo"),
            model: "round-shape.gltf",
            volume: mongoose.Types.Decimal128.fromString("86.4898"),
            variants: [
              {
                name: "sin gemas",
                image: "basic1.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("12.00"),
                modelBySize: [],
                settingsInfo: []
              },  
              {
                name: "1 gema",
                image: "una-gema.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("28.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Halo"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.1") }
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.1") }
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "small",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "medium",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "big",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "medium",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              },
              {
                name: "3 gemas",
                image: "tres-gemas.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("42.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00862179"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.00438747"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.2062614"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97849691"),
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 2,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 3,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00862179"),
                        positionZ: mongoose.Types.Decimal128.fromString("-0.00438747"),
                        rotationX: mongoose.Types.Decimal128.fromString("-0.2062614"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97849691"),
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong", "4 garras"),
                        clawType: getClawTypeId("Prong", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              }
            ]
          },
          {
            profile: pickProfile("Liso"),
            model: "flat-shape.gltf",
            volume: mongoose.Types.Decimal128.fromString("113.4365"),
            variants: [
              {
                name: "sin gemas",
                image: "D-basic.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("10.00"),
                modelBySize: [],
                settingsInfo: []
              },  
              {
                name: "1 gema",
                image: "D-una_gema.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("30.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                        {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.2") }
                        ]
                      },
                      {
                        setting: pickSetting("Halo"),
                        scalePerSettingSize: [
                          { size: "small", scale: mongoose.Types.Decimal128.fromString("0.8") },
                          { size: "medium", scale: mongoose.Types.Decimal128.fromString("1.0") },
                          { size: "big", scale: mongoose.Types.Decimal128.fromString("1.1") }
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [
                      {
                        size: "small",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "medium",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      },
                      {
                        size: "big",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00923921"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "medium",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              },
              {
                name: "3 gemas",
                image: "D-tres_gemas.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA IZQUIERDA??
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00834066"),
                        positionZ: mongoose.Types.Decimal128.fromString("-0.00416158"),
                        rotationX: mongoose.Types.Decimal128.fromString("-0.2062614"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97849691")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 2,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA CENTRAL
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 3,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("0.8") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA DERECHA
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00834066"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.00416158"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.23548476"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("0.97187805")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Ondulado",
        description: "Diseño sencillo con forma ondulada irregular.",
        defaultDesign: {
          material: pickMat("Platino"),
          profile: pickProfile("Liso")
        },
        profiles: [
          {
            profile: pickProfile("Liso"),
            model: "bent-shape.gltf",
            volume: mongoose.Types.Decimal128.fromString("66.1014"),
            variants: [
              {
                name: "sin gemas",
                image: "ondulado.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("18.00"),
                modelBySize: [],
                settingsInfo: []
              }
            ]
          }
        ]
      },
      {
        name: "Bypass",
        description: "Diseño con estructura abierta que permite una ligera adaptabilidad y destaca por su asimetría equilibrada.",
        defaultDesign: {
          material: pickMat("Oro Amarillo"),
          profile: pickProfile("Liso")
        },
        profiles: [
          {
            profile: pickProfile("Liso"),
            model: "open-shape.gltf",
            volume: mongoose.Types.Decimal128.fromString("77.1386"),
            variants: [
              {
                name: "sin gemas",
                image: "open.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("30.00"),
                modelBySize: [],
                settingsInfo: []
              }
            ]
          }
        ]
      },
      {
        name: "Aurora",
        description: "Elegante anillo con gema central, acompañado de delicadas gemas en la base que realzan su brillo.",
        defaultDesign: {
          material: pickMat("Oro Amarillo"),
          profile: pickProfile("Media caña")
        },
        profiles: [
          {
            profile: pickProfile("Media caña"),
            model: "D-shape-incrustado.gltf",
            volume: mongoose.Types.Decimal128.fromString("87.3677"),
            variants: [
              {
                name: "1 gema incrustado",
                image: "incrustado-con-central.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Prong"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                      {
                        setting: pickSetting("Bisel"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ //GEMA CENTRAL
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("0.00946665"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0"),
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Prong diagonal"),
                        gemstone: pickGem("Diamante"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
                        clawType: getClawTypeId("Prong diagonal", "4 garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  },
                  {
                    gemPosId: 2,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Incrustado dos"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      }
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ 
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("-1000.0"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Incrustado dos"),
                        gemstone: pickGem("None"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Incrustado dos", "sin garras"),
                        clawType: getClawTypeId("Incrustado dos", "sin garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Vínculo",
        description: "Anillo de doble banda entrelazada con gemas de diferentes tamaños que crean un juego de brillo único.",
        defaultDesign: {
          material: pickMat("Oro Amarillo"),
          profile: pickProfile("Redondo")
        },
        profiles: [
          {
            profile: pickProfile("Redondo"),
            model: "double-ring-round-version.gltf",
            volume: mongoose.Types.Decimal128.fromString("104.9985"),
            variants: [
              {
                name: "Incrustado múltiple",
                image: "doble-diamantitos3.webp",
                extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                modelBySize: [],
                settingsInfo: [
                  {
                    gemPosId: 1,
                    compatibleSettings: [
                      {
                        setting: pickSetting("Incrustado"),
                        scalePerSettingSize: [
                          { size: "one-size", scale: mongoose.Types.Decimal128.fromString("1.0") },
                        ]
                      },
                    ].filter(x => x.setting),
                    positionAndRotationPerSettingSize: [ 
                      {
                        size: "one-size",
                        positionX: mongoose.Types.Decimal128.fromString("0.0"),
                        positionY: mongoose.Types.Decimal128.fromString("-1000.0"),
                        positionZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationX: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationY: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                        rotationW: mongoose.Types.Decimal128.fromString("1.0")
                      }
                    ],
                    defaultsettingSize: "one-size",
                    defaultSettings: [
                      {
                        setting: pickSetting("Incrustado"),
                        gemstone: pickGem("None"),
                        gemstoneCut: pickCut("Brillante"),
                        clawNumber: getClawNumberId("Incrustado", "sin garras"),
                        clawType: getClawTypeId("Incrustado", "sin garras", "Simple"),
                      }
                    ].filter(x => x.setting || x.gemstone)
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    /* ------------------------ PROCESAMIENTO DE DOCUMENTOS --------------------- */

    const created = [];

    for (const bs of baseStructures) {

      const existing = await BaseStructure.findOne({ name: bs.name });
      if (existing) {
        continue;
      }

      const baseStructure = new BaseStructure(bs);
      await baseStructure.save();

      created.push(baseStructure);
    }

    return { BaseStructure: created };

  } catch (error) {}
}

export default populateBaseStructureCollection;
