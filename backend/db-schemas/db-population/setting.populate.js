import mongoose from "mongoose";
import Setting from "../setting.schema.js";
import Cut from "../cut.schema.js";
import Gemstone from "../gemstone.schema.js"

async function populateSettingCollection(deps = {}) {
  try {

    // OBTENER TODOS LOS CORTES 
    const cuts = await Cut.find();
    const cutByName = {};
    for (const c of cuts) cutByName[c.name] = c._id;

    // Función para obtener _id del corte por nombre
    const pickCut = (name) => cutByName[name] || null;

    // OBTENER TODAS LAS GEMAS 
    const gemstones = await Gemstone.find();
    const gemByName = {};
    for (const g of gemstones) gemByName[g.name] = g._id;

    // Función para obtener _id del corte por nombre
    const pickGem = (name) => gemByName[name] || null;

    const settings = [
      {
        name: "Prong",
        type: "prong",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"),
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Princesa"),
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Marquesa"),
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Esmeralda"),
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "4 garras",
                compatibleCuts: [
                    {
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Brillante"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_round_X_1q.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00051198"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("41.1476"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Brillante"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_round_X.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00051198"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("40.3034"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        }]
                    },
                    {
                        cut: pickCut("Princesa"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Princesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_princess.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.000054358"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("18.8125"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Simple en V",
                            cuts: [{
                                cut: pickCut("Princesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_V_princess.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_V_princess.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_V_princess.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "eng_princess_v2.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.000054358"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("11.7264"),
                            extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Princesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_princess.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.000054358"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("17.0734"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        }]
                    },
                    {
                        cut: pickCut("Esmeralda"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Esmeralda"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_emerald.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00048149"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("14.8878"),
                            extraPrice: mongoose.Types.Decimal128.fromString("60.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Esmeralda"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_emerald.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00048149"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("19.1682"),
                            extraPrice: mongoose.Types.Decimal128.fromString("65.00"),
                            availablePatterns: []   
                        }]
                    }
                ].filter(x => x.cut),
            },
            {
                name: "6 garras",
                compatibleCuts: [
                    {
                        cut: pickCut("Marquesa"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Marquesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_marq_6.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00065807"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("19.9499"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        }]
                    }
                ].filter(x => x.cut),
            }
        ]
      },  
      {
        name: "Prong diagonal",
        type: "prong",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"),
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round_+.webp"
                    }
                ]
            },
            { 
                cut: pickCut("Oval Clásico"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round_+.webp"
                    }
                ]
            },
            { 
                cut: pickCut("Oval East-West"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round_+.webp"
                    }
                ]
            },
            { 
                cut: pickCut("Marquesa"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round_+.webp"
                    }
                ]
            },
            { 
                cut: pickCut("Pera"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "prong_round_+.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "prong_round_+.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "4 garras",
                compatibleCuts: [
                    {
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round_+.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Brillante"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_round.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00051198"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("41.1476"),
                            extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Brillante"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_round.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00051198"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("40.3034"),
                            extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                            availablePatterns: []   
                        }]
                    },
                    {
                        cut: pickCut("Oval Clásico"),
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round_+.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [
                                {
                                    cut: pickCut("Oval Clásico"), 
                                    imagePerGem: [
                                        {
                                            gemstone: pickGem("Diamante"),
                                            image: "prong_round_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Rubí"),
                                            image: "prong_round_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Aguamarina"),
                                            image: "prong_round_+.webp"
                                        }
                                    ] 
                                }
                            ].filter(x => x.cut),
                            model: "prong_oval_V_1q.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00032386"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("31.3123"),
                            extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                            availablePatterns: []
                        
                        },
                        {
                            name: "Doble",
                            cuts: [
                                {
                                    cut: pickCut("Oval Clásico"), 
                                    imagePerGem: [
                                        {
                                            gemstone: pickGem("Diamante"),
                                            image: "double_prong_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Rubí"),
                                            image: "double_prong_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Aguamarina"),
                                            image: "double_prong_+.webp"
                                        }
                                    ] 
                                }
                            ].filter(x => x.cut),
                            model: "double_prong_oval.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00032386"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("32.1914"),
                            extraPrice: mongoose.Types.Decimal128.fromString("60.00"),
                            availablePatterns: []
                        
                        }]
                    },
                    {
                        cut: pickCut("Oval East-West"),
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round_+.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [
                                {
                                    cut: pickCut("Oval East-West"), 
                                    imagePerGem: [
                                        {
                                            gemstone: pickGem("Diamante"),
                                            image: "prong_round_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Rubí"),
                                            image: "prong_round_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Aguamarina"),
                                            image: "prong_round_+.webp"
                                        }
                                    ] 
                                }
                            ].filter(x => x.cut),
                            model: "prong_oval_H_1q.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00032386"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("31.3123"),
                            extraPrice: mongoose.Types.Decimal128.fromString("65.00"),
                            availablePatterns: []
                        
                        },
                        {
                            name: "Doble",
                            cuts: [
                                {
                                    cut: pickCut("Oval East-West"), 
                                    imagePerGem: [
                                        {
                                            gemstone: pickGem("Diamante"),
                                            image: "double_prong_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Rubí"),
                                            image: "double_prong_+.webp"
                                        },
                                        {
                                            gemstone: pickGem("Aguamarina"),
                                            image: "double_prong_+.webp"
                                        }
                                    ] 
                                }
                            ].filter(x => x.cut),
                            model: "double_prong_oval_ew.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00032386"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("32.1914"),
                            extraPrice: mongoose.Types.Decimal128.fromString("60.00"),
                            availablePatterns: []
                        
                        }]
                    },
                    {
                        cut: pickCut("Marquesa"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round_+.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Marquesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_marq_4.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00065807"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("15.6454"),
                            extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Marquesa"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_marq.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00065807"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("16.1894"),
                            extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                            availablePatterns: []   
                        }]
                    }
                ].filter(x => x.cut),
            },
            {
                name: "3 garras",
                compatibleCuts: [
                    {
                        cut: pickCut("Pera"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round_+.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round_+.webp"
                            }
                        ],
                        clawType: [{
                            name: "Simple",
                            cuts: [{
                                cut: pickCut("Pera"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "prong_round_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "prong_round_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "prong_pera.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00052877"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("13.3056"),
                            extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                            availablePatterns: []   
                        },
                        {
                            name: "Doble",
                            cuts: [{
                                cut: pickCut("Pera"), 
                                imagePerGem: [
                                    {
                                        gemstone: pickGem("Diamante"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Rubí"),
                                        image: "double_prong_+.webp"
                                    },
                                    {
                                        gemstone: pickGem("Aguamarina"),
                                        image: "double_prong_+.webp"
                                    }
                                ] }
                            ].filter(x => x.cut),
                            model: "double_prong_pear.gltf",
                            gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemPositionY: mongoose.Types.Decimal128.fromString("0.00052877"),
                            gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                            gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                            volume: mongoose.Types.Decimal128.fromString("13.3349"),
                            extraPrice: mongoose.Types.Decimal128.fromString("60.00"),
                            availablePatterns: []   
                        }]
                    }
                ].filter(x => x.cut),
            }]
      },
      {
        name: "Halo",
        type: "halo",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "crown.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "crown.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "crown.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "4 garras",
                compatibleCuts: [
                    { 
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "crown.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "crown.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "crown.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Brillante"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "crown.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "crown.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "crown.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "engaste_crown_round.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00140509"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("131.2227"),
                                extraPrice: mongoose.Types.Decimal128.fromString("120.00"),
                                availablePatterns: [{
                                    patternName: "Unicolor",
                                    patternImage: "haloUnicolor.svg", 
                                    numberOfGroups: 1,
                                    gemstones: [// Round.025
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09645358"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.25849918"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.02594953"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96083373"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.026
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00212092"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.08752104"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.49744087"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.05053039"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86159116"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.027
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.02594936"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.96083421"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.09645363"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.25849757"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193618"),
                                                groupNumber: 0
                                            },
                                            // Round.028
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251466"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.05053033"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.86159158"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.08752108"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.4974401"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.029
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00419647"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.07071902"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.70356154"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.07071902"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70356148"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.030
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09645358"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.25849918"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.02594953"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96083373"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193618"),
                                                groupNumber: 0
                                            },
                                            // Round.031
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.08752099"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.49744165"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.05053048"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86159074"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.032
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0792606"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.91992021"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.06078263"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.37917027"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193582"),
                                                groupNumber: 0
                                            },
                                            // Round.033
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.05053032"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.86159158"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.08752108"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.4974401"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193624"),
                                                groupNumber: 0
                                            },
                                            // Round.034
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00419646"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.07071839"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.7035616"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.07071843"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70356154"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.035
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00414738"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.99509978"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.09887601"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.036
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00414738"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09887601"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.99509978"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            }]
                                },
                                {
                                    patternName: "Bicolor",
                                    patternImage: "haloBicolor.svg", 
                                    numberOfGroups: 2,
                                    gemstones: [// Round.025
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09645358"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.25849918"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.02594953"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96083373"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.026
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00212092"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.08752104"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.49744087"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.05053039"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86159116"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 1
                                            },
                                            // Round.027
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.02594936"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.96083421"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.09645363"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.25849757"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193618"),
                                                groupNumber: 0
                                            },
                                            // Round.028
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251466"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.05053033"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.86159158"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.08752108"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.4974401"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 1
                                            },
                                            // Round.029
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00419647"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.07071902"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.70356154"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.07071902"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70356148"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.030
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09645358"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.25849918"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.02594953"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96083373"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193618"),
                                                groupNumber: 0
                                            },
                                            // Round.031
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.08752099"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.49744165"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.05053048"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86159074"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 1
                                            },
                                            // Round.032
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00210283"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00362521"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0792606"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.91992021"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.06078263"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.37917027"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193582"),
                                                groupNumber: 0
                                            },
                                            // Round.033
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00367355"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00212091"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.05053032"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.86159158"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.08752108"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.4974401"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193624"),
                                                groupNumber: 1
                                            },
                                            // Round.034
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00419646"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.07071839"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.7035616"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.07071843"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70356154"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 0
                                            },
                                            // Round.035
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00414738"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.99509978"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.09887601"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 1
                                            },
                                            // Round.036
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00251465"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00414738"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.09887601"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.99509978"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.33193621"),
                                                groupNumber: 1
                                            }]
                                }]
                            }
                        ]
                    }
                ].filter(x => x.cut),
            }
        ]
      },
      {
        name: "Bisel",
        type: "bezel",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Oval Clásico"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Oval East-West"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Marquesa"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Pera"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Esmeralda"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            },
            {
                cut: pickCut("Princesa"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "sin garras",
                compatibleCuts: [
                    { 
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Brillante"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_round_1q.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00133934"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("39.4004"),
                                extraPrice: mongoose.Types.Decimal128.fromString("40.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Oval Clásico"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Oval Clásico"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_oval_V_1q.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00126382"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("34.2131"),
                                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Oval East-West"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Oval East-West"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_oval_H_1q.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00126382"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("34.2131"),
                                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Marquesa"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Marquesa"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_marq.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00197562"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("39.412"),
                                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Pera"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Pera"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_pera.gltf", //ESTE HAY QUE CORREGIR EL MODELO
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00197562"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("36.3915"),
                                extraPrice: mongoose.Types.Decimal128.fromString("45.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Esmeralda"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Esmeralda"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_emerald.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00139847"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("36.9002"),
                                extraPrice: mongoose.Types.Decimal128.fromString("55.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    },
                    { 
                        cut: pickCut("Princesa"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "bezel_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "bezel_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Princesa"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_princess.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("0.00086241"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("39.8134"),
                                extraPrice: mongoose.Types.Decimal128.fromString("50.00"),
                                availablePatterns: []
                                
                            }
                        ]
                    }
                ].filter(x => x.cut),
            }
        ]
      },
      {
        name: "Incrustado",
        type: "embeded",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "sin garras",
                compatibleCuts: [
                    { 
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Brillante"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_emerald.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("-1000.0"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("0"),
                                extraPrice: mongoose.Types.Decimal128.fromString("0.00"),
                                availablePatterns: [{
                                        patternName: "Unicolor",
                                        patternImage: "vinculoUnicolor.svg", 
                                        numberOfGroups: 1,
                                        gemstones: [
                                            // Round.038
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877635"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.040
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877866"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.041
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00890108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.042
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00885422"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.15876439"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.043
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00741306"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.16013891"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.044
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00840191"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.17811239"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.045
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00778601"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.14423069"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.046
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00844092"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.14363101"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.047
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00773765"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.2441866"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96972829"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.048
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.0069804"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.31638119"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },
                                            // Round.050
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00467108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.052
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00584181"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.40941516"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91234821"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.053
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.57276779"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.054
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.66373748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796557"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.055
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.7080487"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70616359"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.057
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794241"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.68563825"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.058
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00488934"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.059
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00600209"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.060
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.57276785"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.061
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.66373801"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796599"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.062
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.70804852"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.70616376"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.063
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794235"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.68563831"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },
                                            // Round.086
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122365"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.087
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122134"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.088
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99109892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.089
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99114578"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.15876438"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.090
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99258694"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.16013889"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.091
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99159809"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.17811237"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.092
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99221399"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.14423066"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.093
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99155908"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.14363106"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.094
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99226235"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.96972823"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.24418664"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.095
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.9930196"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.31638122"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.096
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99532892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.097
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99415819"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91234815"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.40941519"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.098
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.57276785"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.099
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99511066"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.100
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99399791"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.101
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.13680713"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776396"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.57276779"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            }
                                        ]
                                },
                                {
                                        patternName: "Bicolor",
                                        patternImage: "vinculoBicolor.svg", 
                                        numberOfGroups: 2,
                                        gemstones: [
                                            // Round.038
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877635"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.040
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877866"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.041
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00890108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.042
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00885422"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.15876439"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.043
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00741306"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.16013891"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.044
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00840191"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.17811239"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.045
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00778601"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.14423069"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.046
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00844092"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.14363101"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.047
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00773765"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.2441866"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96972829"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.048
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.0069804"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.31638119"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },
                                            // Round.050
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00467108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.052
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00584181"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.40941516"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91234821"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.053
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.57276779"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.054
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.66373748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796557"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.055
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.7080487"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70616359"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.057
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794241"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.68563825"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.058
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00488934"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.059
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00600209"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.060
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.57276785"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.061
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.66373801"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796599"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.062
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.70804852"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.70616376"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.063
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794235"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.68563831"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },
                                            // Round.086
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122365"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.087
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122134"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.088
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99109892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.089
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99114578"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.15876438"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.090
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99258694"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.16013889"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.091
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99159809"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.17811237"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.092
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99221399"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.14423066"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.093
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99155908"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.14363106"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.094
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99226235"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.96972823"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.24418664"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.095
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.9930196"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.31638122"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 0
                                            },

                                            // Round.096
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99532892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.097
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99415819"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91234815"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.40941519"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.098
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.57276785"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.099
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99511066"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            },

                                            // Round.100
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99399791"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 1
                                            },

                                            // Round.101
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.13680713"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776396"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.57276779"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 0
                                            }
                                        ]
                                },
                                {
                                        patternName: "Tricolor",
                                        patternImage: "vinculoTricolor.svg", 
                                        numberOfGroups: 3,
                                        gemstones: [
                                            // Round.038
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877635"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.040
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00877866"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.041
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00890108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.042
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00885422"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.15876439"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.043
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00741306"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.16013891"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.044
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00840191"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.17811239"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.045
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00778601"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.14423069"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.046
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00844092"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.14363101"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.047
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00773765"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.2441866"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.96972829"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.048
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.0069804"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.31638119"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },
                                            // Round.050
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00467108"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.052
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00584181"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.40941516"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91234821"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.053
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.57276779"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.054
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.66373748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796557"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.055
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.7080487"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.70616359"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.057
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794241"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.68563825"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.058
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00488934"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.059
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00600209"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.060
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00285369"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.57276785"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.13680711"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.061
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0003096"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00100042"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00869799"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.66373801"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.74796599"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.062
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00059356"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99973846"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00901968"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.70804852"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.70616376"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.063
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00068342"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99987523"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00937464"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.72794235"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.68563831"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },
                                            // Round.086
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00047603"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122365"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00024622"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.087
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00048731"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99122134"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00141057"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.99743211"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.07161822"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.088
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00086304"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99109892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0010286"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("1"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.089
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00134048"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99114578"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00078498"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98731649"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.15876438"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.090
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00011863"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99258694"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00521825"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98709446"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.16013889"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.091
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.001169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99159809"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00310833"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98401016"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.17811237"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.092
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00043544"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99221399"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00451454"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.98954409"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.14423066"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.093
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00142694"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99155908"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00303772"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.9896313"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.14363106"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.094
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00075466"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99226235"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00405925"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.96972823"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.24418664"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.095
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00087725"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.9930196"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00527759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.94863212"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.31638122"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.23003049"),
                                                groupNumber: 1
                                            },

                                            // Round.096
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00063429"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99532892"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.007623"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.097
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00078049"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99415819"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0065773"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91234815"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.40941519"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.098
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00146307"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.13680711"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776397"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("-0.57276785"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.099
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00032929"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99511066"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00747568"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.88063896"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.47378796"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            },

                                            // Round.100
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.00099229"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99399791"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00640759"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.91805381"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.39645579"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.30859551"),
                                                groupNumber: 0
                                            },

                                            // Round.101
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("-0.00103169"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("999.99714631"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00851692"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.78610784"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("-0.13680713"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("-0.18776396"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.57276779"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.15415466"),
                                                groupNumber: 2
                                            }
                                        ]
                                }]
                                
                            }
                        ]
                    }
                ].filter(x => x.cut),
            }
        ]
      },
      { 
        name: "Incrustado dos",
        type: "embeded",
        compatibleCuts: [
            {
                cut: pickCut("Brillante"), 
                imagePerGem: [
                    {
                        gemstone: pickGem("Diamante"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Rubí"),
                        image: "bezel_round.webp"
                    },
                    {
                        gemstone: pickGem("Aguamarina"),
                        image: "bezel_round.webp"
                    }
                ]
            }
        ].filter(x => x.cut),
        clawNumber: [
            {
                name: "sin garras",
                compatibleCuts: [
                    { 
                        cut: pickCut("Brillante"), 
                        imagePerGem: [
                            {
                                gemstone: pickGem("Diamante"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Rubí"),
                                image: "prong_round.webp"
                            },
                            {
                                gemstone: pickGem("Aguamarina"),
                                image: "prong_round.webp"
                            }
                        ],
                        clawType: [
                            {
                                name: "Simple",
                                cuts: [
                                    { 
                                        cut: pickCut("Brillante"), 
                                        imagePerGem: [
                                            {
                                                gemstone: pickGem("Diamante"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Rubí"),
                                                image: "bezel_round.webp"
                                            },
                                            {
                                                gemstone: pickGem("Aguamarina"),
                                                image: "bezel_round.webp"
                                            }
                                        ] 
                                    }
                                ].filter(x => x.cut),
                                model: "bezel_emerald.gltf",
                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemPositionY: mongoose.Types.Decimal128.fromString("-10000.0"),
                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationX: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                gemRotationW: mongoose.Types.Decimal128.fromString("1.0"),
                                volume: mongoose.Types.Decimal128.fromString("0"),
                                extraPrice: mongoose.Types.Decimal128.fromString("00.00"),
                                availablePatterns: [{
                                        patternName: "Unicolor",
                                        patternImage: "auroraUnicolor.svg", 
                                        numberOfGroups: 1,
                                        gemstones: [
                                            // Round-con-engaste.002
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00774121"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00376394"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.22097905"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.97527856"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.003
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00709317"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00487354"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.29492083"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9555217"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.004
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00628674"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00587095"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.36749822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.93002421"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.005
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00534868"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00672346"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.43869218"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.89863741"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.006
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00429291"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0074438"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.49720094"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86763543"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.007
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00313849"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00800398"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.56210124"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.82706845"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.008
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00191477"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00838599"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.62401396"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.7814132"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.009
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00066006"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00856608"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.68287748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.73053294"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.010
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.008206"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00257328"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.14792503"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98899859"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.011
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00774121"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00376394"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.22097903"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.97527856"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.012
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00709317"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00487354"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.29492086"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9555217"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.013
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00628674"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00587095"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.36749822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.93002421"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.014
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00534868"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00672346"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.43869218"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.89863741"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.015
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00429291"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0074438"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.49720094"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86763543"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.016
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00313849"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00800398"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.56210124"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.82706845"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.017
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00191477"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00838599"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.62401396"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.7814132"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.018
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00066006"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00856608"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.68287748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.73053294"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.019
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.008206"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00257328"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.14792502"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98899859"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            }
                                        ]
                                },
                                {
                                        patternName: "Bicolor",
                                        patternImage: "auroraBicolor.svg", 
                                        numberOfGroups: 2,
                                        gemstones: [
                                            // Round-con-engaste.002
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00774121"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00376394"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.22097905"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.97527856"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.003
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00709317"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00487354"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.29492083"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9555217"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.004
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00628674"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00587095"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.36749822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.93002421"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.005
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00534868"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00672346"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.43869218"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.89863741"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.006
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00429291"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.0074438"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.49720094"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86763543"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.007
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00313849"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00800398"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.56210124"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.82706845"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.008
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00191477"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00838599"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.62401396"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.7814132"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.009
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00066006"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00856608"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.68287748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.73053294"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.010
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.008206"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("-0.00257328"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("-0.14792503"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98899859"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.011
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00774121"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00376394"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.22097903"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.97527856"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.012
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00709317"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00487354"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.29492086"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.9555217"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.013
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00628674"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00587095"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.36749822"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.93002421"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.014
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00534868"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00672346"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.43869218"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.89863741"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.015
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00429291"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.0074438"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.49720094"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.86763543"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.016
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00313849"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00800398"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.56210124"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.82706845"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.017
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00191477"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00838599"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.62401396"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.7814132"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 1
                                            },
                                            // Round-con-engaste.018
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.00066006"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00856608"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.68287748"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.73053294"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            },
                                            // Round-con-engaste.019
                                            {
                                                gemPositionX: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemPositionY: mongoose.Types.Decimal128.fromString("1000.008206"),
                                                gemPositionZ: mongoose.Types.Decimal128.fromString("0.00257328"),
                                                gemRotationX: mongoose.Types.Decimal128.fromString("0.14792502"),
                                                gemRotationY: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationZ: mongoose.Types.Decimal128.fromString("0.0"),
                                                gemRotationW: mongoose.Types.Decimal128.fromString("0.98899859"),
                                                scaleFactor: mongoose.Types.Decimal128.fromString("0.20722599"),
                                                groupNumber: 0
                                            }
                                        ]
                                }]
                                
                            }
                        ]
                    }
                ].filter(x => x.cut),
            }
        ]
    }

    ];

    const created = [];
    for (const s of settings) {

      // Copia limpia
      const doc = { ...s };

      // Limpieza de arrays
      if (doc.compatibleCuts) {
        doc.compatibleCuts = doc.compatibleCuts.filter(Boolean);
      }

      if (doc.clawNumber) {
        doc.clawNumber = doc.clawNumber.map(cn => {
          if (cn.compatibleCuts) cn.compatibleCuts = cn.compatibleCuts.filter(Boolean);
          if (cn.clawType) {
            cn.clawType = cn.clawType.map(ct => {
              if (ct.cuts) ct.cuts = ct.cuts.filter(Boolean);
              return ct;
            });
          }
          return cn;
        });
      }

      const existing = await Setting.findOne({ name: doc.name, type: doc.type });

      if (existing) {
        continue;
      }

      const setting = new Setting(doc);
      await setting.save();

      created.push(setting);
    }

    return { Setting: created };
  } catch (error) {}
}

export default populateSettingCollection;
