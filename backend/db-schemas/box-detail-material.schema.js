import mongoose from 'mongoose';

// material para cierres de la caja, pequeños detalles
const boxDetailMaterialSchema = new mongoose.Schema(
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
            // nombre clase CSS
            type: String,
            required: true,
        },
        texture: {
            type: String,
        },
    },
    { strict: true }
);

boxDetailMaterialSchema.index({ name: 1 });

const boxDetailMaterial = mongoose.model('BoxDetailMaterial', boxDetailMaterialSchema);

export default boxDetailMaterial;
