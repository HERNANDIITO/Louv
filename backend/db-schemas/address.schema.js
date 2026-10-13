import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const addressSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        street: {
            type: String,
            required: true,
        },
        extraInfo: {
            // piso, puerta, derecha/izquieda... otros
            type: String,
        },
        postalCode: {
            type: String,
            required: true,
        },
        locality: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            enum: louvEnums.SPAIN_PROVINCES,
            required: true,
        },
        country: {
            type: String,
            required: true,
            enum: louvEnums.COUNTRIES,
            default: 'spain',
        },
    },
    { strict: true }
);

const Address = mongoose.model('Address', addressSchema);

addressSchema.index({ province: 1, locality: 1 });

export default Address;
export { addressSchema };
