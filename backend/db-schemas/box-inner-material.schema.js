import mongoose from 'mongoose';

const boxInnerMaterialSchema = new mongoose.Schema(
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
        texture: {
            type: String,
        },
    },
    { strict: true }
);

boxInnerMaterialSchema.index({ name: 1 });

const boxInnerMaterial = mongoose.model('BoxInnerMaterial', boxInnerMaterialSchema);

export default boxInnerMaterial;
