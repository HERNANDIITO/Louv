import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema(
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
            required: true,
        },
        outerMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BoxOuterMaterial' }],
        innerMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BoxInnerMaterial' }],
        detailMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BoxDetailMaterial' }],
    },
    { strict: true }
);

boxSchema.index({ name: 1 });

const Box = mongoose.model('Box', boxSchema);

export default Box;
