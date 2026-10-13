import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const materialSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        material: {
            type: String,
            enum: louvEnums.MATERIALS,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        meaning: {
            type: String,
        },
        zodiac: {
            type: [String],
            enum: louvEnums.ZODIAC_SIGNS,
        },
        recommendedGems: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Gemstone',
        },
        purities: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                class: {
                    type: String,
                    required: true,
                    unique: true,
                },
                purity: {
                    type: String,
                    enum: louvEnums.PURITIES,
                    required: true,
                },
                pricePermm3: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true,
                },
                allegies: {
                    type: Boolean,
                    required: true,
                    default: true,
                },
                allergens: {
                    type: [String],
                    enum: louvEnums.ALLERGENS,
                },
                composition: {
                    type: String,
                    required: true,
                },
                // image y texture podrían ir cambiando segun acabado (pulido, mate, cepillado, golpeado...) por ahora solo pulido
                image: {
                    type: String,
                    required: true,
                },
                texture: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
                meaning: {
                    type: String,
                },
            },
        ],
    },
    { strict: true }
);

const Material = mongoose.model('Material', materialSchema);

materialSchema.index({ material: 1 });
materialSchema.index({ name: 1 });
materialSchema.index({ zodiac: 1 });

export default Material;
