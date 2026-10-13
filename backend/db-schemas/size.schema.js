import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const sizeSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        system: {
            type: String,
            enum: louvEnums.MEASUREMENT_SYSTEMS,
            default: 'ES-IT',
            required: true,
        },
    },
    { strict: true }
);

const Size = mongoose.model('Size', sizeSchema);

sizeSchema.index({ name: 1 });

export default Size;
