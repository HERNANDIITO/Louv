import mongoose from 'mongoose';

const boxOuterMaterialSchema = new mongoose.Schema(
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

boxOuterMaterialSchema.index({ name: 1 });

const boxOuterMaterial = mongoose.model('BoxOuterMaterial', boxOuterMaterialSchema);

export default boxOuterMaterial;
