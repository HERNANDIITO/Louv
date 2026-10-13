import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';
import Setting from './setting.schema.js'; 

const jewelrySchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        creationDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        lastEdition: {
            type: Date,
            required: true,
            default: Date.now,
        },
        timesEdited: {
            type: Number,
            required: true,
            default: 1,
        },
        timeSpent: {
            type: Number,
            required: true,
            default: 0,
        },
        metalPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        gemstonesPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        taxablePrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        currentPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        taxableHistory: [mongoose.Schema.Types.Decimal128],
        priceHistory: [mongoose.Schema.Types.Decimal128],
        shareHashWithPrice: {
            type: String,
        },
        shareHashWithoutPrice: {
            type: String,
        },
        timesHashRenewed: {
            type: Number,
            required: true,
            default: 0,
        },
        hasBeenInCart: {
            type: Boolean,
            required: true,
            default: false,
        },
        snapshot: {
            type: String,
            default: 'solitario_diamante.png',
        },
        composition: {
            baseStructure: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'BaseStructure',
            },
            size: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Size',
            },
            material: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Material',
            },
            materialPurity: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Material.purities.purity',
            },
            profile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BaseStructure.profiles.variants',
            },
            settingsSize: louvEnums.SETTING_SIZES,
            settings: [
                {
                    setting: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Setting'
                    },
                    gemstone: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Gemstone'
                    },
                    gemstoneCut: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Cut'
                    },
                    isSynthetic: {
                        type: Boolean,
                        required: true,
                        default: false,
                    },
                    clawNumber: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    clawType: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    pattern: [{
                        pattern: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Setting.clawNumber.compatibleCuts.availablePatterns",
                            required: true
                        },
                        gemstone: [{
                            type: mongoose.Schema.Types.ObjectId,
                            required: true
                        }],
                        isSynthetic: [{
                            type: Boolean,
                            required: true,
                            default: false
                        }]
                    }]
                    // ratio, east west si se quisiese
                },
            ],
        }, // composition
        box: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Box',
        },
        boxInnerColor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BoxInnerMaterial',
        },
        boxOuterColor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BoxOuterMaterial',
        },
        boxDetailColor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BoxDetailMaterial',
        },
    },
    { strict: true }
);

jewelrySchema.index({ user: 1, creationDate: -1 });
jewelrySchema.index({ 'composition.material': 1 });
jewelrySchema.index({ 'composition.material.purity': 1 });
jewelrySchema.index({
    'composition.baseStructure': 1,
    'composition.profile': 1,
    'compositon.variant': 1,
    settingSize: 1,
});
jewelrySchema.index({ 'composition.size': 1 });
jewelrySchema.index({
    'composition.settings.setting': 1,
    'composition.settings.clawNumber': 1,
    'composition.settings.clawType': 1,
});
jewelrySchema.index({ 'composition.settings.gemstone': 1, 'composition.settings.gemstoneCut': 1 });
jewelrySchema.index({ box: 1 });
jewelrySchema.index({ boxInnerColor: 1 });
jewelrySchema.index({ boxOuterColor: 1 });
jewelrySchema.index({ boxDetailColor: 1 });

jewelrySchema.pre('validate', async function (next) {
    const jewelry = this;

    // Si no se ha tocado la composición, no perdemos tiempo procesando
    if (!jewelry.isModified('composition.settings')) return next();

    try {
        const Setting = mongoose.model('Setting');

        for (let s of jewelry.composition.settings) {
            const settingDoc = await Setting.findById(s.setting);
            if (!settingDoc) continue;

            // 1. Buscamos si el corte actual es compatible con las garras actuales
            let targetClawNumber = settingDoc.clawNumber.find(cn => 
                cn._id.toString() === s.clawNumber?.toString() &&
                cn.compatibleCuts.some(cc => cc.cut.toString() === s.gemstoneCut.toString())
            );

            // 2. Si NO es compatible (AUTO-CORRECCIÓN), buscamos el primer clawNumber de este engaste que sí lo sea
            if (!targetClawNumber) {
                targetClawNumber = settingDoc.clawNumber.find(cn => 
                    cn.compatibleCuts.some(cc => cc.cut.toString() === s.gemstoneCut.toString())
                );
            }

            // 3. Si encontramos una opción compatible...
            if (targetClawNumber) {
                s.clawNumber = targetClawNumber._id; // Actualizamos el ID de garras

                const compatibleCutInfo = targetClawNumber.compatibleCuts.find(
                    cc => cc.cut.toString() === s.gemstoneCut.toString()
                );

                // 4. Corregimos el ClawType (si el actual no es válido para este nuevo escenario)
                const isClawTypeValid = compatibleCutInfo.clawType.some(
                    ct => ct.toString() === s.clawType?.toString()
                );

                if (!isClawTypeValid) {
                    s.clawType = compatibleCutInfo.clawType[0]; // Ponemos el primero por defecto
                }
            } else {
                // Si NI SIQUIERA el engaste entero soporta ese corte, lanzamos error para que el programador lo sepa
                throw new Error(`El engaste ${settingDoc.name} no es compatible con el corte enviado.`);
            }
        }

        // Actualizamos metadatos
        jewelry.lastEdition = new Date();
        if (!jewelry.isNew) jewelry.timesEdited += 1;

        next();
    } catch (error) {
        next(error);
    }
});

const Jewelry = mongoose.model('Jewelry', jewelrySchema, 'jewels');

export default Jewelry;
export { jewelrySchema };
