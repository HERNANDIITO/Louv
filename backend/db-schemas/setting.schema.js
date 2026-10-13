import mongoose, { mongo } from "mongoose";
import louvEnums from "./enums.schema.js";

const settingSchema = new mongoose.Schema({ 
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        auto: true  
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: louvEnums.SETTING_TYPE,
        required: true
    },
    compatibleCuts: [{ // todos los cortes con los que es compatible cierto engaste y una image para cada uno según la gema
        cut: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Cut'
        },
        imagePerGem: [{
            gemstone: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Gemstone",
                required: true
            },
            image: { // imagen para la sección Tipo de engaste
                type: String,
                required: true
            }
        }]
    }],
    clawNumber: [{ //variantes
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            auto: true  
        },
        name: {
            type: String,
            required: true
        },
        compatibleCuts: [
            { 
                cut: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Cut'
                },
                imagePerGem: [{
                    gemstone: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Gemstone",
                        required: true
                    },
                    image: { // imagen para la sección Número de garras
                        type: String,
                        required: true
                    },
                }],
                clawType: [{
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        auto: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    cuts: [{
                        cut: { 
                            type: mongoose.Schema.Types.ObjectId, 
                            ref: 'Cut'
                        },
                        imagePerGem: [{
                            gemstone: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Gemstone",
                                required: true
                            },
                            image: { // imagen para la sección Tipo de garras
                                type: String,
                                required: true
                            }
                        }],
                    }],
                    model: {
                        type: String,
                        required: true
                    },
                    gemPositionX: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemPositionY: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemPositionZ: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemRotationX: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemRotationY: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemRotationZ: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    gemRotationW: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true
                    },
                    volume: {
                        type: mongoose.Schema.Types.Decimal128,
                        required: true  
                    },
                    extraPrice: { // por diseño, gemas lo que sea
                        type: mongoose.Schema.Types.Decimal128,
                        required: true 
                    },
                    // posibles gemas de acento que tenga el modelo
                    availablePatterns: [{
                        _id: { 
                            type: mongoose.Schema.Types.ObjectId,
                            auto: true  
                        },
                        patternName: {
                            type: mongoose.Schema.Types.String,
                            required: true 
                        },
                        patternImage: {
                            type: mongoose.Schema.Types.String,
                            required: true 
                        }, 
                        numberOfGroups: {
                            type: mongoose.Schema.Types.Number,
                            required: true 
                        },
                        gemstones: [{
                            gemPositionX: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemPositionY: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemPositionZ: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemRotationX: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemRotationY: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemRotationZ: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            gemRotationW: {
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            scaleFactor: { // escala con la que se han puesto en el diseño
                                type: mongoose.Schema.Types.Decimal128,
                                required: true
                            },
                            groupNumber: {
                                type: mongoose.Schema.Types.Number,
                                required: true 
                            }
                        }]
                    }]
                }]
            }
        ],
    }]
});

const Setting = mongoose.model("Setting", settingSchema);

settingSchema.index({ name: 1 });

export default Setting;