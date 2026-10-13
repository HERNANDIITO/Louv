import mongoose from 'mongoose';

const cutSchema = new mongoose.Schema(
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
        model: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
        width: {
            // diamante corte excelente de 1ct
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        height: {
            // diamante corte excelente de 1ct
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        depth: {
            // diamante corte excelente de 1ct
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
    },
    { strict: true }
);

const Cut = mongoose.model('Cut', cutSchema);

cutSchema.index({ name: 1 });

export default Cut;
