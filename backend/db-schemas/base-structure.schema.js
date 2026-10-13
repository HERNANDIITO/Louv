import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

// baseStructure: diseños que ofrecemos a los usuarios, diseños base
const baseStructureSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        defaultDesign: {
            // lo que aparecerá en el editor por defecto al seleccionar ese diseño
            material: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material',
            },
            profile: {
                // perfil que aparecerá por defecto en el selector de diseños
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
            },
        },
        profiles: [
            {
                // perfiles de los anillos (court, d-shape, halo, concave, double comfort...)
                profile: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Profile',
                    required: true,
                },
                model: {
                    // modelo 3d si todas las variantes con el mismo perfil comparten el mismo modelo (será lo más habitual salvo piedras incrustadas)
                    type: String,
                },
                volume: {
                    // volumen con el que se calculara el precio segun el material
                    type: mongoose.Schema.Types.Decimal128,
                },
                variants: [
                    // 1 gema, 3 gemas, 5 gemas...
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            auto: true,
                        },
                        name: {
                            type: String,
                            required: true,
                        },
                        image: {
                            type: String,
                            required: true,
                        },
                        extraPrice: {
                            // precio diseño
                            type: mongoose.Schema.Types.Decimal128,
                            required: true,
                        },
                        modelBySize: [
                            // para anillos con gemas incrustadas en las que se quiera poder modificar su tamaño
                            {
                                size: {
                                    type: louvEnums.SETTING_SIZES,
                                    required: true,
                                },
                                model: {
                                    type: String,
                                },
                                volume: {
                                    type: mongoose.Schema.Types.Decimal128,
                                },
                                rotationZ: {
                                    type: mongoose.Schema.Types.Decimal128,
                                    required: true
                                },
                                rotationW: {
                                    type: mongoose.Schema.Types.Decimal128,
                                    required: true
                                }
                            }
                        ],
                        settingsInfo: [
                            // todo sobre los engastes del anillo
                            {
                                gemPosId: {
                                    type: Number,
                                    required: true,
                                },
                                compatibleSettings: [
                                    // engastes compatibles con el anillo
                                    {
                                        setting: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                        },
                                        scalePerSettingSize: [
                                            // factor de escala que se debe aplicar a cada engaste según el tamaño elegido, puede variar según el engaste
                                            {
                                                size: {
                                                    type: louvEnums.SETTING_SIZES,
                                                    required: true,
                                                },
                                                scale: {
                                                    type: mongoose.Schema.Types.Decimal128,
                                                    required: true,
                                                },
                                            },
                                        ],
                                    },
                                ],
                                positionAndRotationPerSettingSize: [
                                    // posicion de los engastes sobre la base según el tamaño elegido, igual para todos los engastes
                                    {
                                        size: {
                                            type: louvEnums.SETTING_SIZES,
                                            required: true,
                                        },
                                        positionX: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        positionY: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        positionZ: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        rotationX: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        rotationY: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        rotationZ: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        },
                                        rotationW: {
                                            type: mongoose.Schema.Types.Decimal128,
                                            required: true,
                                        }
                                        
                                    },
                                ],
                                defaultsettingSize: {
                                    // tamaño por defecto de los engastes al seleccionar el diseño
                                    type: louvEnums.SETTING_SIZES,
                                    required: true,
                                    default: 'one-size',
                                },
                                defaultSettings: [
                                    // al seleccionar el modelo los engastes y gemas que apareceran en el editor por defecto
                                    {
                                        setting: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'Setting',
                                        },
                                        gemstone: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'Gemstone',
                                        },
                                        gemstoneCut: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'Cut',
                                        },
                                        clawNumber: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'Setting.clawNumber',
                                        },
                                        clawType: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'Setting.clawNumber.compatibleCuts.clawType',
                                        },
                                        pattern: [
                                            {
                                                type: mongoose.Schema.Types.ObjectId,
                                                ref: 'Gemstone',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    { strict: true }
);

const BaseStructure = mongoose.model('BaseStructure', baseStructureSchema);

baseStructureSchema.index({ name: 1 });
baseStructureSchema.index({ 'profiles.variants.name': 1 });

export default BaseStructure;
