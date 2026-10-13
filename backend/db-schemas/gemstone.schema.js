import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const gemstoneSchema = new mongoose.Schema(
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
        },
        image: {
            type: String,
            required: true
        },
        imagePerCut: [
            {
                // imagen de la gema en cada corte posible
                cut: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Cut',
                },
                image: {
                    type: String,
                    required: true,
                },
            },
        ],
        meaning: {
            type: String,
        },
        zodiac: {
            type: [String],
            enum: louvEnums.ZODIAC_SIGNS,
        },
        recommendedMaterials: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Material',
        },
        recommendedCuts: {
            // son solo recomendaciones, pero el usuario puede tallar todas las gemas como quiera
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Cut',
        },
        color: {
            type: [String],
            enum: louvEnums.GEMSTONE_COLORS,
        },
        texture: {
            type: String,
            required: true,
        },
        hardness: {
            type: mongoose.Schema.Types.Double,
            required: true,
        },
        hasSynthetic: {
            type: Boolean,
            required: true,
            default: false,
        },
        origin: {
            type: String,
            required: true,
        },
        qualities: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                caratRangeMin: {
                    type: Number,
                    required: true,
                },
                caratRangeMax: {
                    type: Number,
                    required: true,
                },
                minScaleFactor: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true,
                },
                maxScaleFactor: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true,
                },
                pricePerCaratNatural: {
                    type: mongoose.Schema.Types.Decimal128,
                },
                pricePerCaratSynthetic: {
                    type: mongoose.Schema.Types.Decimal128,
                },
            },
        ],
    },
    { strict: true }
);

const Gemstone = mongoose.model('Gemstone', gemstoneSchema);

gemstoneSchema.index({ name: 1 });
gemstoneSchema.index({ zodiac: 1 });
gemstoneSchema.index({ color: 1 });

export default Gemstone;
